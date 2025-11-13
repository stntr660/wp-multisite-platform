# WordPress Multi-Site Platform Setup Guide

Complete step-by-step setup guide for the WordPress Multi-Site Docker Platform.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Server**: VPS or dedicated server with root access
- **OS**: Ubuntu 20.04+ or CentOS 8+ (recommended)
- **Resources**: Minimum 2GB RAM, 20GB storage, 2 CPU cores
- **Domains**: Domain names with DNS access
- **Git**: Git installed locally and on server
- **GitHub**: GitHub account for CI/CD

### Step 1: Server Preparation

#### 1.1 Update System

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

#### 1.2 Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### 1.3 Configure Firewall

```bash
# Ubuntu/Debian - UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL - firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Step 2: Project Setup

#### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/wp-multisite-platform.git
cd wp-multisite-platform

# Set up directory structure
sudo mkdir -p /var/www/wp-multisite
sudo chown $USER:$USER /var/www/wp-multisite
cp -r * /var/www/wp-multisite/
cd /var/www/wp-multisite
```

#### 2.2 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Important Environment Variables to Configure:**

```bash
# Generate secure passwords
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
MYSQL_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

# Set your email for SSL certificates
SSL_EMAIL=admin@yourdomain.com

# Configure each website database
WEBSITE_DB_NAME=website_wp
WEBSITE_DB_USER=website_user
WEBSITE_DB_PASSWORD=$(openssl rand -base64 32)
```

#### 2.3 Generate WordPress Security Keys

```bash
# Generate WordPress auth keys
curl -s https://api.wordpress.org/secret-key/1.1/salt/

# Add the generated keys to your .env file
```

### Step 3: GitHub CI/CD Setup

#### 3.1 Create GitHub Repository

```bash
# Initialize Git repository (if not already done)
git init
git add .
git commit -m "Initial commit: WordPress Multi-Site Platform"
git remote add origin https://github.com/yourusername/wp-multisite-platform.git
git push -u origin main
```

#### 3.2 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```bash
# Production Server Access
PRODUCTION_HOST=your-server-ip-address
PRODUCTION_USER=your-ssh-username
PRODUCTION_PRIVATE_KEY=your-ssh-private-key-content
PRODUCTION_PATH=/var/www/wp-multisite

# Complete .env file content
PRODUCTION_ENV=complete-content-of-your-env-file

# Staging Server (Optional)
STAGING_HOST=staging-server-ip
STAGING_USER=staging-ssh-username
STAGING_PRIVATE_KEY=staging-ssh-private-key
STAGING_PATH=/var/www/wp-multisite-staging
STAGING_ENV=staging-env-file-content

# Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/your/slack/webhook
EMAIL_USERNAME=notifications@yourdomain.com
EMAIL_PASSWORD=your-email-password
NOTIFICATION_EMAIL=admin@yourdomain.com
```

#### 3.3 Generate SSH Key for GitHub Actions

```bash
# On your server, generate SSH key
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"

# Add public key to authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# Copy private key content for GitHub secrets
cat ~/.ssh/id_rsa
```

### Step 4: DNS Configuration

Configure your domain DNS settings to point to your server:

#### 4.1 A Records

For each domain, create A records:

```
@ → your-server-ip-address
www → your-server-ip-address
```

#### 4.2 Verify DNS Propagation

```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com A
```

### Step 5: Initial Deployment

#### 5.1 Manual Deployment (First Time)

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Start services
./scripts/deploy.sh start

# Check service health
./scripts/health-check.sh --detailed
```

#### 5.2 Verify Deployment

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs

# Test website access
curl -I http://yourdomain.com
```

### Step 6: SSL Certificate Setup

#### 6.1 Install Certbot

```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### 6.2 Generate SSL Certificates

```bash
# Use the automated SSL script
./scripts/deploy.sh ssl

# Or manually for each domain
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

#### 6.3 Configure SSL Auto-Renewal

```bash
# Add to crontab
crontab -e

# Add this line for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 7: Database Import (If Migrating)

#### 7.1 Upload Database Backups

```bash
# Copy database files to DB directory
cp /path/to/your/backups/*.sql DB/

# Run import script
./scripts/import-database.sh import
```

#### 7.2 Verify Database Import

```bash
# Check database connectivity
./scripts/health-check.sh

# Connect to MySQL
docker exec -it mysql-server mysql -uroot -p

# List databases
SHOW DATABASES;
```

