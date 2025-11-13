#!/bin/bash

# Hostinger VPS Server Setup Script for Docker WordPress Deployment
# Run this script on your Ubuntu VPS to prepare it for Docker deployment

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        error "Please run this script as root (use sudo)"
        exit 1
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    apt-get update
    apt-get upgrade -y
    apt-get autoremove -y
    
    log "System updated successfully."
}

# Install required packages
install_packages() {
    log "Installing required packages..."
    
    apt-get install -y \
        curl \
        wget \
        git \
        unzip \
        htop \
        nano \
        ufw \
        fail2ban \
        logrotate \
        cron \
        certbot \
        python3-certbot-nginx
    
    log "Required packages installed successfully."
}

# Install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old versions
    apt-get remove -y docker docker-engine docker.io containerd runc || true
    
    # Install dependencies
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Install Docker Compose (standalone)
    curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    if [ -n "$SUDO_USER" ]; then
        usermod -aG docker $SUDO_USER
    fi
    
    log "Docker installed successfully."
}

# Configure firewall
configure_firewall() {
    log "Configuring UFW firewall..."
    
    # Reset firewall
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (adjust port if needed)
    ufw allow ssh
    ufw allow 22
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow MySQL for remote connections (optional)
    # ufw allow 3306/tcp
    
    # Allow phpMyAdmin
    ufw allow 8080/tcp
    
    # Enable firewall
    ufw --force enable
    
    log "Firewall configured successfully."
}

# Configure fail2ban
configure_fail2ban() {
    log "Configuring fail2ban..."
    
    # Create custom jail configuration
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
# Ban hosts for 24 hours
bantime = 86400

# Override /etc/fail2ban/jail.d/00-firewalld.conf
banaction = ufw

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 3
EOF
    
    # Restart and enable fail2ban
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    log "Fail2ban configured successfully."
}

# Create project directory and user
setup_project() {
    log "Setting up project directory..."
    
    # Create dedicated user for WordPress deployment
    if ! id "wpuser" &>/dev/null; then
        useradd -m -s /bin/bash wpuser
        usermod -aG docker wpuser
        info "Created wpuser with Docker access"
    fi
    
    # Create project directory
    mkdir -p /opt/wordpress-docker
    chown -R wpuser:wpuser /opt/wordpress-docker
    chmod 755 /opt/wordpress-docker
    
    log "Project directory setup completed."
}

# Configure system limits
configure_limits() {
    log "Configuring system limits..."
    
    # Increase file descriptor limits
    cat >> /etc/security/limits.conf << 'EOF'
# WordPress Docker limits
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
EOF
    
    # Configure sysctl for Docker
    cat > /etc/sysctl.d/99-docker.conf << 'EOF'
# Docker optimizations
vm.max_map_count=262144
vm.swappiness=10
net.core.somaxconn=4096
net.ipv4.tcp_keepalive_time=600
net.ipv4.tcp_keepalive_intvl=60
net.ipv4.tcp_keepalive_probes=10
EOF
    
    sysctl -p /etc/sysctl.d/99-docker.conf
    
    log "System limits configured successfully."
}

# Setup log rotation
configure_logrotate() {
    log "Configuring log rotation..."
    
    cat > /etc/logrotate.d/docker << 'EOF'
/opt/wordpress-docker/logs/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 wpuser wpuser
    postrotate
        docker-compose -f /opt/wordpress-docker/docker-compose.yml exec nginx nginx -s reload
    endscript
}

/var/lib/docker/containers/*/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF
    
    log "Log rotation configured successfully."
}

# Setup automated backups
setup_backups() {
    log "Setting up automated backups..."
    
    # Create backup script
    cat > /opt/wordpress-docker/backup.sh << 'EOF'
#!/bin/bash
cd /opt/wordpress-docker
./scripts/deploy.sh backup
# Optionally sync to remote storage
# rsync -av backups/ user@backup-server:/backups/wordpress/
EOF
    
    chmod +x /opt/wordpress-docker/backup.sh
    
    # Add to crontab for wpuser
    (crontab -u wpuser -l 2>/dev/null; echo "0 2 * * * /opt/wordpress-docker/backup.sh") | crontab -u wpuser -
    
    log "Automated backups configured successfully."
}

# Install monitoring tools
install_monitoring() {
    log "Installing monitoring tools..."
    
    # Install ctop for Docker monitoring
    wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop
    chmod +x /usr/local/bin/ctop
    
    log "Monitoring tools installed successfully."
}

# Display final instructions
show_instructions() {
    log "Server setup completed successfully!"
    echo ""
    info "Next steps:"
    echo "1. Upload your WordPress files to /opt/wordpress-docker/"
    echo "2. Edit the .env file with your database passwords"
    echo "3. Run: cd /opt/wordpress-docker && ./scripts/deploy.sh start"
    echo "4. Configure SSL: ./scripts/deploy.sh ssl"
    echo ""
    info "Useful commands:"
    echo "- Check services: ./scripts/deploy.sh health"
    echo "- View logs: ./scripts/deploy.sh logs"
    echo "- Create backup: ./scripts/deploy.sh backup"
    echo "- Monitor containers: ctop"
    echo ""
    warning "Remember to:"
    echo "- Change default passwords in .env file"
    echo "- Configure your domain DNS to point to this server"
    echo "- Test all websites after deployment"
    echo ""
    info "Server ready for WordPress Docker deployment!"
}

# Main function
main() {
    log "Starting Hostinger VPS setup for WordPress Docker deployment..."
    
    check_root
    update_system
    install_packages
    install_docker
    configure_firewall
    configure_fail2ban
    setup_project
    configure_limits
    configure_logrotate
    setup_backups
    install_monitoring
    show_instructions
}

# Run main function
main "$@"