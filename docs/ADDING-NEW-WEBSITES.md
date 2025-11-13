# Adding New Websites to WordPress Multi-Site Setup

## Overview

This guide provides step-by-step instructions for adding new websites to the WordPress multi-site Docker deployment using the automated CI/CD pipeline.

## Table of Contents

- [Quick Start (Automated)](#quick-start-automated)
- [Manual Process](#manual-process)  
- [Configuration Details](#configuration-details)
- [Testing and Validation](#testing-and-validation)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Quick Start (Automated)

### Step 1: Trigger the Add Website Workflow

1. **Navigate to GitHub Actions**
   - Go to your repository on GitHub
   - Click on the "Actions" tab
   - Find "Add New Website" workflow
   - Click "Run workflow"

2. **Fill in Website Information**
   ```
   Website name: newsite
   Domain name: newsite.com
   Website type: wordpress (or static)
   Database name: (auto-generated if blank)
   Description: Brief description of the website
   ```

3. **Review Input Validation**
   - Website name: lowercase letters and numbers only
   - Domain name: valid domain format (e.g., example.com)
   - No conflicts with existing websites

### Step 2: Review Generated Pull Request

The workflow will automatically create a pull request with:

- **Website directory structure**
- **Updated Docker Compose configuration**
- **Updated Nginx configuration**
- **Database initialization script**
- **Updated deployment scripts**
- **Documentation (README.md)**

### Step 3: Configure Environment Variables

Before merging the PR, add required environment variables:

**For WordPress sites, add to your `.env` file:**
```bash
# NewSite.com WordPress Configuration
NEWSITE_DB_NAME=newsite_wp
NEWSITE_DB_USER=newsite_user
NEWSITE_DB_PASSWORD=your_secure_password_here
```

**For staging environment, add to `.env.staging`:**
```bash
# NewSite.com Staging Configuration  
NEWSITE_DB_NAME=staging_newsite_wp
NEWSITE_DB_USER=staging_newsite_user
NEWSITE_DB_PASSWORD=staging_password_here
```

### Step 4: Configure DNS

Point your domain to the server:

```bash
# DNS A Records
newsite.com        → Your Server IP
www.newsite.com    → Your Server IP

# For staging (optional)
staging-newsite.com → Your Staging Server IP
```

### Step 5: Merge and Deploy

1. **Review the pull request thoroughly**
2. **Merge the pull request to main branch**
3. **Monitor deployment in GitHub Actions**
4. **Verify deployment success**

### Step 6: Generate SSL Certificate

After successful deployment:

```bash
# SSH into your production server
ssh user@your-server.com

# Navigate to project directory
cd /path/to/wordpress-multisite

# Generate SSL certificate
./scripts/deploy-enhanced.sh ssl install
```

## Manual Process

If you prefer to add websites manually or need more control:

### Step 1: Create Feature Branch

```bash
git checkout -b matt/add-website-newsite
```

### Step 2: Create Website Directory Structure

**For WordPress sites:**
```bash
mkdir -p newsite.com/public_html/wp-content/{themes,plugins,uploads}

# Create .gitkeep files to preserve directory structure
touch newsite.com/public_html/.gitkeep
touch newsite.com/public_html/wp-content/.gitkeep  
touch newsite.com/public_html/wp-content/themes/.gitkeep
touch newsite.com/public_html/wp-content/plugins/.gitkeep
touch newsite.com/public_html/wp-content/uploads/.gitkeep

# Create upload restriction marker
echo "This directory structure is managed by Docker and CI/CD. Do not upload files directly here." > newsite.com/DO_NOT_UPLOAD_HERE

# Create basic index.php
cat > newsite.com/public_html/index.php << 'EOF'
<?php
// WordPress entry point
// This file will be replaced by WordPress core during deployment
echo '<h1>WordPress site is being set up...</h1>';
EOF
```

**For static sites:**
```bash
mkdir -p newsite.com/public_html

cat > newsite.com/public_html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NewSite.com</title>
</head>
<body>
    <h1>Welcome to NewSite.com</h1>
    <p>This is a placeholder page. Please replace with your content.</p>
</body>
</html>
EOF
```

### Step 3: Update Docker Compose Configuration

Add the service configuration to `docker-compose.yml`:

**For WordPress sites:**
```yaml
  # NewSite.com WordPress Site
  newsite:
    build:
      context: .
      dockerfile: ./dockerfiles/Dockerfile.wordpress
    container_name: newsite-wp
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_NAME: ${NEWSITE_DB_NAME}
      WORDPRESS_DB_USER: ${NEWSITE_DB_USER}
      WORDPRESS_DB_PASSWORD: ${NEWSITE_DB_PASSWORD}
      WORDPRESS_TABLE_PREFIX: wp_
      WP_CACHE: "true"
      WP_DEBUG: "false"
    volumes:
      - ./newsite.com/public_html:/var/www/html
      - wp_newsite:/var/www/html/wp-content/uploads
    depends_on:
      - mysql
      - redis
    restart: unless-stopped
    networks:
      - wp-network
```

**For static sites:**
```yaml
  # NewSite.com Static Site
  newsite:
    image: nginx:alpine
    container_name: newsite-static
    volumes:
      - ./newsite.com/public_html:/usr/share/nginx/html
      - ./nginx/static.conf:/etc/nginx/conf.d/default.conf
    restart: unless-stopped
    networks:
      - wp-network
```

**Update the nginx service dependencies:**
```yaml
  nginx:
    # ... existing configuration
    depends_on:
      - airarom
      - electroromanos
      # ... other services
      - newsite  # Add your new service here
```

**Add volume for WordPress sites:**
```yaml
volumes:
  mysql_data:
  redis_data:
  # ... existing volumes
  wp_newsite:  # Add this line for WordPress sites
```

### Step 4: Update Nginx Configuration

Add server block to `nginx/conf.d/default.conf`:

**For WordPress sites:**
```nginx
# NewSite.com WordPress Site
server {
    listen 80;
    listen [::]:80;
    server_name newsite.com www.newsite.com;
    
    location / {
        proxy_pass http://newsite:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SSL redirect (to be enabled after SSL setup)
    # return 301 https://$server_name$request_uri;
}

# HTTPS configuration (to be uncommented after SSL setup)
# server {
#     listen 443 ssl http2;
#     listen [::]:443 ssl http2;
#     server_name newsite.com www.newsite.com;
#     
#     ssl_certificate /etc/ssl/certs/newsite.com/fullchain.pem;
#     ssl_certificate_key /etc/ssl/certs/newsite.com/privkey.pem;
#     
#     location / {
#         proxy_pass http://newsite:80;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }
# }
```

### Step 5: Create Database Initialization Script

For WordPress sites, create `mysql/init/02-newsite-database.sql`:

```sql
-- Create database and user for newsite_wp
CREATE DATABASE IF NOT EXISTS `newsite_wp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'newsite_user'@'%' IDENTIFIED BY 'temp_password_to_be_changed';
GRANT ALL PRIVILEGES ON `newsite_wp`.* TO 'newsite_user'@'%';
FLUSH PRIVILEGES;
```

### Step 6: Update Deployment Scripts

Update `scripts/deploy.sh` to include the new website:

**Add to databases array:**
```bash
local databases=("electromanos_wp" "freshexpress_wp" "sabeel_wp" "sabeelacademy_wp" "sumo_wp" "yvesmorel_wp" "zonemation_wp" "newsite_wp")
```

**Add to sites array:**
```bash
local sites=("electromanos.ma" "freshexpress.ma" "sabeel.agency" "sabeelacademy.ma" "sumo.ma" "yvesmorel.ma" "zonemation.com" "oumniarentalcars.com" "newsite.com")
```

**Add to health check services:**
```bash
local services=("nginx" "mysql" "redis" "electromanos" "sabeel" "zonemation" "sumo" "yvesmorel" "newsite")
```

### Step 7: Update Environment Templates

Add to `.env.example`:

```bash
# NewSite.com WordPress Site Configuration
NEWSITE_DB_NAME=newsite_wp
NEWSITE_DB_USER=newsite_user
NEWSITE_DB_PASSWORD=your_secure_password_here
```

### Step 8: Create Documentation

Create `newsite.com/README.md`:

```markdown
# NewSite.com

**Type:** WordPress  
**Domain:** newsite.com  
**Container:** newsite-wp  
**Database:** newsite_wp

## Description
Brief description of the website purpose and functionality.

## Setup Instructions

### Environment Configuration
Add the following to your `.env` file:
```bash
NEWSITE_DB_NAME=newsite_wp
NEWSITE_DB_USER=newsite_user
NEWSITE_DB_PASSWORD=your_secure_password
```

### Deployment
```bash
# Start the website
docker-compose up -d newsite

# Check status
docker-compose ps newsite

# View logs
docker-compose logs -f newsite
```

### Access
- **Development:** http://newsite.com (after adding to /etc/hosts)
- **Production:** https://newsite.com

### WordPress Admin
After initial setup, access WordPress admin at:
- https://newsite.com/wp-admin

## Maintenance

### Database Backup
```bash
# Backup database
./scripts/deploy-enhanced.sh backup

# Manual database backup
docker-compose exec mysql mysqldump -uroot -pPASSWORD newsite_wp > backups/newsite_wp_$(date +%Y%m%d_%H%M%S).sql
```

### File Backup
```bash
# Backup website files
tar -czf backups/newsite.com_files_$(date +%Y%m%d_%H%M%S).tar.gz newsite.com/
```

## Troubleshooting

### Common Issues
- **Container not starting:** Check logs with `docker-compose logs newsite`
- **Database connection:** Verify environment variables in `.env`
- **Domain not accessible:** Check nginx configuration and DNS settings

### Support
For support, create an issue in the repository with:
- Website name: newsite
- Domain: newsite.com
- Error logs: `docker-compose logs newsite`
```

### Step 9: Commit and Create Pull Request

```bash
git add .
git commit -m "Add new WordPress website: newsite.com

- Created website structure for newsite.com
- Updated Docker Compose configuration
- Updated Nginx configuration  
- Added deployment scripts updates
- Created documentation
- Added database initialization

Website details:
- Name: newsite
- Domain: newsite.com
- Type: WordPress
- Database: newsite_wp"

git push origin matt/add-website-newsite

# Create pull request using GitHub CLI
gh pr create --title "Add new WordPress website: newsite.com" \
  --body "This PR adds a new WordPress website for newsite.com.

## Changes Made
- Added website directory structure
- Updated Docker Compose configuration
- Updated Nginx reverse proxy configuration
- Added database initialization script
- Updated deployment scripts
- Created documentation

## Configuration Required
Add these environment variables to production .env:
\`\`\`
NEWSITE_DB_NAME=newsite_wp
NEWSITE_DB_USER=newsite_user
NEWSITE_DB_PASSWORD=your_secure_password
\`\`\`

## DNS Configuration
Point newsite.com and www.newsite.com to server IP.

## Testing Checklist
- [ ] Docker Compose validates
- [ ] Container builds successfully
- [ ] Website accessible locally
- [ ] Database connection works
- [ ] Documentation is complete"
```

## Configuration Details

### Environment Variables

Each WordPress site requires three environment variables:

```bash
# Pattern: {SITE_NAME}_DB_{SETTING}
SITENAME_DB_NAME=database_name
SITENAME_DB_USER=database_user  
SITENAME_DB_PASSWORD=secure_password
```

**Naming conventions:**
- Site name: lowercase, no special characters
- Database name: sitename_wp
- Database user: sitename_user

### Database Configuration

**Character set:** utf8mb4  
**Collation:** utf8mb4_unicode_ci  
**Table prefix:** wp_ (standard WordPress)

### Volume Mapping

**WordPress sites:**
```yaml
volumes:
  - ./sitename.com/public_html:/var/www/html
  - wp_sitename:/var/www/html/wp-content/uploads
```

**Static sites:**
```yaml
volumes:
  - ./sitename.com/public_html:/usr/share/nginx/html
  - ./nginx/static.conf:/etc/nginx/conf.d/default.conf
```

### Nginx Configuration

**Standard WordPress proxy:**
- HTTP to HTTPS redirect (after SSL)
- Proper headers for WordPress
- WebSocket support (if needed)
- File upload size limits

**Static site configuration:**
- Direct file serving
- Cache headers
- Gzip compression
- Security headers

## Testing and Validation

### Local Testing

1. **Add to /etc/hosts:**
   ```bash
   127.0.0.1 newsite.com www.newsite.com
   ```

2. **Start services:**
   ```bash
   docker-compose up -d newsite
   ```

3. **Verify container status:**
   ```bash
   docker-compose ps newsite
   ```

4. **Check logs:**
   ```bash
   docker-compose logs -f newsite
   ```

5. **Test website access:**
   ```bash
   curl -L http://newsite.com
   ```

### Staging Testing

1. **Deploy to staging:**
   ```bash
   git checkout staging
   git merge matt/add-website-newsite
   git push origin staging
   ```

2. **Monitor deployment:**
   - Check GitHub Actions workflow
   - Verify staging deployment succeeds
   - Test staging URL

3. **Validate functionality:**
   - Website loads correctly
   - WordPress admin accessible (if WordPress)
   - Database connections work
   - SSL certificate generates

### Production Validation

After merging to main:

1. **Monitor deployment:**
   - GitHub Actions workflow completion
   - No error messages in logs

2. **Verify website access:**
   ```bash
   curl -L https://newsite.com
   ```

3. **Check SSL certificate:**
   ```bash
   curl -I https://newsite.com
   openssl s_client -connect newsite.com:443 -servername newsite.com
   ```

4. **Verify database connectivity:**
   ```bash
   docker-compose exec mysql mysql -uroot -p -e "SHOW DATABASES;"
   ```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

**Check Docker Compose syntax:**
```bash
docker-compose config
```

**Check container logs:**
```bash
docker-compose logs newsite
```

**Common causes:**
- Invalid environment variables
- Missing volume directories
- Port conflicts
- Network issues

#### 2. Website Not Accessible

**Check nginx configuration:**
```bash
docker-compose exec nginx-proxy nginx -t
```

**Check DNS resolution:**
```bash
nslookup newsite.com
```

**Check server block:**
- Verify domain spelling
- Check proxy_pass target
- Verify container name

#### 3. Database Connection Failed

**Verify environment variables:**
```bash
docker-compose exec newsite env | grep -i db
```

**Check database exists:**
```bash
docker-compose exec mysql mysql -uroot -p -e "SHOW DATABASES;"
```

**Test database connection:**
```bash
docker-compose exec mysql mysql -uusername -ppassword database_name
```

#### 4. SSL Certificate Issues

**Check certificate generation logs:**
```bash
./scripts/deploy-enhanced.sh ssl check
```

**Verify DNS propagation:**
```bash
dig newsite.com
dig www.newsite.com
```

**Manual certificate generation:**
```bash
certbot certonly --standalone -d newsite.com -d www.newsite.com
```

#### 5. Build Failures

**Check GitHub Actions logs:**
- Security scan failures
- Docker build errors
- Test failures

**Common solutions:**
- Fix linting errors
- Update environment variables
- Resolve merge conflicts

## Best Practices

### Security

1. **Use strong passwords** for database credentials
2. **Enable SSL immediately** after DNS propagation
3. **Regular security updates** through automated workflows
4. **Limit file permissions** appropriately
5. **Use environment-specific credentials**

### Performance

1. **Optimize database queries** in WordPress
2. **Enable caching plugins** for WordPress sites
3. **Use Redis caching** where applicable
4. **Optimize images** and static assets
5. **Monitor resource usage**

### Maintenance

1. **Regular backups** (automated via CI/CD)
2. **Monitor SSL expiration** (automated alerts)
3. **Update WordPress core and plugins** regularly
4. **Review logs periodically** for errors
5. **Performance monitoring** and optimization

### Development Workflow

1. **Use feature branches** for all changes
2. **Test locally** before pushing
3. **Use staging environment** for testing
4. **Document all changes** thoroughly
5. **Follow naming conventions** consistently

### Monitoring

1. **Set up health checks** for new websites
2. **Configure alerting** for downtime
3. **Monitor performance metrics**
4. **Track SSL certificate status**
5. **Regular backup verification**

---

**Need Help?**

- Check the main [CI/CD Setup Guide](CI-CD-SETUP.md)
- Review existing website configurations for examples
- Create an issue using the "New Website Request" template
- Contact the DevOps team through designated channels

**Last Updated**: November 2024