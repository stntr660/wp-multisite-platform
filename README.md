# WordPress Multi-Site Docker Deployment with CI/CD

A comprehensive Docker-based solution for managing multiple WordPress websites with automated CI/CD pipelines, featuring automated deployments, backups, monitoring, and easy website addition through GitHub Actions.

[![Deploy](https://github.com/your-username/wordpress-multisite/workflows/Deploy%20WordPress%20Multi-Site/badge.svg)](https://github.com/your-username/wordpress-multisite/actions)
[![Backup & Monitor](https://github.com/your-username/wordpress-multisite/workflows/Backup%20&%20Monitor/badge.svg)](https://github.com/your-username/wordpress-multisite/actions)

## 🌟 Features

### 🚀 Automated CI/CD Pipeline
- **GitHub Actions** integration for automated deployments
- **Multi-environment** support (development, staging, production)
- **Automated testing** and security scanning
- **Zero-downtime deployments** with rollback capabilities

### 🏗️ Infrastructure
- **Docker Compose** orchestration for easy management
- **Nginx reverse proxy** with SSL termination
- **MySQL 8.0** database with optimized configuration
- **Redis caching** for performance optimization
- **Let's Encrypt** automated SSL certificates

### 📊 Monitoring & Backup
- **Automated daily backups** with configurable retention
- **Health monitoring** with Slack notifications  
- **Performance monitoring** and alerting
- **SSL certificate expiration** tracking
- **Security scanning** with vulnerability detection

### 🆕 Easy Website Addition
- **One-click website addition** through GitHub Actions
- **Automated configuration** generation
- **Pull request workflow** with validation
- **Documentation** auto-generation

## 🏢 Current Websites

| Website | Domain | Type | Status |
|---------|--------|------|--------|
| AirArom | airarom.ma | WordPress | ✅ Active |
| ElectroRomanos | electroromanos.ma | WordPress | ✅ Active |
| FreshExpress | freshexpress.ma | WordPress | ✅ Active |
| Sabeel Agency | sabeel.agency | WordPress | ✅ Active |
| Sabeel Academy | sabeelacademy.ma | WordPress | ✅ Active |
| Sumo | sumo.ma | WordPress | ✅ Active |
| Yves Morel | yvesmorel.ma | WordPress | ✅ Active |
| Zonemation | zonemation.com | WordPress | ✅ Active |
| Oumnia Rental Cars | oumniarentalcars.com | Static | ✅ Active |

## 📁 Project Structure

```
📦 WP/
├── 📄 docker-compose.yml          # Main Docker Compose configuration
├── 📄 .env                        # Environment variables (EDIT THIS!)
├── 📂 dockerfiles/
│   └── 📄 Dockerfile.wordpress    # WordPress container configuration
├── 📂 nginx/
│   ├── 📄 nginx.conf             # Main Nginx configuration
│   ├── 📄 static.conf            # Static site configuration
│   └── 📂 conf.d/
│       └── 📄 default.conf       # Site-specific configurations
├── 📂 mysql/
│   └── 📂 init/
│       └── 📄 01-create-databases.sql
├── 📂 scripts/
│   ├── 📄 deploy.sh              # Main deployment script
│   ├── 📄 server-setup.sh        # Server preparation script
│   └── 📄 backup.sh              # Backup and restore script
├── 📂 backups/                   # Backup storage
├── 📂 logs/                      # Application logs
└── 📂 ssl/                       # SSL certificates
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- GitHub account with repository access
- VPS or dedicated server with root access
- Domain names with DNS access

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/wordpress-multisite.git
cd wordpress-multisite

# Copy and configure environment file
cp .env.example .env
# Edit .env with your database passwords and configuration

# Set up GitHub repository (replace with your details)
chmod +x .github/scripts/setup-repository.sh
./.github/scripts/setup-repository.sh your-username wordpress-multisite
```

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets → Actions):

```bash
# Production Environment
PRODUCTION_HOST=your-server-ip
PRODUCTION_USER=your-ssh-username
PRODUCTION_PRIVATE_KEY=your-ssh-private-key
PRODUCTION_PATH=/var/www/wordpress-multisite
PRODUCTION_ENV=your-complete-env-file-content

# Notifications
SLACK_WEBHOOK=your-slack-webhook-url
```

### 3. Deploy

```bash
# Push to trigger deployment
git add .
git commit -m "Initial setup"
git push origin main

# Monitor deployment in GitHub Actions
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [CI/CD Setup Guide](docs/CI-CD-SETUP.md) | Complete setup and configuration guide |
| [Adding New Websites](docs/ADDING-NEW-WEBSITES.md) | Step-by-step guide for adding websites |
| [Environment Configuration](#environment-configuration) | Environment variables and configuration |
| [Troubleshooting](#troubleshooting) | Common issues and solutions |

## ⚙️ Environment Configuration

### Production Environment (.env)

```bash
# Database Configuration
MYSQL_ROOT_PASSWORD=your_secure_root_password

# Website Configurations (example)
AIRAROM_DB_NAME=airarom_wp
AIRAROM_DB_USER=airarom_user
AIRAROM_DB_PASSWORD=secure_password

# Environment Settings
ENVIRONMENT=production
WP_DEBUG=false
WP_FORCE_SSL_ADMIN=true

# Performance Settings
PHP_MEMORY_LIMIT=512M
PHP_MAX_EXECUTION_TIME=300
```

### Staging Environment (.env.staging)

```bash
# Staging-specific configuration
ENVIRONMENT=staging
WP_DEBUG=true
SSL_STAGING=true

# Staging databases with different names
AIRAROM_DB_NAME=staging_airarom_wp
# ... other staging configurations
```

## 🔧 Available Scripts

### Enhanced Deployment Script

```bash
# Deploy to production
./scripts/deploy-enhanced.sh deploy production

# Deploy to staging
./scripts/deploy-enhanced.sh deploy staging

# Create manual backup
./scripts/deploy-enhanced.sh backup production

# Check system status
./scripts/deploy-enhanced.sh status production

# Rollback deployment
./scripts/deploy-enhanced.sh rollback production

# Manage SSL certificates
./scripts/deploy-enhanced.sh ssl install
```

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Check service status
docker-compose ps
```

## 🔧 Configuration Details

### Database Configuration
Each WordPress site has its own database:
- **electromanos_wp** → electromanos.ma
- **freshexpress_wp** → freshexpress.ma
- **sabeel_wp** → sabeel.agency
- **sabeelacademy_wp** → sabeelacademy.ma
- **sumo_wp** → sumo.ma
- **yvesmorel_wp** → yvesmorel.ma
- **zonemation_wp** → zonemation.com

### WordPress Configuration
Each site includes:
- ✅ PHP 8.2 with optimized extensions
- ✅ Redis object caching
- ✅ ImageMagick support
- ✅ WP-CLI integration
- ✅ Security headers
- ✅ Performance optimization

### Security Features
- 🔒 UFW firewall configured
- 🔒 Fail2ban protection
- 🔒 SSL/TLS certificates
- 🔒 Security headers
- 🔒 Rate limiting
- 🔒 Isolated containers

## 🆕 Adding New Websites

### Automated Method (Recommended)

1. **Go to GitHub Actions** → "Add New Website" workflow
2. **Fill in details**:
   - Website name: `newsite`
   - Domain: `newsite.com`
   - Type: `wordpress` or `static`
3. **Review the generated pull request**
4. **Add environment variables** to your `.env` file
5. **Configure DNS** to point to your server
6. **Merge and deploy**
7. **Generate SSL certificate**

[📖 Detailed Guide](docs/ADDING-NEW-WEBSITES.md)

### Manual Method

```bash
# Create feature branch
git checkout -b matt/add-website-newsite

# Create website structure
mkdir -p newsite.com/public_html

# Update Docker Compose configuration
# Update Nginx configuration
# Update deployment scripts

# Commit and create PR
git add .
git commit -m "Add new website: newsite.com"
git push origin matt/add-website-newsite
gh pr create --title "Add new website: newsite.com"
```

## 📊 Monitoring & Alerts

### Automated Health Checks

- **Website availability** monitoring (every hour during business hours)
- **Database connectivity** checks
- **SSL certificate expiration** alerts (30-day warning)
- **System resource** monitoring (CPU, memory, disk)
- **Container health** status checks

### Backup Schedule

| Backup Type | Frequency | Retention | Includes |
|-------------|-----------|-----------|----------|
| Daily | 2 AM UTC | 7 days | Databases, critical files |
| Weekly | Sunday 1 AM | 30 days | Full system backup |
| Emergency | Before deployments | 90 days | Complete snapshot |

### Notifications

- **Slack integration** for deployment status
- **Email alerts** for critical issues
- **GitHub notifications** for workflow results

## 🔒 Security Features

### Automated Security Scanning

- **Vulnerability scanning** with Trivy
- **Sensitive file detection**
- **Docker security** best practices
- **SSL certificate** management
- **Failed login attempt** monitoring

### Security Best Practices

- **Environment-specific credentials**
- **Encrypted secrets** storage
- **Regular security updates**
- **File permission** management
- **Network isolation** with Docker networks

## 🌐 Domain Configuration

### Nginx Virtual Hosts
Each domain is configured in `/nginx/conf.d/default.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://container_name:80;
        # ... proxy headers
    }
}
```

### SSL Certificate Installation
```bash
# Automatic certificate generation
./scripts/deploy.sh ssl

# Manual certificate installation
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

## 🔧 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check logs
./scripts/deploy.sh logs

# Restart services
./scripts/deploy.sh restart
```

**Database connection errors:**
```bash
# Check MySQL status
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

**Website not accessible:**
```bash
# Check Nginx status
docker-compose logs nginx

# Verify domain DNS
nslookup yourdomain.com

# Check firewall
sudo ufw status
```

**SSL certificate issues:**
```bash
# Renew certificates
certbot renew

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout
```

### Performance Optimization

**Optimize MySQL:**
```bash
# Edit MySQL configuration
# Add to docker-compose.yml under mysql service
command: --innodb-buffer-pool-size=512M --max-connections=200
```

**Enable Redis caching:**
```bash
# Redis is already configured - verify in WordPress admin
# Install Redis Object Cache plugin if not present
```

**Monitor disk space:**
```bash
df -h
docker system prune -f  # Clean unused Docker data
```

## 📈 Scaling & Performance

### Horizontal Scaling
To add more sites:
1. Add new service in `docker-compose.yml`
2. Add database configuration in `.env`
3. Add Nginx virtual host configuration
4. Update backup script

### Vertical Scaling
Increase resources in `docker-compose.yml`:
```yaml
services:
  mysql:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

## 🔐 Security Checklist

- [ ] Change all default passwords in `.env`
- [ ] Configure UFW firewall
- [ ] Install SSL certificates
- [ ] Enable fail2ban
- [ ] Update all WordPress sites and plugins
- [ ] Configure automated backups
- [ ] Monitor logs regularly
- [ ] Keep Docker images updated

## 📞 Support

### Log Locations
- **Nginx**: `/opt/wordpress-docker/logs/nginx/`
- **Docker**: `/var/lib/docker/containers/`
- **System**: `/var/log/`

### Useful Commands
```bash
# Container shell access
docker-compose exec wordpress_container_name bash

# Database shell access
docker-compose exec mysql mysql -uroot -p

# View container logs
docker logs container_name

# System resource monitoring
htop
iotop
netstat -tulpn
```

### Emergency Recovery
```bash
# Stop all services
./scripts/deploy.sh stop

# Restore from latest backup
./scripts/backup.sh restore /path/to/latest/backup

# Start services
./scripts/deploy.sh start
```

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**⚠️ Important Notes:**
- Always backup before making changes
- Test deployments in staging environment first
- Monitor resource usage regularly
- Keep security updates current
- Document any custom modifications

**🎯 Next Steps:**
1. Configure domain DNS settings
2. Install and configure SSL certificates
3. Set up monitoring and alerts
4. Optimize performance settings
5. Configure regular security updates