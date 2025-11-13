#!/bin/bash

# WordPress Multi-Site Backup Script
# Automated backup for all WordPress sites and databases

set -e

# Configuration
BACKUP_DIR="./backups"
REMOTE_BACKUP_SERVER=""  # Set your remote backup server if needed
RETENTION_DAYS=30
COMPOSE_FILE="docker-compose.yml"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Create backup directory structure
create_backup_structure() {
    local backup_date=$(date +'%Y%m%d_%H%M%S')
    export BACKUP_PATH="$BACKUP_DIR/backup_$backup_date"
    
    mkdir -p "$BACKUP_PATH"/{databases,files,volumes,logs}
    
    log "Created backup directory: $BACKUP_PATH"
}

# Backup MySQL databases
backup_databases() {
    log "Starting database backup..."
    
    local databases=("electromanos_wp" "freshexpress_wp" "sabeel_wp" "sabeelacademy_wp" "sumo_wp" "yvesmorel_wp" "zonemation_wp")
    local root_password=$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)
    
    for db in "${databases[@]}"; do
        info "Backing up database: $db"
        
        docker-compose exec -T mysql mysqldump \
            -uroot \
            -p"$root_password" \
            --single-transaction \
            --routines \
            --triggers \
            --quick \
            --lock-tables=false \
            "$db" > "$BACKUP_PATH/databases/${db}.sql"
        
        # Compress the SQL file
        gzip "$BACKUP_PATH/databases/${db}.sql"
        
        info "Database backup completed: ${db}.sql.gz"
    done
    
    # Backup all databases in one file
    docker-compose exec -T mysql mysqldump \
        -uroot \
        -p"$root_password" \
        --all-databases \
        --single-transaction \
        --routines \
        --triggers \
        --quick \
        --lock-tables=false > "$BACKUP_PATH/databases/all_databases.sql"
    
    gzip "$BACKUP_PATH/databases/all_databases.sql"
    
    log "Database backup completed successfully."
}

# Backup website files
backup_website_files() {
    log "Starting website files backup..."
    
    local sites=("electromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com")
    
    for site in "${sites[@]}"; do
        if [ -d "$site" ]; then
            info "Backing up website: $site"
            
            tar -czf "$BACKUP_PATH/files/${site}_files.tar.gz" \
                --exclude="$site/public_html/wp-content/cache" \
                --exclude="$site/public_html/wp-content/uploads/cache" \
                --exclude="$site/public_html/.htaccess.bak" \
                "$site"
            
            info "Website backup completed: ${site}_files.tar.gz"
        else
            warning "Directory not found: $site"
        fi
    done
    
    log "Website files backup completed successfully."
}

# Backup Docker volumes
backup_docker_volumes() {
    log "Starting Docker volumes backup..."
    
    local volumes=("mysql_data" "redis_data" "wp_electromanos" "wp_freshexpress" "wp_sabeel" "wp_sabeelacademy" "wp_sumo" "wp_yvesmorel" "wp_zonemation")
    
    for volume in "${volumes[@]}"; do
        local full_volume_name="wp-project_$volume"
        
        if docker volume inspect "$full_volume_name" &>/dev/null; then
            info "Backing up volume: $full_volume_name"
            
            docker run --rm \
                -v "$full_volume_name":/data \
                -v "$PWD/$BACKUP_PATH/volumes":/backup \
                ubuntu:20.04 \
                tar czf "/backup/${volume}.tar.gz" /data
            
            info "Volume backup completed: ${volume}.tar.gz"
        else
            warning "Volume not found: $full_volume_name"
        fi
    done
    
    log "Docker volumes backup completed successfully."
}

# Backup configuration files
backup_configurations() {
    log "Starting configuration backup..."
    
    local config_files=("docker-compose.yml" ".env" "nginx/" "mysql/" "scripts/")
    
    for item in "${config_files[@]}"; do
        if [ -e "$item" ]; then
            info "Backing up configuration: $item"
            
            if [ -d "$item" ]; then
                cp -r "$item" "$BACKUP_PATH/"
            else
                cp "$item" "$BACKUP_PATH/"
            fi
        fi
    done
    
    log "Configuration backup completed successfully."
}

# Backup logs
backup_logs() {
    log "Starting logs backup..."
    
    if [ -d "logs" ]; then
        cp -r logs "$BACKUP_PATH/"
        info "Logs backup completed."
    else
        warning "Logs directory not found."
    fi
}

# Create backup manifest
create_backup_manifest() {
    log "Creating backup manifest..."
    
    cat > "$BACKUP_PATH/backup_manifest.txt" << EOF
WordPress Multi-Site Backup Manifest
====================================

Backup Date: $(date)
Backup Location: $BACKUP_PATH
Server: $(hostname)
User: $(whoami)

Included Components:
- MySQL Databases (compressed)
- Website Files (compressed, excluding cache)
- Docker Volumes
- Configuration Files
- Application Logs

Database Backups:
$(ls -la "$BACKUP_PATH/databases/" 2>/dev/null || echo "No database backups found")

File Backups:
$(ls -la "$BACKUP_PATH/files/" 2>/dev/null || echo "No file backups found")

Volume Backups:
$(ls -la "$BACKUP_PATH/volumes/" 2>/dev/null || echo "No volume backups found")

Backup Size:
$(du -sh "$BACKUP_PATH" | cut -f1)

Checksum:
$(find "$BACKUP_PATH" -type f -exec md5sum {} \; | md5sum)
EOF
    
    info "Backup manifest created: backup_manifest.txt"
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups (older than $RETENTION_DAYS days)..."
    
    find "$BACKUP_DIR" -name "backup_*" -type d -mtime +$RETENTION_DAYS -exec rm -rf {} + 2>/dev/null || true
    
    local remaining_backups=$(find "$BACKUP_DIR" -name "backup_*" -type d | wc -l)
    info "Cleanup completed. Remaining backups: $remaining_backups"
}

