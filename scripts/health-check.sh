#!/bin/bash

# =======================================================
# WordPress Multi-Site Health Check Script
# =======================================================
# Description: Comprehensive health check for all services
# Usage: ./health-check.sh [--detailed] [--json]
# =======================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/logs/health-check.log"

# Flags
DETAILED=false
JSON_OUTPUT=false
QUIET=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --detailed|-d)
            DETAILED=true
            shift
            ;;
        --json|-j)
            JSON_OUTPUT=true
            shift
            ;;
        --quiet|-q)
            QUIET=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--detailed] [--json] [--quiet]"
            echo "  --detailed, -d    Show detailed information"
            echo "  --json, -j        Output in JSON format"
            echo "  --quiet, -q       Suppress non-error output"
            exit 0
            ;;
        *)
            echo "Unknown parameter: $1"
            exit 1
            ;;
    esac
done

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    if [[ $JSON_OUTPUT == false ]]; then
        case $level in
            INFO)
                [[ $QUIET == false ]] && echo -e "${BLUE}[INFO]${NC} $message"
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
    fi
    
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Health check results storage
declare -A HEALTH_RESULTS

# Check if Docker is running
check_docker() {
    log "INFO" "Checking Docker daemon..."
    
    if ! docker info >/dev/null 2>&1; then
        log "ERROR" "Docker daemon is not running"
        HEALTH_RESULTS["docker"]="ERROR: Docker daemon not running"
        return 1
    fi
    
    log "SUCCESS" "Docker daemon is running"
    HEALTH_RESULTS["docker"]="OK"
    return 0
}

# Check Docker Compose services
check_docker_compose() {
    log "INFO" "Checking Docker Compose services..."
    
    cd "$PROJECT_DIR"
    
    if [[ ! -f "docker-compose.yml" ]]; then
        log "ERROR" "docker-compose.yml not found"
        HEALTH_RESULTS["docker_compose"]="ERROR: docker-compose.yml not found"
        return 1
    fi
    
    # Get running containers
    local running_containers
    running_containers=$(docker-compose ps --services --filter "status=running" 2>/dev/null || echo "")
    
    if [[ -z "$running_containers" ]]; then
        log "WARNING" "No Docker Compose services are running"
        HEALTH_RESULTS["docker_compose"]="WARNING: No services running"
        return 1
    fi
    
    log "SUCCESS" "Docker Compose services are running"
    HEALTH_RESULTS["docker_compose"]="OK"
    
    if [[ $DETAILED == true ]]; then
        log "INFO" "Running services: $running_containers"
    fi
    
    return 0
}

