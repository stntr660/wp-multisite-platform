#!/bin/bash

# =======================================================
# WordPress Database Backup Script
# =======================================================
# Description: Automated database backup and rotation
# Usage: ./backup-database.sh [auto|manual|emergency] [database_name]
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
LOG_FILE="$PROJECT_DIR/logs/backup.log"

# Default values
BACKUP_TYPE="auto"
DATABASE_NAME=""
RETENTION_DAYS=30
MAX_BACKUPS_PER_DB=10

# Create directories if they don't exist
mkdir -p "$BACKUP_DIR" "$(dirname "$LOG_FILE")"

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
WordPress Database Backup Script

Usage: $0 [type] [database_name]

Backup Types:
  auto       Automatic scheduled backup (default)
  manual     Manual backup triggered by user
  emergency  Emergency backup before major operations

Database Names:
  If not specified, all databases will be backed up
  Available databases are read from .env file

Options:
  --retention-days N   Keep backups for N days (default: 30)
  --max-backups N      Keep maximum N backups per database (default: 10)
  --help              Show this help message

Examples:
  $0 auto
  $0 manual freshexpress_wp
  $0 emergency --retention-days 60

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

# Get MySQL connection details
get_mysql_details() {
    if [[ -z "$MYSQL_ROOT_PASSWORD" ]]; then
        log "ERROR" "MYSQL_ROOT_PASSWORD not found in environment"
        exit 1
    fi
    
    MYSQL_HOST="mysql"
    MYSQL_USER="root"
    MYSQL_PASSWORD="$MYSQL_ROOT_PASSWORD"
}

# Get list of WordPress databases
get_wordpress_databases() {
    local databases=()
    
    # Extract database names from environment variables
    while IFS= read -r line; do
        if [[ $line =~ ^[A-Z_]+_DB_NAME= ]]; then
            local db_name=$(echo "$line" | cut -d'=' -f2 | tr -d '"' | tr -d "'")
            if [[ -n "$db_name" ]]; then
                databases+=("$db_name")
            fi
        fi
    done < "$PROJECT_DIR/.env"
    
    echo "${databases[@]}"
}

