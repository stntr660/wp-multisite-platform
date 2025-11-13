#!/bin/bash

# Enhanced WordPress Multi-Site Docker Deployment Script
# Supports multiple environments with advanced features
# Usage: ./deploy-enhanced.sh [command] [environment] [options]

set -e

# Configuration
DEFAULT_ENV="production"
COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="./backups"
LOG_DIR="./logs"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Global variables
ENVIRONMENT="${2:-$DEFAULT_ENV}"
ENV_FILE=".env"
VERBOSE=false
DRY_RUN=false
FORCE=false

# Logging functions
timestamp() {
    date +'%Y-%m-%d %H:%M:%S'
}

log() {
    echo -e "${GREEN}[$(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
}

error() {
    echo -e "${RED}[ERROR $(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING $(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
}

info() {
    echo -e "${BLUE}[INFO $(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
}

debug() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${CYAN}[DEBUG $(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
    fi
}

success() {
    echo -e "${PURPLE}[SUCCESS $(timestamp)]${NC} $1" | tee -a "$LOG_DIR/deploy.log"
}

# Parse command line options
parse_options() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -n|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -e|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done
}

# Environment validation
validate_environment() {
    case "$ENVIRONMENT" in
        production|staging|development)
            info "Environment: $ENVIRONMENT"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Use: production, staging, or development"
            ;;
    esac
    
    # Set environment-specific configuration
    case "$ENVIRONMENT" in
        staging)
            ENV_FILE=".env.staging"
            ;;
        development)
            ENV_FILE=".env.development"
            ;;
        *)
            ENV_FILE=".env"
            ;;
    esac
}

# Pre-flight checks
preflight_checks() {
    log "Running pre-flight checks..."
    
    # Check if we're in the right directory
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        error "docker-compose.yml not found. Are you in the correct directory?"
    fi
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running or not accessible"
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        error "Docker Compose is not installed"
    fi
    
    # Check environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found"
    fi
    
    # Create necessary directories
    mkdir -p "$BACKUP_DIR" "$LOG_DIR" ssl
    
    # Validate environment variables
    source "$ENV_FILE"
    required_vars=("MYSQL_ROOT_PASSWORD")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            error "Required environment variable $var is not set in $ENV_FILE"
        fi
    done
    
    success "Pre-flight checks completed"
}

# Health check functions
check_service_health() {
    local service="$1"
    local max_attempts="${2:-30}"
    local attempt=1
    
    info "Checking health of service: $service"
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker-compose ps "$service" 2>/dev/null | grep -q "Up"; then
            success "Service $service is healthy"
            return 0
        fi
        
        debug "Attempt $attempt/$max_attempts: $service not ready yet"
        sleep 2
        ((attempt++))
    done
    
    error "Service $service failed health check after $max_attempts attempts"
}

check_database_health() {
    info "Checking database connectivity..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
            success "Database is accessible"
            return 0
        fi
        
        debug "Attempt $attempt/$max_attempts: Database not ready yet"
        sleep 2
        ((attempt++))
    done
    
    error "Database health check failed after $max_attempts attempts"
}

check_redis_health() {
    info "Checking Redis connectivity..."
    
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        success "Redis is accessible"
    else
        warning "Redis is not accessible (this may be expected if Redis is not used)"
    fi
}

# Deployment functions
deploy_environment() {
    log "Starting deployment for environment: $ENVIRONMENT"
    
    if [[ "$DRY_RUN" = true ]]; then
        info "DRY RUN MODE - No actual changes will be made"
    fi
    
    # Create backup before deployment
    if [[ "$ENVIRONMENT" = "production" || "$FORCE" = true ]]; then
        create_backup "pre-deployment"
    fi
    
    # Pull latest images
    info "Pulling latest Docker images..."
    if [[ "$DRY_RUN" = false ]]; then
        docker-compose --env-file "$ENV_FILE" pull
    fi
    
    # Build and start services
    info "Building and starting services..."
    if [[ "$DRY_RUN" = false ]]; then
        docker-compose --env-file "$ENV_FILE" up -d --build
    fi
    
    # Health checks
    if [[ "$DRY_RUN" = false ]]; then
        sleep 10
        check_service_health "mysql"
        check_database_health
        check_redis_health
        
        # Check WordPress services
        local wp_services=("airarom" "electroromanos" "freshexpress" "sabeel" "sabeelacademy" "sumo" "yvesmorel" "zonemation")
        for service in "${wp_services[@]}"; do
            check_service_health "$service"
        done
        
        # Check nginx
        check_service_health "nginx-proxy"
    fi
    
    success "Deployment completed successfully for environment: $ENVIRONMENT"
}

