#!/bin/bash

# Database Import Script for WordPress Multi-Site Docker Deployment
# This script imports the existing database backup into the appropriate containers

set -e

# Colors for output
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

# Configuration
DB_BACKUP_FILE="u182232330_bJBMb.20251107112249.sql"
COMPOSE_FILE="docker-compose.yml"

# Check if database backup file exists
check_backup_file() {
    if [ ! -f "$DB_BACKUP_FILE" ]; then
        error "Database backup file not found: $DB_BACKUP_FILE"
        exit 1
    fi
    
    log "Database backup file found: $DB_BACKUP_FILE"
}

# Wait for MySQL to be ready
wait_for_mysql() {
    log "Waiting for MySQL to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" -e "SELECT 1" &>/dev/null; then
            log "MySQL is ready!"
            return 0
        fi
        
        info "Attempt $attempt/$max_attempts - MySQL not ready yet, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    error "MySQL failed to become ready after $((max_attempts * 10)) seconds"
    exit 1
}

# Analyze the database backup to understand its structure
analyze_backup() {
    log "Analyzing database backup structure..."
    
    # Check if it's a single database or multiple databases
    local db_count=$(grep -c "CREATE DATABASE" "$DB_BACKUP_FILE" || echo "0")
    local use_db=$(grep "USE " "$DB_BACKUP_FILE" | head -1 || echo "")
    local tables=$(grep -c "CREATE TABLE" "$DB_BACKUP_FILE" || echo "0")
    
    info "Database analysis results:"
    info "- Databases found: $db_count"
    info "- Tables found: $tables"
    
    if [ "$db_count" -eq 0 ]; then
        info "- Single database structure detected"
        info "- This appears to be a single WordPress site backup"
        
        # Check which site this might be based on content
        if grep -q "electroromanos" "$DB_BACKUP_FILE"; then
            info "- Detected: ElectroRomanos site data"
            echo "electroromanos"
        elif grep -q "sabeel" "$DB_BACKUP_FILE"; then
            info "- Detected: Sabeel site data"
            echo "sabeel"
        elif grep -q "zonemation" "$DB_BACKUP_FILE"; then
            info "- Detected: Zonemation site data"
            echo "zonemation"
        else
            warning "- Could not determine which site this backup belongs to"
            echo "unknown"
        fi
    else
        info "- Multi-database structure detected"
        echo "multi"
    fi
}

# Import database for a specific site
import_single_site() {
    local site_name=$1
    local db_name=""
    local db_user=""
    local db_password=""
    
    case $site_name in
        "electroromanos")
            db_name="electroromanos_wp"
            db_user="electroromanos_user"
            db_password=$(grep ELECTROROMANOS_DB_PASSWORD .env | cut -d'=' -f2)
            ;;
        "sabeel")
            db_name="sabeel_wp"
            db_user="sabeel_user"
            db_password=$(grep SABEEL_DB_PASSWORD .env | cut -d'=' -f2)
            ;;
        "zonemation")
            db_name="zonemation_wp"
            db_user="zonemation_user"
            db_password=$(grep ZONEMATION_DB_PASSWORD .env | cut -d'=' -f2)
            ;;
        *)
            error "Unknown site: $site_name"
            exit 1
            ;;
    esac
    
    log "Importing database for $site_name..."
    info "Target database: $db_name"
    
    # Import the database
    docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" "$db_name" < "$DB_BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        log "Database imported successfully for $site_name"
        
        # Update WordPress URLs in the database
        update_wordpress_urls "$site_name" "$db_name"
        
    else
        error "Failed to import database for $site_name"
        exit 1
    fi
}

# Update WordPress URLs in the imported database
update_wordpress_urls() {
    local site_name=$1
    local db_name=$2
    local new_url=""
    
    case $site_name in
        "electroromanos")
            new_url="https://electroromanos.ma"
            ;;
        "sabeel")
            new_url="https://sabeel.agency"
            ;;
        "zonemation")
            new_url="https://zonemation.com"
            ;;
    esac
    
    log "Updating WordPress URLs for $site_name to $new_url..."
    
    # Update site URL and home URL
    docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" "$db_name" << EOF
UPDATE wp_options SET option_value = '$new_url' WHERE option_name = 'home';
UPDATE wp_options SET option_value = '$new_url' WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = '$new_url/wp-content/uploads' WHERE option_name = 'upload_url_path';
EOF
    
    info "WordPress URLs updated successfully for $site_name"
}

