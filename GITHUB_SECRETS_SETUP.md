# 🔐 GitHub Repository Secrets Setup Guide

## CRITICAL: Required Secrets for Deployment

The following secrets MUST be configured in your GitHub repository before the deployment workflow will work.

### 🛠️ HOW TO ADD SECRETS

1. Go to your GitHub repository: `https://github.com/stntr660/wp-multisite-platform`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below with the exact name shown

---

## 🚨 IMMEDIATE REQUIREMENTS (Minimal Deploy)

### Basic Environment Secrets
```
SECRET NAME: MYSQL_ROOT_PASSWORD
VALUE: your_actual_strong_password_here
DESCRIPTION: MySQL root password for database access
```

### Staging Server Secrets (When Ready)
```
SECRET NAME: STAGING_HOST
VALUE: your-staging-server-ip-or-hostname
DESCRIPTION: Staging server IP address or hostname

SECRET NAME: STAGING_USER  
VALUE: ubuntu (or root)
DESCRIPTION: SSH username for staging server

SECRET NAME: STAGING_PRIVATE_KEY
VALUE: -----BEGIN OPENSSH PRIVATE KEY-----
[Your complete SSH private key content]
-----END OPENSSH PRIVATE KEY-----
DESCRIPTION: SSH private key for staging server access

SECRET NAME: STAGING_PATH
VALUE: /opt/wordpress-multisite
DESCRIPTION: Deployment path on staging server

SECRET NAME: STAGING_ENV
VALUE: [Complete .env file content for staging]
DESCRIPTION: Environment variables for staging
```

### Production Server Secrets (When Ready)
```
SECRET NAME: PRODUCTION_HOST
VALUE: your-production-server-ip-or-hostname

SECRET NAME: PRODUCTION_USER
VALUE: ubuntu (or root)

SECRET NAME: PRODUCTION_PRIVATE_KEY  
VALUE: [Your SSH private key for production]

SECRET NAME: PRODUCTION_PATH
VALUE: /opt/wordpress-multisite

SECRET NAME: PRODUCTION_ENV
VALUE: [Complete .env file content for production]
```

### Notification Secrets (Optional)
```
SECRET NAME: SLACK_WEBHOOK
VALUE: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
DESCRIPTION: Slack webhook for deployment notifications

SECRET NAME: EMAIL_USERNAME
VALUE: your-email@gmail.com
DESCRIPTION: Email for notifications

SECRET NAME: EMAIL_PASSWORD
VALUE: your-app-password
DESCRIPTION: Email app password

SECRET NAME: NOTIFICATION_EMAIL
VALUE: admin@yourdomain.com
DESCRIPTION: Email to receive notifications
```

---

## 🔧 STAGING ENVIRONMENT SETUP

### 1. Create Staging Server
- Use a small VPS (2GB RAM minimum)
- Ubuntu 20.04 or 22.04 LTS
- Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 2. Generate SSH Key Pair
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f ~/.ssh/staging_deploy_key -C "staging-deploy"

# Copy public key to server
ssh-copy-id -i ~/.ssh/staging_deploy_key.pub ubuntu@YOUR_STAGING_IP

# Test connection
ssh -i ~/.ssh/staging_deploy_key ubuntu@YOUR_STAGING_IP
```

### 3. Prepare Server
```bash
# Connect to staging server
ssh ubuntu@YOUR_STAGING_IP

# Run the server setup script
curl -fsSL https://raw.githubusercontent.com/stntr660/wp-multisite-platform/main/server-setup-simple.sh | sudo bash

# Create deployment directory
sudo mkdir -p /opt/wordpress-multisite
sudo chown ubuntu:ubuntu /opt/wordpress-multisite
```

### 4. Configure Environment File for Staging
Create a `.env.staging` file with staging-specific values:
```bash
# Copy your current .env and modify for staging
cp .env .env.staging

# Update with staging database passwords
nano .env.staging
```

---

## 🎯 PRODUCTION ENVIRONMENT SETUP

### 1. Server Requirements
- **Minimum**: 4GB RAM, 2 CPU cores, 40GB SSD
- **Recommended**: 8GB RAM, 4 CPU cores, 100GB SSD
- **Operating System**: Ubuntu 22.04 LTS
- **Firewall**: Configured (UFW recommended)

### 2. Security Hardening
```bash
# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Install fail2ban
sudo apt install fail2ban
```

### 3. Domain Configuration
- Point all domains to your production server IP
- Configure DNS A records
- Set up wildcard SSL certificates

---

## ✅ VERIFICATION CHECKLIST

Before enabling production deployment:

### Repository Configuration
- [ ] All required secrets added to GitHub
- [ ] SSH keys properly configured
- [ ] Environment files prepared
- [ ] Minimal workflow tested successfully

### Server Preparation
- [ ] Staging server accessible via SSH
- [ ] Docker and Docker Compose installed
- [ ] Deployment directory created
- [ ] Firewall properly configured

### Network Configuration
- [ ] Domain DNS records updated
- [ ] SSL certificates planned
- [ ] Load balancer configured (if applicable)

### Backup Strategy
- [ ] Database backup location configured
- [ ] File backup strategy planned
- [ ] Rollback procedure tested

---

## 🚨 SECURITY WARNINGS

### 1. Protect Your Secrets
- **NEVER** commit secrets to git
- Use strong, unique passwords
- Rotate SSH keys regularly
- Monitor access logs

### 2. Database Security  
- Change default passwords immediately
- Use least-privilege access
- Enable SSL for database connections
- Regular security updates

### 3. Server Security
- Keep system updated
- Monitor failed login attempts
- Use key-based SSH authentication only
- Regular security audits

---

## 📞 TROUBLESHOOTING

### Deployment Fails with "Permission Denied"
```bash
# Check SSH key permissions
chmod 600 ~/.ssh/your_key
chmod 700 ~/.ssh

# Verify key is added to server
ssh -i ~/.ssh/your_key ubuntu@server "cat ~/.ssh/authorized_keys"
```

### Database Connection Fails
```bash
# Check MySQL is running
docker-compose exec mysql mysql -u root -p -e "SELECT 1;"

# Check environment variables
docker-compose exec mysql env | grep MYSQL
```

### Website Not Accessible
```bash
# Check nginx logs
docker-compose logs nginx

# Check container status
docker-compose ps

# Test local connectivity
curl -I http://localhost
```

---

## 🆘 EMERGENCY CONTACTS

If deployment fails in production:
1. Check GitHub Actions logs
2. SSH to server and check container logs
3. Use rollback script: `./scripts/rollback.sh auto`
4. Contact system administrator if needed

**Remember**: Always test in staging before production!