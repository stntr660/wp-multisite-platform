# WordPress Multi-Site CI/CD Setup Guide

## Overview

This document provides a comprehensive guide for setting up and managing the WordPress Multi-Site CI/CD pipeline using GitHub Actions, Docker, and automated deployment workflows.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [GitHub Repository Setup](#github-repository-setup)
- [Deployment Workflows](#deployment-workflows)
- [Adding New Websites](#adding-new-websites)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

### Components

1. **GitHub Repository**: Version control and CI/CD automation
2. **GitHub Actions**: Automated workflows for build, test, and deployment
3. **Docker Compose**: Container orchestration for WordPress sites
4. **Nginx Reverse Proxy**: Load balancing and SSL termination
5. **MySQL Database**: Centralized database server
6. **Redis Cache**: Performance optimization
7. **Let's Encrypt**: Automated SSL certificate management

### Environments

- **Development**: Local development environment
- **Staging**: Testing environment with staging subdomains
- **Production**: Live production environment

### Branch Strategy

```
main (production)
├── staging (staging environment)
├── matt/feature-* (feature branches)
├── matt/add-website-* (new website branches)
└── hotfix/* (emergency fixes)
```

## Prerequisites

### Required Software
- Docker and Docker Compose
- Git
- GitHub CLI (optional but recommended)
- Node.js (for local development)

### Required Accounts
- GitHub account with repository access
- Domain registrar access for DNS management
- Server access (VPS/dedicated server)

### Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- Minimum 4GB RAM, 2 CPU cores
- 50GB+ available disk space
- Root or sudo access

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/wordpress-multisite.git
cd wordpress-multisite
```

### 2. Server Preparation

Run the server setup script on your production server:

```bash
# On production server
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Environment Configuration

Copy and configure environment files:

```bash
# For production
cp .env.example .env
# Edit .env with production values

# For staging  
cp .env.staging .env.staging
# Edit .env.staging with staging values
```

### 4. GitHub Repository Configuration

Run the repository setup script:

```bash
chmod +x .github/scripts/setup-repository.sh
./.github/scripts/setup-repository.sh your-github-username wordpress-multisite
```

## Environment Configuration

### Production Environment (.env)

```bash
# MySQL Configuration
MYSQL_ROOT_PASSWORD=your_secure_production_password

# Website Databases
AIRAROM_DB_NAME=airarom_wp
AIRAROM_DB_USER=airarom_user  
AIRAROM_DB_PASSWORD=secure_password

# Environment Settings
ENVIRONMENT=production
WP_DEBUG=false
WP_FORCE_SSL_ADMIN=true
DISALLOW_FILE_EDIT=true

# Performance Settings
PHP_MEMORY_LIMIT=512M
PHP_MAX_EXECUTION_TIME=300
```

### Staging Environment (.env.staging)

```bash
# MySQL Configuration  
MYSQL_ROOT_PASSWORD=staging_password

# Website Databases (with staging prefix)
AIRAROM_DB_NAME=staging_airarom_wp
AIRAROM_DB_USER=staging_airarom
AIRAROM_DB_PASSWORD=staging_password

# Environment Settings
ENVIRONMENT=staging
WP_DEBUG=true
WP_DEBUG_LOG=true
SSL_STAGING=true
```

## GitHub Repository Setup

### Required Secrets

Configure these secrets in GitHub Settings → Secrets and variables → Actions:

#### Production Environment
- `PRODUCTION_HOST`: Server IP address
- `PRODUCTION_USER`: SSH username  
- `PRODUCTION_PRIVATE_KEY`: SSH private key
- `PRODUCTION_PATH`: Deployment path (/var/www/wordpress-multisite)
- `PRODUCTION_ENV`: Complete .env file content

#### Staging Environment
- `STAGING_HOST`: Staging server IP
- `STAGING_USER`: SSH username
- `STAGING_PRIVATE_KEY`: SSH private key  
- `STAGING_PATH`: Staging deployment path
- `STAGING_ENV`: Complete .env.staging content

#### Notifications
- `SLACK_WEBHOOK`: Slack webhook URL for notifications

### Branch Protection Rules

The setup script automatically configures:

- **Main Branch**: Requires PR reviews, status checks, and conversation resolution
- **Staging Branch**: Requires status checks and PR reviews
- **Feature Branches**: No special restrictions

## Deployment Workflows

### 1. Main Deployment Workflow (.github/workflows/deploy.yml)

**Triggers:**
- Push to `main` branch (production deployment)
- Push to `staging` branch (staging deployment)
- Pull requests to `main` (testing only)

**Stages:**
1. **Security & Quality Checks**
   - Vulnerability scanning with Trivy
   - Sensitive file detection
   - Docker file linting
   - Docker Compose validation

2. **Build & Test**
   - Docker image building
   - Test environment setup
   - Health checks
   - Integration testing

3. **Deploy to Staging** (staging branch)
   - SSH deployment to staging server
   - Environment configuration
   - Health checks
   - Staging site verification

4. **Deploy to Production** (main branch)
   - Pre-deployment backup
   - SSH deployment to production server
   - Environment configuration
   - Health checks
   - Production site verification
   - Slack notification

### 2. Add Website Workflow (.github/workflows/add-website.yml)

**Trigger:** Manual workflow dispatch

**Process:**
1. Input validation (website name, domain, type)
2. Conflict checking (existing websites)
3. Website structure creation
4. Docker Compose configuration update
5. Nginx configuration update
6. Documentation generation
7. Pull request creation

### 3. Backup & Monitor Workflow (.github/workflows/backup-monitor.yml)

**Triggers:**
- Daily backups at 2 AM UTC
- Weekly full backups on Sunday
- Hourly health checks during business hours
- Manual workflow dispatch

**Features:**
- Database backups with compression
- File system backups
- Health monitoring
- SSL certificate expiration checks
- Performance monitoring
- Security scanning

## Adding New Websites

### Automated Method (Recommended)

1. **Navigate to GitHub Actions**
   ```
   Repository → Actions → Add New Website
   ```

2. **Fill in Website Details**
   - Website name (e.g., `newsite`)
   - Domain name (e.g., `newsite.com`)
   - Website type (`wordpress` or `static`)
   - Database name (auto-generated for WordPress)
   - Description (optional)

3. **Review Generated Pull Request**
   - Check Docker Compose changes
   - Verify Nginx configuration
   - Review documentation
   - Test locally if needed

4. **Configure Environment Variables**
   ```bash
   # Add to production .env file
   NEWSITE_DB_NAME=newsite_wp
   NEWSITE_DB_USER=newsite_user
   NEWSITE_DB_PASSWORD=secure_password
   ```

5. **Configure DNS Records**
   ```
   A record: newsite.com → Your server IP
   A record: www.newsite.com → Your server IP
   ```

6. **Merge and Deploy**
   - Merge the pull request
   - Monitor deployment in Actions tab
   - Verify website accessibility

7. **Generate SSL Certificate**
   ```bash
   # On production server
   ./scripts/deploy-enhanced.sh ssl install
   ```

### Manual Method

1. **Create Feature Branch**
   ```bash
   git checkout -b matt/add-website-newsite
   ```

2. **Create Website Directory**
   ```bash
   mkdir -p newsite.com/public_html/wp-content/{themes,plugins,uploads}
   echo "DO NOT UPLOAD HERE" > newsite.com/DO_NOT_UPLOAD_HERE
   ```

3. **Update Docker Compose**
   Add service configuration to `docker-compose.yml`

4. **Update Nginx Configuration**
   Add server block to `nginx/conf.d/default.conf`

5. **Create Database Init Script**
   Add script to `mysql/init/02-newsite-database.sql`

6. **Update Deployment Scripts**
   Add website to backup and health check lists

7. **Create Documentation**
   Add `newsite.com/README.md` with setup instructions

8. **Commit and Create PR**
   ```bash
   git add .
   git commit -m "Add new website: newsite.com"
   git push origin matt/add-website-newsite
   gh pr create --title "Add new website: newsite.com"
   ```

## Monitoring and Maintenance

### Health Monitoring

The system includes automated health checks for:

- **Container Health**: All Docker services status
- **Database Connectivity**: MySQL connection and performance
- **Redis Connectivity**: Cache service availability
- **Website Accessibility**: HTTP response checks for all sites
- **SSL Certificate Status**: Expiration monitoring
- **System Resources**: CPU, memory, and disk usage

### Backup Strategy

**Daily Backups:**
- All WordPress databases
- Website files (wp-content)
- Configuration files
- Retention: 7 days

**Weekly Backups:**
- Complete system backup
- External storage upload (if configured)
- Retention: 30 days

**Emergency Backups:**
- Created before deployments
- On-demand via GitHub Actions
- Retention: 90 days

### Performance Monitoring

**Metrics Collected:**
- Container resource usage
- Database performance metrics
- Redis cache statistics
- Website response times
- Nginx performance

**Alerting:**
- Slack notifications for failures
- Email alerts for critical issues
- Dashboard monitoring (if configured)

### Security Monitoring

**Daily Checks:**
- Security update availability
- Failed login attempt analysis
- File permission auditing
- SSL certificate status
- Docker image vulnerability scanning

## Troubleshooting

### Common Issues

#### 1. Deployment Fails

**Check GitHub Actions logs:**
```
Repository → Actions → Failed workflow → View logs
```

**Common causes:**
- SSH connection issues
- Environment variable missing
- Disk space full
- Docker service not running

#### 2. Website Not Accessible

**Check container status:**
```bash
docker-compose ps
```

**Check logs:**
```bash
docker-compose logs nginx-proxy
docker-compose logs website-name
```

**Check DNS:**
```bash
nslookup domain.com
```

#### 3. Database Connection Issues

**Check MySQL status:**
```bash
docker-compose logs mysql
docker-compose exec mysql mysql -uroot -p
```

**Check environment variables:**
```bash
grep -i mysql .env
```

#### 4. SSL Certificate Issues

**Check certificate status:**
```bash
./scripts/deploy-enhanced.sh ssl check
```

**Renew certificates:**
```bash
./scripts/deploy-enhanced.sh ssl renew
```

#### 5. Backup Failures

**Check backup logs:**
```bash
tail -f logs/deploy.log
```

**Manual backup:**
```bash
./scripts/deploy-enhanced.sh backup production
```

### Emergency Procedures

#### 1. Rollback Deployment

```bash
# Automatic rollback to last backup
./scripts/deploy-enhanced.sh rollback production

# Rollback to specific backup
./scripts/deploy-enhanced.sh rollback production backup_name
```

#### 2. Emergency Stop

```bash
# Stop all services immediately
docker-compose down

# Emergency backup before changes
./scripts/deploy-enhanced.sh backup production --force
```

#### 3. Recovery from Backup

```bash
# List available backups
ls -la backups/

# Restore from specific backup
./scripts/deploy-enhanced.sh rollback production backup_20231201_120000
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Run inside MySQL container
OPTIMIZE TABLE wp_posts;
OPTIMIZE TABLE wp_postmeta;
OPTIMIZE TABLE wp_options;
```

#### 2. Cache Optimization

```bash
# Clear Redis cache
docker-compose exec redis redis-cli flushall

# WordPress cache clear (if using cache plugins)
docker-compose exec website-name wp cache flush
```

#### 3. Log Rotation

```bash
# Clean old logs
find logs/ -name "*.log" -mtime +30 -delete

# Rotate Docker logs
docker system prune -f
```

## Support and Resources

### Documentation Links
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [WordPress Codex](https://codex.wordpress.org/)

### Getting Help

1. **Check GitHub Issues**: Search existing issues for similar problems
2. **Review Logs**: Always include relevant logs when reporting issues
3. **Create Detailed Issue**: Use issue templates for bug reports and feature requests
4. **Emergency Contact**: Use Slack channels for urgent production issues

### Contributing

1. Fork the repository
2. Create feature branch (`matt/feature-name`)
3. Follow existing code style and conventions
4. Add tests for new functionality
5. Update documentation
6. Submit pull request with detailed description

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Maintainer**: DevOps Team