# Import multiple databases
import_multiple_sites() {
    log "Importing multi-site database backup..."
    
    # This would handle cases where the backup contains multiple databases
    # For now, import into MySQL and let the user handle site-specific extraction
    
    docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" < "$DB_BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        log "Multi-site database imported successfully"
        warning "Please verify and move data to appropriate databases manually"
    else
        error "Failed to import multi-site database"
        exit 1
    fi
}

# Create backup before import
create_backup_before_import() {
    log "Creating backup before import..."
    
    local backup_date=$(date +'%Y%m%d_%H%M%S')
    local backup_dir="./backups/pre_import_$backup_date"
    
    mkdir -p "$backup_dir"
    
    # Backup all existing databases
    local databases=("electroromanos_wp" "freshexpress_wp" "sabeel_wp" "sabeelacademy_wp" "sumo_wp" "yvesmorel_wp" "zonemation_wp")
    
    for db in "${databases[@]}"; do
        info "Backing up existing database: $db"
        docker-compose exec -T mysql mysqldump -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" "$db" > "$backup_dir/${db}.sql" 2>/dev/null || true
    done
    
    log "Pre-import backup created: $backup_dir"
}

# Verify import was successful
verify_import() {
    local site_name=$1
    local db_name=""
    
    case $site_name in
        "electroromanos")
            db_name="electroromanos_wp"
            ;;
        "sabeel")
            db_name="sabeel_wp"
            ;;
        "zonemation")
            db_name="zonemation_wp"
            ;;
    esac
    
    log "Verifying import for $site_name..."
    
    # Check if tables exist and have data
    local table_count=$(docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" -e "USE $db_name; SHOW TABLES;" | wc -l)
    local post_count=$(docker-compose exec -T mysql mysql -uroot -p"$(grep MYSQL_ROOT_PASSWORD .env | cut -d'=' -f2)" -e "USE $db_name; SELECT COUNT(*) FROM wp_posts;" | tail -1)
    
    info "Verification results for $site_name:"
    info "- Tables found: $((table_count - 1))"
    info "- Posts count: $post_count"
    
    if [ $((table_count - 1)) -gt 10 ] && [ "$post_count" -gt 0 ]; then
        log "Import verification successful for $site_name"
        return 0
    else
        error "Import verification failed for $site_name"
        return 1
    fi
}

# Main function
main() {
    log "Starting database import process..."
    
    # Check prerequisites
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Docker Compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        error "Environment file not found: .env"
        exit 1
    fi
    
    check_backup_file
    
    # Make sure MySQL is running
    if ! docker-compose ps mysql | grep -q "Up"; then
        log "Starting MySQL container..."
        docker-compose up -d mysql
    fi
    
    wait_for_mysql
    
    # Analyze the backup to determine import strategy
    local site_type=$(analyze_backup)
    
    # Create backup before import
    create_backup_before_import
    
    case $site_type in
        "electroromanos"|"sabeel"|"zonemation")
            import_single_site "$site_type"
            verify_import "$site_type"
            ;;
        "multi")
            import_multiple_sites
            ;;
        "unknown")
            warning "Cannot determine site type. Attempting general import..."
            read -p "Which site database should this be imported to? (electroromanos/sabeel/zonemation): " target_site
            import_single_site "$target_site"
            verify_import "$target_site"
            ;;
        *)
            error "Unable to determine import strategy"
            exit 1
            ;;
    esac
    
    log "Database import process completed!"
    info "Don't forget to:"
    info "1. Update WordPress configurations if needed"
    info "2. Clear any caches"
    info "3. Test the website functionality"
    info "4. Update file permissions if necessary"
}

# Check command line arguments
case "${1:-import}" in
    "import")
        main
        ;;
    "analyze")
        check_backup_file
        analyze_backup
        ;;
    "verify")
        if [ -z "$2" ]; then
            error "Please specify site name: electroromanos, sabeel, or zonemation"
            exit 1
        fi
        verify_import "$2"
        ;;
    *)
        echo "Usage: $0 {import|analyze|verify}"
        echo ""
        echo "Commands:"
        echo "  import           - Import the database backup"
        echo "  analyze          - Analyze the backup file structure"
        echo "  verify <site>    - Verify import for specific site"
        exit 1
        ;;
esac