# Sync to remote backup server (optional)
sync_to_remote() {
    if [ -n "$REMOTE_BACKUP_SERVER" ]; then
        log "Syncing backup to remote server..."
        
        rsync -avz --progress "$BACKUP_PATH/" "$REMOTE_BACKUP_SERVER"
        
        if [ $? -eq 0 ]; then
            info "Remote sync completed successfully."
        else
            error "Remote sync failed."
        fi
    fi
}

# Verify backup integrity
verify_backup() {
    log "Verifying backup integrity..."
    
    local error_count=0
    
    # Check if backup directory exists and is not empty
    if [ ! -d "$BACKUP_PATH" ] || [ -z "$(ls -A "$BACKUP_PATH")" ]; then
        error "Backup directory is empty or doesn't exist"
        ((error_count++))
    fi
    
    # Check database backups
    if [ -d "$BACKUP_PATH/databases" ]; then
        local db_count=$(ls "$BACKUP_PATH/databases"/*.sql.gz 2>/dev/null | wc -l)
        if [ "$db_count" -eq 0 ]; then
            error "No database backups found"
            ((error_count++))
        else
            info "Found $db_count database backups"
        fi
    fi
    
    # Check file backups
    if [ -d "$BACKUP_PATH/files" ]; then
        local file_count=$(ls "$BACKUP_PATH/files"/*.tar.gz 2>/dev/null | wc -l)
        if [ "$file_count" -eq 0 ]; then
            error "No file backups found"
            ((error_count++))
        else
            info "Found $file_count file backups"
        fi
    fi
    
    if [ "$error_count" -eq 0 ]; then
        log "Backup verification completed successfully."
        return 0
    else
        error "Backup verification failed with $error_count errors."
        return 1
    fi
}

# Send backup notification
send_notification() {
    local status=$1
    local backup_size=$(du -sh "$BACKUP_PATH" 2>/dev/null | cut -f1 || echo "Unknown")
    
    # You can customize this to send email, Slack, or other notifications
    if [ "$status" = "success" ]; then
        log "Backup completed successfully. Size: $backup_size"
    else
        error "Backup failed!"
    fi
    
    # Example: Send email (uncomment and configure if needed)
    # echo "Backup $status at $(date). Size: $backup_size" | mail -s "WordPress Backup $status" admin@yourdomain.com
}

# Restore function
restore_backup() {
    local restore_path=$1
    
    if [ -z "$restore_path" ] || [ ! -d "$restore_path" ]; then
        error "Invalid restore path: $restore_path"
        exit 1
    fi
    
    warning "This will restore from backup: $restore_path"
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        info "Restore cancelled."
        exit 0
    fi
    
    log "Starting restore from: $restore_path"
    
    # Stop services
    docker-compose down
    
    # Restore databases
    if [ -d "$restore_path/databases" ]; then
        log "Restoring databases..."
        
        # Start only MySQL
        docker-compose up -d mysql
        sleep 30
        
        for db_file in "$restore_path/databases"/*.sql.gz; do
            if [ -f "$db_file" ]; then
                local db_name=$(basename "$db_file" .sql.gz)
                info "Restoring database: $db_name"
                
                zcat "$db_file" | docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)"
            fi
        done
    fi
    
    # Restore files
    if [ -d "$restore_path/files" ]; then
        log "Restoring website files..."
        
        for file_backup in "$restore_path/files"/*.tar.gz; do
            if [ -f "$file_backup" ]; then
                info "Restoring: $(basename "$file_backup")"
                tar -xzf "$file_backup"
            fi
        done
    fi
    
    # Start all services
    docker-compose up -d
    
    log "Restore completed successfully."
}

# Main function
main() {
    case "${1:-backup}" in
        backup)
            log "Starting WordPress Multi-Site backup process..."
            
            create_backup_structure
            backup_databases
            backup_website_files
            backup_docker_volumes
            backup_configurations
            backup_logs
            create_backup_manifest
            
            if verify_backup; then
                cleanup_old_backups
                sync_to_remote
                send_notification "success"
                log "Backup process completed successfully!"
                info "Backup location: $BACKUP_PATH"
            else
                send_notification "failed"
                error "Backup process failed!"
                exit 1
            fi
            ;;
        restore)
            restore_backup "$2"
            ;;
        list)
            log "Available backups:"
            ls -la "$BACKUP_DIR"/backup_* 2>/dev/null || info "No backups found"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        *)
            echo "Usage: $0 {backup|restore|list|cleanup}"
            echo ""
            echo "Commands:"
            echo "  backup           - Create full backup of all sites and databases"
            echo "  restore <path>   - Restore from specified backup path"
            echo "  list             - List available backups"
            echo "  cleanup          - Remove old backups (older than $RETENTION_DAYS days)"
            exit 1
            ;;
    esac
}

# Check if Docker Compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    error "Docker Compose file not found: $COMPOSE_FILE"
    exit 1
fi

# Run main function
main "$@"