# Backup functions
create_backup() {
    local backup_type="${1:-manual}"
    local timestamp=$(date +'%Y%m%d_%H%M%S')
    local backup_name="${backup_type}_${ENVIRONMENT}_${timestamp}"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    log "Creating backup: $backup_name"
    
    if [[ "$DRY_RUN" = true ]]; then
        info "DRY RUN: Would create backup at $backup_path"
        return 0
    fi
    
    mkdir -p "$backup_path"
    
    # Database backup
    info "Backing up databases..."
    local databases=()
    
    # Determine databases based on environment
    case "$ENVIRONMENT" in
        staging)
            databases=("staging_airarom_wp" "staging_electroromanos_wp" "staging_freshexpress_wp" "staging_sabeel_wp" "staging_sabeelacademy_wp" "staging_sumo_wp" "staging_yvesmorel_wp" "staging_zonemation_wp")
            ;;
        *)
            databases=("airarom_wp" "electroromanos_wp" "freshexpress_wp" "sabeel_wp" "sabeelacademy_wp" "sumo_wp" "yvesmorel_wp" "zonemation_wp")
            ;;
    esac
    
    for db in "${databases[@]}"; do
        debug "Backing up database: $db"
        if docker-compose exec -T mysql mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers "$db" 2>/dev/null > "$backup_path/${db}.sql"; then
            gzip "$backup_path/${db}.sql"
            debug "Database $db backed up successfully"
        else
            warning "Failed to backup database: $db (may not exist)"
        fi
    done
    
    # File backup
    info "Backing up website files..."
    local sites=("airarom.ma" "electroromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com")
    
    for site in "${sites[@]}"; do
        if [[ -d "$site" ]]; then
            debug "Backing up files for: $site"
            tar -czf "$backup_path/${site}_files.tar.gz" "$site" 2>/dev/null
        fi
    done
    
    # Configuration backup
    info "Backing up configurations..."
    tar -czf "$backup_path/config.tar.gz" \
        "$COMPOSE_FILE" \
        nginx/ \
        scripts/ \
        "$ENV_FILE" \
        mysql/init/ 2>/dev/null || warning "Some configuration files may be missing"
    
    # Create backup manifest
    cat > "$backup_path/manifest.json" << EOF
{
    "backup_name": "$backup_name",
    "backup_type": "$backup_type",
    "environment": "$ENVIRONMENT",
    "timestamp": "$timestamp",
    "date": "$(date -Iseconds)",
    "databases": $(printf '%s\n' "${databases[@]}" | jq -R . | jq -s .),
    "websites": $(printf '%s\n' "${sites[@]}" | jq -R . | jq -s .),
    "size": "$(du -sh "$backup_path" 2>/dev/null | cut -f1 || echo 'unknown')"
}
EOF
    
    success "Backup created: $backup_path"
}

# Rollback function
rollback_deployment() {
    local backup_name="$1"
    
    if [[ -z "$backup_name" ]]; then
        # Find latest backup
        backup_name=$(ls -1t "$BACKUP_DIR" | grep "pre-deployment_${ENVIRONMENT}" | head -n1)
    fi
    
    if [[ -z "$backup_name" ]]; then
        error "No backup found for rollback"
    fi
    
    local backup_path="$BACKUP_DIR/$backup_name"
    
    if [[ ! -d "$backup_path" ]]; then
        error "Backup not found: $backup_path"
    fi
    
    warning "Starting rollback to: $backup_name"
    
    if [[ "$DRY_RUN" = true ]]; then
        info "DRY RUN: Would rollback to $backup_name"
        return 0
    fi
    
    # Stop services
    info "Stopping current services..."
    docker-compose down
    
    # Restore databases
    info "Restoring databases..."
    docker-compose up -d mysql
    check_database_health
    
    for db_backup in "$backup_path"/*.sql.gz; do
        if [[ -f "$db_backup" ]]; then
            local db_name=$(basename "$db_backup" .sql.gz)
            debug "Restoring database: $db_name"
            
            # Drop and recreate database
            docker-compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "DROP DATABASE IF EXISTS $db_name; CREATE DATABASE $db_name;"
            
            # Restore data
            gunzip -c "$db_backup" | docker-compose exec -T mysql mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$db_name"
        fi
    done
    
    # Restore files
    info "Restoring website files..."
    for file_backup in "$backup_path"/*_files.tar.gz; do
        if [[ -f "$file_backup" ]]; then
            debug "Extracting: $(basename "$file_backup")"
            tar -xzf "$file_backup" -C . 2>/dev/null || warning "Failed to extract $(basename "$file_backup")"
        fi
    done
    
    # Restore configuration
    if [[ -f "$backup_path/config.tar.gz" ]]; then
        info "Restoring configurations..."
        tar -xzf "$backup_path/config.tar.gz" -C . 2>/dev/null || warning "Failed to restore configurations"
    fi
    
    # Restart services
    info "Restarting services..."
    docker-compose --env-file "$ENV_FILE" up -d
    
    success "Rollback completed successfully"
}

# SSL certificate management
manage_ssl() {
    local action="${1:-install}"
    
    case "$action" in
        install|renew)
            info "Managing SSL certificates: $action"
            
            # Install certbot if not present
            if ! command -v certbot >/dev/null 2>&1; then
                warning "Certbot not found. Please install certbot first."
                return 1
            fi
            
            local domains=()
            case "$ENVIRONMENT" in
                staging)
                    domains=("staging-airarom.ma" "staging-electroromanos.ma" "staging-freshexpress.ma")
                    ;;
                *)
                    domains=("airarom.ma" "electroromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com")
                    ;;
            esac
            
            for domain in "${domains[@]}"; do
                info "Processing SSL certificate for: $domain"
                
                if [[ "$DRY_RUN" = false ]]; then
                    certbot certonly --standalone \
                        -d "$domain" \
                        -d "www.$domain" \
                        --agree-tos \
                        --register-unsafely-without-email \
                        --staging=$([ "$ENVIRONMENT" = "staging" ] && echo "true" || echo "false") \
                        --non-interactive || warning "SSL certificate generation failed for $domain"
                fi
            done
            
            success "SSL certificate management completed"
            ;;
        check)
            info "Checking SSL certificate status..."
            
            for cert in ssl/*/cert.pem; do
                if [[ -f "$cert" ]]; then
                    local domain=$(basename "$(dirname "$cert")")
                    local expiry=$(openssl x509 -enddate -noout -in "$cert" | cut -d= -f2)
                    local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null || echo 0)
                    local now_epoch=$(date +%s)
                    local days_left=$(( (expiry_epoch - now_epoch) / 86400 ))
                    
                    if [[ $days_left -lt 30 ]]; then
                        warning "Certificate for $domain expires in $days_left days"
                    else
                        info "Certificate for $domain expires in $days_left days"
                    fi
                fi
            done
            ;;
    esac
}