### Step 8: Configure Automated Backups

#### 8.1 Set Up Backup Schedule

```bash
# Edit crontab
crontab -e

# Add backup schedules
# Daily backup at 2 AM
0 2 * * * /var/www/wp-multisite/scripts/backup-database.sh auto

# Weekly full backup on Sundays at 1 AM
0 1 * * 0 /var/www/wp-multisite/scripts/backup-database.sh manual
```

#### 8.2 Test Backup System

```bash
# Create manual backup
./scripts/backup-database.sh manual

# Verify backup files
ls -la backups/
```

### Step 9: Monitoring Setup

#### 9.1 Configure Health Checks

```bash
# Add health check to crontab
crontab -e

# Health check every 5 minutes
*/5 * * * * /var/www/wp-multisite/scripts/health-check.sh --quiet
```

#### 9.2 Set Up Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/wp-multisite

# Add configuration
/var/www/wp-multisite/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### Step 10: Security Hardening

#### 10.1 Install Fail2ban

```bash
# Ubuntu/Debian
sudo apt install fail2ban

# CentOS/RHEL
sudo yum install fail2ban

# Configure fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### 10.2 Secure SSH Access

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended changes:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 2222 (change default port)

# Restart SSH service
sudo systemctl restart sshd
```

#### 10.3 Regular Security Updates

```bash
# Set up automatic security updates (Ubuntu)
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 🔧 Advanced Configuration

### Custom Domain Addition

To add a new website using GitHub Actions:

1. Go to GitHub Actions → "🆕 Add New Website"
2. Fill in website details
3. Review and merge the generated pull request
4. Configure DNS for the new domain
5. Update .env file with database credentials

### Performance Optimization

#### Database Optimization

```bash
# Edit MySQL configuration
nano mysql/conf.d/custom.cnf

# Add optimizations:
[mysqld]
innodb_buffer_pool_size=1G
max_connections=200
innodb_log_file_size=256M
```

#### Redis Configuration

```bash
# Configure Redis memory limit
docker-compose exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Scaling Considerations

#### Vertical Scaling

```yaml
# Edit docker-compose.yml
services:
  mysql:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

#### Horizontal Scaling

For high-traffic scenarios, consider:

- Load balancer (nginx upstream)
- Database clustering
- CDN integration
- Container orchestration (Docker Swarm/Kubernetes)

## 🚨 Troubleshooting

### Common Issues

#### Services Won't Start

```bash
# Check Docker logs
docker-compose logs

# Check system resources
df -h
free -h

# Restart Docker daemon
sudo systemctl restart docker
```

#### Database Connection Errors

```bash
# Check MySQL status
docker exec mysql-server mysqladmin ping

# Verify environment variables
grep DB_ .env

# Reset MySQL root password
docker exec mysql-server mysql -e "ALTER USER 'root'@'%' IDENTIFIED BY 'newpassword';"
```

#### SSL Certificate Issues

```bash
# Check certificate status
openssl x509 -in /etc/letsencrypt/live/domain.com/fullchain.pem -text -noout

# Renew certificate
certbot renew --dry-run

# Check Nginx configuration
docker exec nginx-proxy nginx -t
```

#### Website Not Loading

```bash
# Check Nginx logs
docker logs nginx-proxy

# Verify DNS resolution
nslookup yourdomain.com

# Check port accessibility
telnet your-server-ip 80
telnet your-server-ip 443
```

### Emergency Recovery

#### Rollback Deployment

```bash
# Automatic rollback to latest emergency backup
./scripts/rollback.sh auto

# Manual rollback to specific backup
./scripts/rollback.sh manual 20241113_143022
```

#### Database Recovery

```bash
# Stop services
./scripts/deploy.sh stop

# Restore specific database
gunzip -c backups/database_name/backup_file.sql.gz | docker exec -i mysql-server mysql -uroot -p

# Start services
./scripts/deploy.sh start
```

## 📚 Additional Resources

- [Docker Compose Reference](https://docs.docker.com/compose/)
- [WordPress Configuration](https://wordpress.org/support/article/editing-wp-config-php/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [MySQL Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#🚨-troubleshooting)
2. Review logs in the `logs/` directory
3. Verify environment configuration
4. Test individual components
5. Create GitHub issue with detailed information

---

**⚠️ Security Reminder**: Always use strong passwords, keep systems updated, and follow security best practices!