# Check individual containers
check_containers() {
    log "INFO" "Checking individual containers..."
    
    local containers=(
        "nginx-proxy"
        "mysql-server"
        "redis-cache"
    )
    
    # Get WordPress containers dynamically
    local wp_containers
    wp_containers=$(docker ps --format "table {{.Names}}" | grep -E ".*-wp$|.*-static$" | tail -n +2 || echo "")
    
    if [[ -n "$wp_containers" ]]; then
        while IFS= read -r container; do
            containers+=("$container")
        done <<< "$wp_containers"
    fi
    
    local failed_containers=()
    
    for container in "${containers[@]}"; do
        if docker inspect "$container" >/dev/null 2>&1; then
            local status
            status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "unknown")
            
            if [[ "$status" == "running" ]]; then
                log "SUCCESS" "Container $container is running"
                HEALTH_RESULTS["container_$container"]="OK"
                
                if [[ $DETAILED == true ]]; then
                    local uptime
                    uptime=$(docker inspect --format='{{.State.StartedAt}}' "$container" 2>/dev/null || echo "unknown")
                    log "INFO" "  Started: $uptime"
                fi
            else
                log "ERROR" "Container $container is not running (status: $status)"
                HEALTH_RESULTS["container_$container"]="ERROR: $status"
                failed_containers+=("$container")
            fi
        else
            log "WARNING" "Container $container not found"
            HEALTH_RESULTS["container_$container"]="WARNING: Not found"
        fi
    done
    
    if [[ ${#failed_containers[@]} -eq 0 ]]; then
        return 0
    else
        return 1
    fi
}

# Check MySQL database connectivity
check_mysql() {
    log "INFO" "Checking MySQL database connectivity..."
    
    if ! docker inspect mysql-server >/dev/null 2>&1; then
        log "ERROR" "MySQL container not found"
        HEALTH_RESULTS["mysql"]="ERROR: Container not found"
        return 1
    fi
    
    # Get MySQL root password from environment
    local mysql_password
    if [[ -f "$PROJECT_DIR/.env" ]]; then
        mysql_password=$(grep "MYSQL_ROOT_PASSWORD" "$PROJECT_DIR/.env" | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    fi
    
    if [[ -z "$mysql_password" ]]; then
        log "WARNING" "MySQL password not found in .env file"
        HEALTH_RESULTS["mysql"]="WARNING: Password not configured"
        return 1
    fi
    
    # Test MySQL connection
    if docker exec mysql-server mysql -u root -p"$mysql_password" -e "SELECT 1;" >/dev/null 2>&1; then
        log "SUCCESS" "MySQL database is accessible"
        HEALTH_RESULTS["mysql"]="OK"
        
        if [[ $DETAILED == true ]]; then
            local db_count
            db_count=$(docker exec mysql-server mysql -u root -p"$mysql_password" -e "SHOW DATABASES;" 2>/dev/null | wc -l)
            log "INFO" "  Databases count: $((db_count - 1))"
        fi
        
        return 0
    else
        log "ERROR" "Cannot connect to MySQL database"
        HEALTH_RESULTS["mysql"]="ERROR: Connection failed"
        return 1
    fi
}

# Check Redis connectivity
check_redis() {
    log "INFO" "Checking Redis connectivity..."
    
    if ! docker inspect redis-cache >/dev/null 2>&1; then
        log "ERROR" "Redis container not found"
        HEALTH_RESULTS["redis"]="ERROR: Container not found"
        return 1
    fi
    
    if docker exec redis-cache redis-cli ping >/dev/null 2>&1; then
        log "SUCCESS" "Redis is accessible"
        HEALTH_RESULTS["redis"]="OK"
        
        if [[ $DETAILED == true ]]; then
            local redis_info
            redis_info=$(docker exec redis-cache redis-cli info server | grep "redis_version" | cut -d':' -f2 | tr -d '\r\n')
            log "INFO" "  Redis version: $redis_info"
        fi
        
        return 0
    else
        log "ERROR" "Cannot connect to Redis"
        HEALTH_RESULTS["redis"]="ERROR: Connection failed"
        return 1
    fi
}

# Check website accessibility
check_websites() {
    log "INFO" "Checking website accessibility..."
    
    # Get domains from nginx configuration
    local domains=()
    if [[ -f "$PROJECT_DIR/nginx/conf.d/default.conf" ]]; then
        while IFS= read -r line; do
            if [[ $line =~ server_name[[:space:]]+([^;]+); ]]; then
                local server_names="${BASH_REMATCH[1]}"
                for domain in $server_names; do
                    if [[ $domain != "www."* ]] && [[ $domain != "_" ]]; then
                        domains+=("$domain")
                    fi
                done
            fi
        done < "$PROJECT_DIR/nginx/conf.d/default.conf"
    fi
    
    local failed_websites=()
    
    for domain in "${domains[@]}"; do
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://$domain" --connect-timeout 5 --max-time 10 2>/dev/null || echo "000")
        
        if [[ $http_code -ge 200 && $http_code -lt 400 ]]; then
            log "SUCCESS" "Website $domain is accessible (HTTP $http_code)"
            HEALTH_RESULTS["website_$domain"]="OK"
        else
            log "ERROR" "Website $domain is not accessible (HTTP $http_code)"
            HEALTH_RESULTS["website_$domain"]="ERROR: HTTP $http_code"
            failed_websites+=("$domain")
        fi
    done
    
    if [[ ${#failed_websites[@]} -eq 0 ]]; then
        return 0
    else
        return 1
    fi
}

# Check disk space
check_disk_space() {
    log "INFO" "Checking disk space..."
    
    local usage
    usage=$(df "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [[ $usage -gt 90 ]]; then
        log "ERROR" "Disk space critical: ${usage}% used"
        HEALTH_RESULTS["disk_space"]="ERROR: ${usage}% used"
        return 1
    elif [[ $usage -gt 80 ]]; then
        log "WARNING" "Disk space high: ${usage}% used"
        HEALTH_RESULTS["disk_space"]="WARNING: ${usage}% used"
        return 1
    else
        log "SUCCESS" "Disk space OK: ${usage}% used"
        HEALTH_RESULTS["disk_space"]="OK: ${usage}% used"
        return 0
    fi
}

# Check SSL certificates
check_ssl_certificates() {
    log "INFO" "Checking SSL certificates..."
    
    local ssl_dir="$PROJECT_DIR/ssl"
    local cert_count=0
    local expired_count=0
    
    if [[ -d "$ssl_dir" ]]; then
        for cert_file in "$ssl_dir"/*.crt; do
            if [[ -f "$cert_file" ]]; then
                cert_count=$((cert_count + 1))
                
                local expiry_date
                expiry_date=$(openssl x509 -in "$cert_file" -noout -enddate 2>/dev/null | cut -d'=' -f2)
                
                if [[ -n "$expiry_date" ]]; then
                    local expiry_epoch
                    expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
                    local current_epoch
                    current_epoch=$(date +%s)
                    local days_until_expiry
                    days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
                    
                    if [[ $days_until_expiry -lt 0 ]]; then
                        log "ERROR" "SSL certificate $cert_file has expired"
                        expired_count=$((expired_count + 1))
                    elif [[ $days_until_expiry -lt 30 ]]; then
                        log "WARNING" "SSL certificate $cert_file expires in $days_until_expiry days"
                    elif [[ $DETAILED == true ]]; then
                        log "INFO" "  Certificate $cert_file expires in $days_until_expiry days"
                    fi
                fi
            fi
        done
    fi
    
    if [[ $expired_count -gt 0 ]]; then
        HEALTH_RESULTS["ssl_certificates"]="ERROR: $expired_count expired certificates"
        return 1
    elif [[ $cert_count -eq 0 ]]; then
        HEALTH_RESULTS["ssl_certificates"]="WARNING: No SSL certificates found"
        return 1
    else
        HEALTH_RESULTS["ssl_certificates"]="OK: $cert_count certificates"
        return 0
    fi
}

# Output JSON results
output_json() {
    echo "{"
    echo "  \"timestamp\": \"$(date -Iseconds)\","
    echo "  \"overall_status\": \"$1\","
    echo "  \"checks\": {"
    
    local first=true
    for key in "${!HEALTH_RESULTS[@]}"; do
        if [[ $first == true ]]; then
            first=false
        else
            echo ","
        fi
        echo -n "    \"$key\": \"${HEALTH_RESULTS[$key]}\""
    done
    
    echo ""
    echo "  }"
    echo "}"
}

# Main health check function
main() {
    log "INFO" "Starting comprehensive health check..."
    log "INFO" "Project directory: $PROJECT_DIR"
    
    local overall_status="OK"
    local checks_passed=0
    local checks_failed=0
    
    # Run all health checks
    local checks=(
        "check_docker"
        "check_docker_compose" 
        "check_containers"
        "check_mysql"
        "check_redis"
        "check_websites"
        "check_disk_space"
        "check_ssl_certificates"
    )
    
    for check in "${checks[@]}"; do
        if $check; then
            checks_passed=$((checks_passed + 1))
        else
            checks_failed=$((checks_failed + 1))
            overall_status="FAILED"
        fi
    done
    
    # Output results
    if [[ $JSON_OUTPUT == true ]]; then
        output_json "$overall_status"
    else
        echo
        log "INFO" "Health check completed"
        log "INFO" "Checks passed: $checks_passed"
        log "INFO" "Checks failed: $checks_failed"
        
        if [[ $overall_status == "OK" ]]; then
            log "SUCCESS" "All systems are healthy! 🎉"
        else
            log "ERROR" "Some systems require attention! ⚠️"
        fi
    fi
    
    # Exit with appropriate code
    if [[ $overall_status == "OK" ]]; then
        exit 0
    else
        exit 1
    fi
}

# Run the main function
main "$@"