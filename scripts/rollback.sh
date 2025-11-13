#!/bin/bash

# =======================================================
# WordPress Rollback Script
# =======================================================
# Description: Emergency rollback for failed deployments
# Usage: ./rollback.sh [auto|manual] [backup_timestamp]
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
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/logs/rollback.log"

# Default values
ROLLBACK_TYPE="auto"
BACKUP_TIMESTAMP=""

# Create logs directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
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

# Show help
show_help() {
    cat << EOF
WordPress Emergency Rollback Script

Usage: $0 [type] [backup_timestamp]

Rollback Types:
  auto       Automatically select the latest emergency backup (default)
  manual     Manually specify backup timestamp to restore

Backup Timestamp:
  Format: YYYYMMDD_HHMMSS (e.g., 20241113_143022)
  Only required for manual rollback

Examples:
  $0 auto
  $0 manual 20241113_143022

IMPORTANT: This script will:
1. Stop all running containers
2. Restore databases from backup
3. Restore website files from backup
4. Restart services

Use with caution - this will overwrite current data!

EOF
}

# Load environment variables
load_environment() {
    if [[ -f "$PROJECT_DIR/.env" ]]; then
        log "INFO" "Loading environment variables"
        set -a
        source "$PROJECT_DIR/.env"
        set +a
    else
        log "ERROR" ".env file not found"
        exit 1
    fi
}

