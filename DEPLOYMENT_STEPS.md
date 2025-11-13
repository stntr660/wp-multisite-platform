# Step-by-Step Deployment Guide for Beginners

This guide will walk you through deploying all your WordPress websites to your Hostinger VPS using Docker containers.

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] Hostinger VPS with Ubuntu
- [ ] SSH access to your server
- [ ] Domain names pointing to your server IP
- [ ] Basic terminal/command line knowledge

## 🎯 Step 1: Access Your VPS Server

### Connect via SSH
```bash
ssh root@YOUR_SERVER_IP
```
Replace `YOUR_SERVER_IP` with your actual Hostinger VPS IP address.

### Verify you're connected
```bash
whoami
hostname
```
You should see `root` and your server hostname.

## 🛠️ Step 2: Prepare Your Server

### Download and run the setup script
```bash
# Download the server setup script
curl -O https://raw.githubusercontent.com/your-repo/server-setup.sh

# Or if you have the files locally, upload them first:
# scp -r /path/to/your/WP/ root@your_server_ip:/opt/wordpress-docker/

# Make it executable
chmod +x server-setup.sh

# Run the setup (this takes 10-15 minutes)
sudo ./server-setup.sh
```

### What this script does:
- ✅ Updates Ubuntu packages
- ✅ Installs Docker and Docker Compose
- ✅ Configures firewall (UFW)
- ✅ Sets up fail2ban security
- ✅ Creates project directories
- ✅ Configures system limits
- ✅ Sets up automated backups

## 📁 Step 3: Upload Your Website Files

### Option A: Upload via SCP (from your computer)
```bash
# On your local computer, run this command:
scp -r "/Users/mac/Documents/Zonemation/Transformation digital/Clients/WP/" root@YOUR_SERVER_IP:/opt/wordpress-docker/
```

### Option B: Upload manually using cPanel File Manager
1. Compress your WP folder into a zip file
2. Upload via Hostinger File Manager
3. Extract to `/opt/wordpress-docker/`

### Verify files are uploaded
```bash
cd /opt/wordpress-docker
ls -la
```
You should see all your folders: `electromanos.ma`, `sabeel.agency`, etc.

## ⚙️ Step 4: Configure Environment Variables

### Edit the .env file (VERY IMPORTANT!)
```bash
cd /opt/wordpress-docker
nano .env
```

### Change ALL passwords in .env file:
```env
# CHANGE THESE PASSWORDS - DO NOT USE THE DEFAULTS!
MYSQL_ROOT_PASSWORD=YOUR_SUPER_SECURE_ROOT_PASSWORD_HERE

# Change each site's database password
ELECTROMANOS_DB_PASSWORD=electromanos_secure_password_123
FRESHEXPRESS_DB_PASSWORD=freshexpress_secure_password_456
SABEEL_DB_PASSWORD=sabeel_secure_password_789
# ... change all passwords to something secure
```

### Save the file:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

## 🚀 Step 5: Deploy Your Websites

### Make scripts executable
```bash
chmod +x scripts/*.sh
```

### Start the deployment
```bash
./scripts/deploy.sh start
```

### This will:
- ✅ Download Docker images
- ✅ Create MySQL databases
- ✅ Start all WordPress containers
- ✅ Start Nginx reverse proxy
- ✅ Set up Redis caching

### Check if everything is running
```bash
./scripts/deploy.sh health
```

You should see all services as "Running".

## 🌐 Step 6: Configure Your Domains

### Point your domains to your server
In your domain registrar (GoDaddy, Namecheap, etc.), set:
```
A Record: @ → YOUR_SERVER_IP
A Record: www → YOUR_SERVER_IP
```

Do this for all domains:
- electromanos.ma
- freshexpress.ma
- sabeel.agency
- sabeelacademy.ma
- sumo.ma
- yvesmorel.ma
- zonemation.com
- oumniarentalcars.com

### Test domain resolution (wait 10-30 minutes after DNS changes)
```bash
nslookup electromanos.ma
ping electromanos.ma
```

## 🔒 Step 7: Install SSL Certificates

### Install Let's Encrypt certificates
```bash
./scripts/deploy.sh ssl
```

This will automatically generate SSL certificates for all your domains.

### If SSL installation fails:
```bash
# Try manual installation for each domain
certbot certonly --standalone -d electromanos.ma -d www.electromanos.ma
certbot certonly --standalone -d sabeel.agency -d www.sabeel.agency
# ... repeat for each domain
```

## ✅ Step 8: Test Your Websites