# Check if database exists
database_exists() {
    local db_name="$1"
    
    local exists=$(docker exec mysql-server mysql \
        -h "$MYSQL_HOST" \
        -u "$MYSQL_USER" \
        -p"$MYSQL_PASSWORD" \
        -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='$db_name';" \
        --skip-column-names 2>/dev/null || echo "")
    
    [[ -n "$exists" ]]
}

# Create database backup
backup_database() {
    local db_name="$1"
    local backup_type="$2"
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="$BACKUP_DIR/${db_name}_${backup_type}_${timestamp}.sql"
    
    log "INFO" "Creating backup for database: $db_name"
    
    # Check if database exists
    if ! database_exists "$db_name"; then
        log "WARNING" "Database $db_name does not exist, skipping"
        return 0
    fi
    
    # Create backup directory for this database
    local db_backup_dir="$BACKUP_DIR/$db_name"
    mkdir -p "$db_backup_dir"
    
    # Update backup file path
    backup_file="$db_backup_dir/${db_name}_${backup_type}_${timestamp}.sql"
    
    # Create the backup
    if docker exec mysql-server mysqldump \
        -h "$MYSQL_HOST" \
        -u "$MYSQL_USER" \
        -p"$MYSQL_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --add-drop-database \
        --databases "$db_name" > "$backup_file" 2>/dev/null; then
        
        # Compress the backup
        gzip "$backup_file"
        local compressed_file="${backup_file}.gz"
        
        # Get file size
        local file_size=$(du -h "$compressed_file" | cut -f1)
        
        log "SUCCESS" "Database backup completed: $(basename "$compressed_file") ($file_size)"
        
        # Create metadata file
        cat > "${compressed_file}.meta" << EOF
{
    "database": "$db_name",
    "backup_type": "$backup_type",
    "timestamp": "$timestamp",
    "date": "$(date -Iseconds)",
    "file_size": "$file_size",
    "mysql_version": "$(docker exec mysql-server mysql --version)",
    "compression": "gzip"
}
EOF
        
        return 0
    else
        log "ERROR" "Failed to backup database: $db_name"
        rm -f "$backup_file" 2>/dev/null || true
        return 1
    fi
}

# Clean old backups
cleanup_old_backups() {
    local db_name="$1"
    local db_backup_dir="$BACKUP_DIR/$db_name"
    
    if [[ ! -d "$db_backup_dir" ]]; then
        return 0
    fi
    
    log "INFO" "Cleaning up old backups for: $db_name"
    
    # Remove backups older than retention days
    find "$db_backup_dir" -name "${db_name}_*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Keep only the latest N backups per type
    for backup_type in auto manual emergency; do
        local count=$(ls -1 "$db_backup_dir/${db_name}_${backup_type}_"*.sql.gz 2>/dev/null | wc -l)
        
        if [[ $count -gt $MAX_BACKUPS_PER_DB ]]; then
            local to_remove=$((count - MAX_BACKUPS_PER_DB))
            ls -1t "$db_backup_dir/${db_name}_${backup_type}_"*.sql.gz | tail -n $to_remove | xargs rm -f
            
            # Also remove corresponding metadata files
            ls -1t "$db_backup_dir/${db_name}_${backup_type}_"*.sql.gz.meta 2>/dev/null | tail -n $to_remove | xargs rm -f 2>/dev/null || true
            
            log "INFO" "Removed $to_remove old $backup_type backups for $db_name"
        fi
    done
}

# Backup all databases
backup_all_databases() {
    local backup_type="$1"
    local databases
    local failed_backups=0
    local successful_backups=0
    
    # Get list of WordPress databases
    read -ra databases <<< "$(get_wordpress_databases)"
    
    if [[ ${#databases[@]} -eq 0 ]]; then
        log "WARNING" "No WordPress databases found in environment"
        return 1
    fi
    
    log "INFO" "Starting $backup_type backup for ${#databases[@]} databases"
    
    for db_name in "${databases[@]}"; do
        if backup_database "$db_name" "$backup_type"; then
            cleanup_old_backups "$db_name"
            successful_backups=$((successful_backups + 1))
        else
            failed_backups=$((failed_backups + 1))
        fi
    done
    
    log "INFO" "Backup completed: $successful_backups successful, $failed_backups failed"
    
    if [[ $failed_backups -gt 0 ]]; then
        return 1
    else
        return 0
    fi
}

# Generate backup report
generate_backup_report() {
    local report_file="$BACKUP_DIR/backup_report.txt"
    
    log "INFO" "Generating backup report"
    
    cat > "$report_file" << EOF
WordPress Database Backup Report
Generated: $(date)
=================================

Backup Directory: $BACKUP_DIR
Retention Policy: $RETENTION_DAYS days
Max Backups per DB: $MAX_BACKUPS_PER_DB

Database Backup Summary:
EOF
    
    # List all database backup directories
    for db_dir in "$BACKUP_DIR"/*/; do
        if [[ -d "$db_dir" ]]; then
            local db_name=$(basename "$db_dir")
            echo "" >> "$report_file"
            echo "Database: $db_name" >> "$report_file"
            echo "------------------------" >> "$report_file"
            
            # Count backups by type
            local auto_count=$(ls -1 "$db_dir/${db_name}_auto_"*.sql.gz 2>/dev/null | wc -l)
            local manual_count=$(ls -1 "$db_dir/${db_name}_manual_"*.sql.gz 2>/dev/null | wc -l)
            local emergency_count=$(ls -1 "$db_dir/${db_name}_emergency_"*.sql.gz 2>/dev/null | wc -l)
            
            echo "  Auto backups: $auto_count" >> "$report_file"
            echo "  Manual backups: $manual_count" >> "$report_file"
            echo "  Emergency backups: $emergency_count" >> "$report_file"
            
            # Show latest backup
            local latest_backup=$(ls -1t "$db_dir/"*.sql.gz 2>/dev/null | head -n1)
            if [[ -n "$latest_backup" ]]; then
                local backup_date=$(stat -c %y "$latest_backup" 2>/dev/null || stat -f %Sm "$latest_backup" 2>/dev/null || echo "Unknown")
                local backup_size=$(du -h "$latest_backup" | cut -f1)
                echo "  Latest backup: $(basename "$latest_backup") ($backup_size) - $backup_date" >> "$report_file"
            else
                echo "  Latest backup: None found" >> "$report_file"
            fi
        fi
    done
    
    log "SUCCESS" "Backup report generated: $report_file"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        auto|manual|emergency)
            BACKUP_TYPE="$1"
            shift
            ;;
        --retention-days)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --max-backups)
            MAX_BACKUPS_PER_DB="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            if [[ -z "$DATABASE_NAME" ]]; then
                DATABASE_NAME="$1"
            fi
            shift
            ;;
    esac
done

# Main execution
main() {
    log "INFO" "WordPress Database Backup Script"
    log "INFO" "Backup Type: $BACKUP_TYPE"
    log "INFO" "Project Directory: $PROJECT_DIR"
    
    # Load environment and check MySQL
    load_environment
    get_mysql_details
    
    # Check if MySQL container is running
    if ! docker inspect mysql-server >/dev/null 2>&1; then
        log "ERROR" "MySQL container not found or not running"
        exit 1
    fi
    
    # Backup specific database or all databases
    if [[ -n "$DATABASE_NAME" ]]; then
        log "INFO" "Backing up specific database: $DATABASE_NAME"
        if backup_database "$DATABASE_NAME" "$BACKUP_TYPE"; then
            cleanup_old_backups "$DATABASE_NAME"
            log "SUCCESS" "Database backup completed successfully"
        else
            log "ERROR" "Database backup failed"
            exit 1
        fi
    else
        log "INFO" "Backing up all WordPress databases"
        if backup_all_databases "$BACKUP_TYPE"; then
            log "SUCCESS" "All database backups completed successfully"
        else
            log "ERROR" "Some database backups failed"
            exit 1
        fi
    fi
    
    # Generate backup report
    generate_backup_report
    
    log "SUCCESS" "Backup process completed"
}

# Run the script
main "$@"