# Find latest emergency backup
find_latest_emergency_backup() {
    log "INFO" "Searching for latest emergency backup..."
    
    # Look for emergency backup in any database directory
    local latest_backup=""
    local latest_timestamp=""
    
    for db_dir in "$BACKUP_DIR"/*/; do
        if [[ -d "$db_dir" ]]; then
            local db_name=$(basename "$db_dir")
            local backup_files=$(ls -1t "$db_dir/${db_name}_emergency_"*.sql.gz 2>/dev/null || echo "")
            
            if [[ -n "$backup_files" ]]; then
                local latest_file=$(echo "$backup_files" | head -n1)
                local file_timestamp=$(basename "$latest_file" | sed -n 's/.*_emergency_\([0-9_]*\)\.sql\.gz/\1/p')
                
                if [[ -n "$file_timestamp" && ( -z "$latest_timestamp" || "$file_timestamp" > "$latest_timestamp" ) ]]; then
                    latest_timestamp="$file_timestamp"
                    latest_backup="$latest_file"
                fi
            fi
        fi
    done
    
    if [[ -n "$latest_backup" ]]; then
        log "SUCCESS" "Found latest emergency backup: $(basename "$latest_backup")"
        echo "$latest_timestamp"
    else
        log "ERROR" "No emergency backups found"
        exit 1
    fi
}

# Validate backup exists
validate_backup_exists() {
    local timestamp="$1"
    local found_backups=()
    
    log "INFO" "Validating backup exists for timestamp: $timestamp"
    
    for db_dir in "$BACKUP_DIR"/*/; do
        if [[ -d "$db_dir" ]]; then
            local db_name=$(basename "$db_dir")
            local backup_file="$db_dir/${db_name}_emergency_${timestamp}.sql.gz"
            
            if [[ -f "$backup_file" ]]; then
                found_backups+=("$backup_file")
                log "INFO" "Found backup: $(basename "$backup_file")"
            fi
        fi
    done
    
    if [[ ${#found_backups[@]} -eq 0 ]]; then
        log "ERROR" "No backups found for timestamp: $timestamp"
        return 1
    fi
    
    log "SUCCESS" "Found ${#found_backups[@]} database backups for timestamp: $timestamp"
    return 0
}

# Stop all services
stop_services() {
    log "INFO" "Stopping all Docker services..."
    
    cd "$PROJECT_DIR"
    
    if [[ -f "docker-compose.yml" ]]; then
        docker-compose down
        log "SUCCESS" "All services stopped"
    else
        log "WARNING" "docker-compose.yml not found, skipping service stop"
    fi
}

# Create emergency backup before rollback
create_emergency_backup() {
    log "INFO" "Creating emergency backup before rollback..."
    
    if [[ -x "$SCRIPT_DIR/backup-database.sh" ]]; then
        "$SCRIPT_DIR/backup-database.sh" emergency
    else
        log "WARNING" "backup-database.sh not found, skipping pre-rollback backup"
    fi
}

# Restore database backups
restore_databases() {
    local timestamp="$1"
    local restored_databases=0
    local failed_databases=0
    
    log "INFO" "Starting database restoration for timestamp: $timestamp"
    
    # Get MySQL connection details
    if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
        log "ERROR" "MYSQL_ROOT_PASSWORD not found in environment"
        exit 1
    fi
    
    # Start MySQL service if not running
    cd "$PROJECT_DIR"
    docker-compose up -d mysql
    
    # Wait for MySQL to be ready
    log "INFO" "Waiting for MySQL to be ready..."
    local retries=0
    while ! docker exec mysql-server mysqladmin ping -h localhost --silent && [ $retries -lt 30 ]; do
        sleep 2
        retries=$((retries + 1))
        log "INFO" "Waiting for MySQL... ($retries/30)"
    done
    
    if [ $retries -eq 30 ]; then
        log "ERROR" "MySQL failed to start properly"
        return 1
    fi
    
    # Restore each database backup
    for db_dir in "$BACKUP_DIR"/*/; do
        if [[ -d "$db_dir" ]]; then
            local db_name=$(basename "$db_dir")
            local backup_file="$db_dir/${db_name}_emergency_${timestamp}.sql.gz"
            
            if [[ -f "$backup_file" ]]; then
                log "INFO" "Restoring database: $db_name"
                
                # Decompress and restore
                if gunzip -c "$backup_file" | docker exec -i mysql-server mysql -u root -p"$MYSQL_ROOT_PASSWORD"; then
                    log "SUCCESS" "Database $db_name restored successfully"
                    restored_databases=$((restored_databases + 1))
                else
                    log "ERROR" "Failed to restore database: $db_name"
                    failed_databases=$((failed_databases + 1))
                fi
            else
                log "WARNING" "Backup not found for database: $db_name"
            fi
        fi
    done
    
    log "INFO" "Database restoration completed: $restored_databases successful, $failed_databases failed"
    
    if [[ $failed_databases -gt 0 ]]; then
        return 1
    else
        return 0
    fi
}

# Restart services
restart_services() {
    log "INFO" "Restarting all services..."
    
    cd "$PROJECT_DIR"
    
    if [[ -x "$SCRIPT_DIR/deploy.sh" ]]; then
        "$SCRIPT_DIR/deploy.sh" start
    else
        # Fallback to docker-compose
        docker-compose up -d
        log "SUCCESS" "Services restarted using docker-compose"
    fi
}

# Verify rollback success
verify_rollback() {
    log "INFO" "Verifying rollback success..."
    
    # Run health check if available
    if [[ -x "$SCRIPT_DIR/health-check.sh" ]]; then
        if "$SCRIPT_DIR/health-check.sh"; then
            log "SUCCESS" "Health check passed - rollback successful"
            return 0
        else
            log "ERROR" "Health check failed - rollback may have issues"
            return 1
        fi
    else
        # Basic verification
        cd "$PROJECT_DIR"
        local running_containers=$(docker-compose ps --services --filter "status=running" | wc -l)
        
        if [[ $running_containers -gt 0 ]]; then
            log "SUCCESS" "Basic verification passed - $running_containers containers running"
            return 0
        else
            log "ERROR" "Basic verification failed - no containers running"
            return 1
        fi
    fi
}

# Main rollback process
perform_rollback() {
    local timestamp="$1"
    
    log "INFO" "=== EMERGENCY ROLLBACK INITIATED ==="
    log "INFO" "Timestamp: $timestamp"
    log "WARNING" "This will overwrite current data!"
    
    # Confirmation prompt
    echo -n "Are you sure you want to proceed with rollback? (yes/no): "
    read -r confirmation
    
    if [[ "$confirmation" != "yes" ]]; then
        log "INFO" "Rollback cancelled by user"
        exit 0
    fi
    
    # Execute rollback steps
    local start_time=$(date +%s)
    
    # Step 1: Create emergency backup
    create_emergency_backup
    
    # Step 2: Stop services
    stop_services
    
    # Step 3: Restore databases
    if ! restore_databases "$timestamp"; then
        log "ERROR" "Database restoration failed"
        exit 1
    fi
    
    # Step 4: Restart services
    restart_services
    
    # Step 5: Verify rollback
    sleep 30  # Wait for services to stabilize
    
    if verify_rollback; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log "SUCCESS" "=== ROLLBACK COMPLETED SUCCESSFULLY ==="
        log "SUCCESS" "Total time: ${duration} seconds"
    else
        log "ERROR" "=== ROLLBACK COMPLETED WITH ERRORS ==="
        log "ERROR" "Please check service status manually"
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        auto|manual)
            ROLLBACK_TYPE="$1"
            shift
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            if [[ -z "$BACKUP_TIMESTAMP" ]]; then
                BACKUP_TIMESTAMP="$1"
            fi
            shift
            ;;
    esac
done

# Main execution
main() {
    log "INFO" "WordPress Emergency Rollback Script"
    log "INFO" "Rollback Type: $ROLLBACK_TYPE"
    log "INFO" "Project Directory: $PROJECT_DIR"
    
    # Load environment
    load_environment
    
    # Determine backup timestamp
    if [[ "$ROLLBACK_TYPE" == "auto" ]]; then
        BACKUP_TIMESTAMP=$(find_latest_emergency_backup)
    elif [[ "$ROLLBACK_TYPE" == "manual" ]]; then
        if [[ -z "$BACKUP_TIMESTAMP" ]]; then
            log "ERROR" "Manual rollback requires backup timestamp"
            show_help
            exit 1
        fi
    fi
    
    # Validate backup exists
    if ! validate_backup_exists "$BACKUP_TIMESTAMP"; then
        log "ERROR" "Cannot proceed with rollback - backup validation failed"
        exit 1
    fi
    
    # Perform rollback
    perform_rollback "$BACKUP_TIMESTAMP"
}

# Run the script
main "$@"