### Check each website in your browser:
- https://electromanos.ma
- https://freshexpress.ma
- https://sabeel.agency
- https://sabeelacademy.ma
- https://sumo.ma
- https://yvesmorel.ma
- https://zonemation.com
- https://oumniarentalcars.com

### Check database management:
- http://YOUR_SERVER_IP:8080 (phpMyAdmin)
- Username: `root`
- Password: Your `MYSQL_ROOT_PASSWORD`

## 🔄 Step 9: Set Up Automated Backups

### Test backup system
```bash
./scripts/backup.sh backup
```

### Verify backup was created
```bash
./scripts/backup.sh list
```

### Backups will run automatically every day at 2 AM

## 📊 Step 10: Monitor Your Deployment

### Check container status
```bash
docker-compose ps
```

### Monitor resource usage
```bash
./scripts/deploy.sh monitor
```

### View logs if needed
```bash
./scripts/deploy.sh logs
```

## 🚨 Common Issues and Solutions

### Issue: "Port already in use"
```bash
# Check what's using port 80
sudo netstat -tulpn | grep :80

# Stop Apache if running
sudo systemctl stop apache2
sudo systemctl disable apache2

# Restart deployment
./scripts/deploy.sh restart
```

### Issue: "Database connection error"
```bash
# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Wait 30 seconds, then test
```

### Issue: "Website shows default page"
```bash
# Check if your files are in the right place
ls -la electromanos.ma/public_html/

# Make sure wp-config.php exists
ls -la electromanos.ma/public_html/wp-config.php

# Check container logs
docker-compose logs electromanos
```

### Issue: "SSL certificate error"
```bash
# Check if domains point to your server
nslookup yourdomain.com

# Make sure no other web server is running
sudo systemctl stop apache2
sudo systemctl stop nginx

# Try SSL installation again
./scripts/deploy.sh ssl
```

## 📱 WordPress Admin Access

### Access WordPress admin for each site:
- https://electromanos.ma/wp-admin/
- https://sabeel.agency/wp-admin/
- etc.

### If you don't remember admin passwords:
```bash
# Connect to a container
docker-compose exec electromanos wp user list

# Reset password (replace with your username)
docker-compose exec electromanos wp user update admin --user_pass=newpassword123
```

## 🛡️ Security Best Practices

### Update WordPress and plugins:
```bash
# Update WordPress core
docker-compose exec electromanos wp core update

# Update plugins
docker-compose exec electromanos wp plugin update --all
```

### Monitor security:
```bash
# Check fail2ban status
sudo fail2ban-client status

# View failed login attempts
sudo grep "Failed password" /var/log/auth.log
```

## 🔧 Maintenance Commands

### Daily maintenance
```bash
# Check service health
./scripts/deploy.sh health

# View recent logs
./scripts/deploy.sh logs | tail -100

# Check disk space
df -h
```

### Weekly maintenance
```bash
# Create backup
./scripts/backup.sh backup

# Update Docker images
./scripts/deploy.sh update

# Clean up old backups
./scripts/backup.sh cleanup
```

### Monthly maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update SSL certificates
sudo certbot renew

# Review security logs
sudo grep "Failed" /var/log/auth.log | tail -50
```

## 📞 Getting Help

### View detailed logs:
```bash
# System logs
sudo journalctl -f

# Docker logs
docker-compose logs -f

# Nginx access logs
tail -f logs/nginx/access.log
```

### Emergency shutdown:
```bash
./scripts/deploy.sh stop
```

### Emergency restore:
```bash
./scripts/backup.sh restore /path/to/backup_folder
```

## ✨ Congratulations!

If you've completed all steps successfully, you now have:
- ✅ 8 WordPress websites running in Docker containers
- ✅ 1 static website (oumniarentalcars.com)
- ✅ SSL certificates for all domains
- ✅ Automated backups
- ✅ Security monitoring
- ✅ Performance optimization

Your websites are now live and accessible from anywhere in the world!

## 📋 Next Steps

1. **Update WordPress**: Log into each WordPress admin and update themes/plugins
2. **Configure caching**: Install and configure caching plugins
3. **Set up monitoring**: Consider tools like Uptime Robot or Google Analytics
4. **Regular maintenance**: Schedule weekly health checks
5. **Security hardening**: Consider additional security plugins

## 🆘 Emergency Contacts

Keep these commands handy for emergencies:

```bash
# Stop everything immediately
./scripts/deploy.sh stop

# View what's wrong
./scripts/deploy.sh logs

# Restart everything
./scripts/deploy.sh restart

# Get help
./scripts/deploy.sh --help
```

---

**Remember**: Always test changes in a staging environment first, and keep regular backups!