# Monitoring functions
show_status() {
    info "System Status for environment: $ENVIRONMENT"
    
    echo "=== Docker Services ==="
    docker-compose ps 2>/dev/null || warning "Failed to get Docker Compose status"
    
    echo -e "\n=== Container Stats ==="
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}" 2>/dev/null || warning "Failed to get container stats"
    
    echo -e "\n=== System Resources ==="
    echo "Memory:"
    free -h 2>/dev/null || warning "Failed to get memory info"
    
    echo -e "\nDisk:"
    df -h 2>/dev/null || warning "Failed to get disk info"
    
    echo -e "\n=== Recent Logs ==="
    if [[ -f "$LOG_DIR/deploy.log" ]]; then
        tail -20 "$LOG_DIR/deploy.log"
    else
        warning "No deployment logs found"
    fi
}

# Main function
show_help() {
    cat << EOF
Enhanced WordPress Multi-Site Deployment Script

Usage: $0 [COMMAND] [ENVIRONMENT] [OPTIONS]

Commands:
    deploy          Deploy the application
    start           Start services
    stop            Stop services  
    restart         Restart services
    backup          Create backup
    rollback        Rollback to previous backup
    ssl             Manage SSL certificates
    status          Show system status
    logs            Show logs
    health          Run health checks

Environments:
    production      Production environment (default)
    staging         Staging environment
    development     Development environment

Options:
    -v, --verbose   Enable verbose logging
    -n, --dry-run   Show what would be done without executing
    -f, --force     Force operation (skip confirmations)
    -e, --env ENV   Specify environment explicitly

Examples:
    $0 deploy production
    $0 backup staging --verbose
    $0 rollback production --dry-run
    $0 ssl check
    $0 status --env staging

Environment files:
    production      .env
    staging         .env.staging
    development     .env.development
EOF
}

# Main execution
main() {
    local command="${1:-help}"
    
    # Parse options before setting environment
    parse_options "$@"
    
    # Validate environment
    validate_environment
    
    # Change to project directory
    cd "$PROJECT_DIR"
    
    # Run preflight checks for most commands
    case "$command" in
        help|ssl)
            ;;
        *)
            preflight_checks
            ;;
    esac
    
    # Execute command
    case "$command" in
        deploy)
            deploy_environment
            ;;
        start)
            log "Starting services for environment: $ENVIRONMENT"
            if [[ "$DRY_RUN" = false ]]; then
                docker-compose --env-file "$ENV_FILE" up -d
            fi
            success "Services started"
            ;;
        stop)
            log "Stopping services for environment: $ENVIRONMENT"
            if [[ "$DRY_RUN" = false ]]; then
                docker-compose down
            fi
            success "Services stopped"
            ;;
        restart)
            log "Restarting services for environment: $ENVIRONMENT"
            if [[ "$DRY_RUN" = false ]]; then
                docker-compose down
                sleep 5
                docker-compose --env-file "$ENV_FILE" up -d
            fi
            success "Services restarted"
            ;;
        backup)
            create_backup "manual"
            ;;
        rollback)
            rollback_deployment "$3"
            ;;
        ssl)
            manage_ssl "${3:-install}"
            ;;
        status)
            show_status
            ;;
        logs)
            local service="${3:-}"
            if [[ -n "$service" ]]; then
                docker-compose logs -f "$service"
            else
                docker-compose logs -f
            fi
            ;;
        health)
            check_database_health
            check_redis_health
            success "Health checks completed"
            ;;
        help)
            show_help
            ;;
        *)
            error "Unknown command: $command. Use '$0 help' for usage information."
            ;;
    esac
}

# Run main function with all arguments
main "$@"