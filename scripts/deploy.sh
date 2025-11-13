#!/bin/bash

# =======================================================
# WordPress Multi-Site Deployment Script
# =======================================================
# Description: Enhanced deployment and management script
# Usage: ./deploy.sh [action] [environment]
# =======================================================

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
ENV_FILE="$PROJECT_DIR/.env"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="production"
ACTION=""

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Enhanced logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        INFO)
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        SUCCESS)
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        WARNING)
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} $message" >&2
            ;;
    esac
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Legacy functions for backward compatibility
error() {
    log "ERROR" "$1"
}

warning() {
    log "WARNING" "$1"
}

info() {
    log "INFO" "$1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log "Dependencies check completed successfully."
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    
    mkdir -p $BACKUP_DIR/{mysql,websites}
    mkdir -p $LOG_DIR/{nginx,mysql,php}
    mkdir -p ssl
    
    log "Directories created successfully."
}

# Check if .env file exists
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        error ".env file not found. Please create it from the template."
        exit 1
    fi
    
    log "Environment file found."
}

# Start services
start_services() {
    log "Starting Docker services..."
    
    check_dependencies
    setup_directories
    check_env_file
    
    # Pull latest images
    docker-compose pull
    
    # Build and start services
    docker-compose up -d --build
    
    log "Services started successfully."
    
    # Wait for services to be ready
    sleep 30
    
    # Check service health
    check_services_health
}

# Stop services
stop_services() {
    log "Stopping Docker services..."
    
    docker-compose down
    
    log "Services stopped successfully."
}

# Restart services
restart_services() {
    log "Restarting Docker services..."
    
    stop_services
    sleep 5
    start_services
}

# Update services
update_services() {
    log "Updating Docker services..."
    
    # Create backup before update
    backup_all
    
    # Pull latest images
    docker-compose pull
    
    # Recreate containers with new images
    docker-compose up -d --force-recreate
    
    log "Services updated successfully."
}

# Show logs
show_logs() {
    local service=${1:-}
    
    if [ -n "$service" ]; then
        docker-compose logs -f $service
    else
        docker-compose logs -f
    fi
}

# Check services health
check_services_health() {
    log "Checking services health..."
    
    local services=("nginx" "mysql" "redis" "electroromanos" "freshexpress" "sabeel" "sabeelacademy" "sumo" "yvesmorel" "zonemation" "airarom")
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            info "$service: ${GREEN}Running${NC}"
        else
            warning "$service: ${RED}Not Running${NC}"
        fi
    done
}

# Backup function
backup_all() {
    log "Starting backup process..."
    
    local backup_date=$(date +'%Y%m%d_%H%M%S')
    local backup_path="$BACKUP_DIR/backup_$backup_date"
    
    mkdir -p "$backup_path"
    
    # Backup MySQL databases
    log "Backing up MySQL databases..."
    
    local databases=("airarom_wp" "electroromanos_wp" "freshexpress_wp" "sabeel_wp" "sabeelacademy_wp" "sumo_wp" "yvesmorel_wp" "zonemation_wp")
    
    for db in "${databases[@]}"; do
        docker-compose exec -T mysql mysqldump -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" "$db" > "$backup_path/${db}.sql"
        info "Backed up database: $db"
    done
    
    # Backup website files
    log "Backing up website files..."
    
    local sites=("airarom.ma" "electroromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com")
    
    for site in "${sites[@]}"; do
        if [ -d "$site" ]; then
            tar -czf "$backup_path/${site}_files.tar.gz" "$site"
            info "Backed up website files: $site"
        fi
    done
    
    # Backup Docker volumes
    log "Backing up Docker volumes..."
    docker run --rm -v wp-project_mysql_data:/data -v "$PWD/$backup_path":/backup ubuntu tar czf /backup/mysql_data.tar.gz /data
    
    log "Backup completed: $backup_path"
}

# Install SSL certificates (Let's Encrypt)
install_ssl() {
    log "Installing SSL certificates..."
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        warning "Certbot not found. Installing..."
        apt-get update && apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Generate certificates for each domain
    local domains=("airarom.ma" "electroromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com")
    
    for domain in "${domains[@]}"; do
        info "Generating certificate for $domain"
        certbot certonly --standalone -d "$domain" -d "www.$domain" --agree-tos --register-unsafely-without-email
    done
    
    # Copy certificates to ssl directory
    cp -r /etc/letsencrypt/live/* ssl/
    
    log "SSL certificates installed successfully."
}

# Monitor resources
monitor_resources() {
    log "System Resource Monitoring"
    
    echo "=== Docker Container Status ==="
    docker-compose ps
    
    echo "=== Docker Container Stats ==="
    docker stats --no-stream
    
    echo "=== System Resource Usage ==="
    free -h
    df -h
    
    echo "=== Recent Container Logs ==="
    docker-compose logs --tail=50
}

# Main function
main() {
    case "${1:-start}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        update)
            update_services
            ;;
        logs)
            show_logs ${2:-}
            ;;
        backup)
            backup_all
            ;;
        ssl)
            install_ssl
            ;;
        monitor)
            monitor_resources
            ;;
        health)
            check_services_health
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|update|logs|backup|ssl|monitor|health}"
            echo ""
            echo "Commands:"
            echo "  start    - Start all Docker services"
            echo "  stop     - Stop all Docker services"
            echo "  restart  - Restart all Docker services"
            echo "  update   - Update and restart services with new images"
            echo "  logs     - Show logs (optionally specify service name)"
            echo "  backup   - Create backup of databases and files"
            echo "  ssl      - Install SSL certificates with Let's Encrypt"
            echo "  monitor  - Show system and container resource usage"
            echo "  health   - Check health of all services"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"