# 🚀 Complete VPS Deployment Guide for Beginners

## 📋 **What We're Building**
- **ElectroRomanos**: Your e-commerce website with existing data
- **7 Other WordPress sites**: Fresh installations
- **All secured**: Firewalls, SSL certificates, automated backups

---

## **STEP 1: Get Your VPS Information** 🔐

### **From Your Hosting Provider:**
You need these 4 pieces of information:

1. **Server IP Address**: `123.45.67.89` (example)
2. **Username**: Usually `root` or `ubuntu`  
3. **Password**: Or SSH key file
4. **SSH Port**: Usually `22`

### **Where to Find This:**
- **Hostinger**: VPS panel → Server details
- **DigitalOcean**: Droplets → Your server
- **Vultr**: Servers → Server details
- **Check your email**: Connection details are usually sent when VPS is created

### **Write Down:**
```
My VPS IP: ________________
Username: _________________ 
Password: _________________
Port: ____________________
```

---

## **STEP 2: Connect to Your VPS** 💻

### **Option A: Using Terminal (Mac/Linux)**
```bash
# Replace with your actual IP address
ssh root@YOUR_VPS_IP_ADDRESS

# Example:
ssh root@123.45.67.89
```

### **Option B: Using PuTTY (Windows)**
1. Download PuTTY from https://putty.org/
2. Open PuTTY
3. Enter your VPS IP address
4. Port: 22
5. Click "Open"
6. Login with username/password

### **First Connection:**
- Type `yes` when asked about fingerprint
- Enter your password
- You should see something like: `root@server:~#`

### **Test Commands:**
```bash
# Check you're connected
whoami
# Should show: root

# Check server info  
uname -a
# Should show Ubuntu details

# Check available space
df -h
# Should show disk usage
```

---

## **STEP 3: Prepare Your Server** 🛠️

### **Upload the Setup Script:**

**Method 1: Copy-Paste (Easiest)**
```bash
# Create the script file
nano server-setup.sh

# Copy the entire server-setup.sh script I created and paste it
# Press Ctrl+X, then Y, then Enter to save
```

**Method 2: Download (if you put it online)**
```bash
curl -O https://yourdomain.com/server-setup.sh
```

### **Run the Setup Script:**
```bash
# Make it executable
chmod +x server-setup.sh

# Run the setup (takes 10-15 minutes)
./server-setup.sh
```

### **What This Script Does:**
- ✅ Updates Ubuntu to latest version
- ✅ Installs Docker and Docker Compose
- ✅ Sets up firewall protection
- ✅ Configures security (fail2ban)
- ✅ Creates project directories
- ✅ Installs monitoring tools

### **Expected Output:**
```
[2025-01-12 10:30:15] Starting Hostinger VPS setup...
[2025-01-12 10:30:16] Updating system packages...
[2025-01-12 10:32:45] Installing Docker...
[2025-01-12 10:35:20] Configuring firewall...
...
[2025-01-12 10:45:30] Server ready for WordPress Docker deployment!
```

---

## **STEP 4: Upload Your Website Files** 📁

### **Method 1: Using SCP (from your computer)**
Open a new terminal **on your computer** (not the server):

```bash
# Navigate to your project folder
cd "/Users/mac/Documents/Zonemation/Transformation digital/Clients/WP"

# Upload everything to the server (replace YOUR_VPS_IP)
scp -r . root@YOUR_VPS_IP:/opt/wordpress-docker/

# Example:
scp -r . root@123.45.67.89:/opt/wordpress-docker/
```

### **Method 2: Using FileZilla (GUI)**
1. Download FileZilla from https://filezilla-project.org/
2. Connect using your VPS details
3. Upload your WP folder to `/opt/wordpress-docker/`

### **Method 3: Using Zip Upload**
```bash
# On your computer, create a zip file
cd "/Users/mac/Documents/Zonemation/Transformation digital/Clients"
zip -r wordpress-sites.zip WP/

# Upload the zip file
scp wordpress-sites.zip root@YOUR_VPS_IP:/opt/

# On the server, extract it
ssh root@YOUR_VPS_IP
cd /opt
unzip wordpress-sites.zip
mv WP wordpress-docker
```

### **Verify Upload Worked:**
```bash
# On the server, check files are there
ls -la /opt/wordpress-docker/
# You should see: docker-compose.yml, scripts/, electroromanos.ma/, etc.
```

---

## **STEP 5: Configure Security & Passwords** 🔐

### **Change Database Passwords:**
```bash
cd /opt/wordpress-docker
nano .env
```

**Change these lines** (use strong passwords):
```env
# CHANGE THESE PASSWORDS - VERY IMPORTANT!
MYSQL_ROOT_PASSWORD=MySuper$ecure$erver2025!
ELECTROROMANOS_DB_PASSWORD=ElectroR0man0s$2025!
SABEEL_DB_PASSWORD=Sabeel$Agency$2025!
# ... change all passwords
```

**Password Tips:**
- Use at least 12 characters
- Include numbers, symbols, uppercase, lowercase
- Don't use common words
- Write them down somewhere safe!

### **Save the file:**
- Press `Ctrl+X`
- Press `Y`
- Press `Enter`

---

## **STEP 6: Deploy Your Websites** 🚀

### **Start the Deployment:**
```bash
cd /opt/wordpress-docker

# Make scripts executable
chmod +x scripts/*.sh

# Start all services
./scripts/deploy.sh start
```

### **Expected Process:**
```
[2025-01-12 11:00:00] Starting Docker services...
[2025-01-12 11:00:05] Pulling latest images...
[2025-01-12 11:02:30] Building WordPress containers...
[2025-01-12 11:05:15] Starting MySQL database...
[2025-01-12 11:06:00] Starting Redis cache...
[2025-01-12 11:06:30] Starting WordPress sites...
[2025-01-12 11:07:00] Starting Nginx proxy...
[2025-01-12 11:08:00] Services started successfully.
```

### **Check Everything is Running:**
```bash
./scripts/deploy.sh health
```

**Expected Output:**
```
nginx: Running
mysql: Running  
redis: Running
electroromanos: Running
freshexpress: Running
sabeel: Running
```

---

## **STEP 7: Import Your ElectroRomanos Database** 💾

### **Import the Database:**
```bash
# Analyze your backup first
./scripts/import-database.sh analyze

# Import the database
./scripts/import-database.sh import

# Verify it worked
./scripts/import-database.sh verify electroromanos
```

### **Expected Output:**
```
[2025-01-12 11:10:00] Analyzing database backup structure...
[INFO] - Detected: ElectroRomanos site data
[2025-01-12 11:10:05] Importing database for electroromanos...
[2025-01-12 11:12:30] Database imported successfully
[2025-01-12 11:12:35] Import verification successful
```

---

## **STEP 8: Configure Your Domains** 🌐

### **Point Your Domains to the Server:**

**For each domain** (electroromanos.ma, sabeel.agency, etc.):

1. **Login to your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Find DNS settings** (might be called "DNS Management", "Name Servers")
3. **Add/Edit A Records:**
   ```
   Type: A
   Name: @
   Value: YOUR_VPS_IP_ADDRESS
   TTL: 3600
   
   Type: A  
   Name: www
   Value: YOUR_VPS_IP_ADDRESS
   TTL: 3600
   ```

### **Example for GoDaddy:**
- Go to "My Products" → "DNS"
- Click on your domain
- Add A record: `@` points to `123.45.67.89`
- Add A record: `www` points to `123.45.67.89`

### **Wait for DNS:** 
DNS changes take 10-30 minutes to work worldwide.

### **Test DNS:**
```bash
# Test if domain points to your server
nslookup electroromanos.ma
# Should show your VPS IP address
```

---

## **STEP 9: Install SSL Certificates** 🔒

### **Install Certificates for All Domains:**
```bash
./scripts/deploy.sh ssl
```

### **If Automatic Fails, Do Manual:**
```bash
# For each domain individually
certbot certonly --standalone -d electroromanos.ma -d www.electroromanos.ma
certbot certonly --standalone -d sabeel.agency -d www.sabeel.agency
# ... repeat for each domain
```

---

## **STEP 10: Test Your Websites** ✅

### **Test ElectroRomanos:**
1. **Visit:** https://electroromanos.ma
2. **Check:** Website loads properly
3. **Test:** WooCommerce products appear
4. **Login:** https://electroromanos.ma/wp-admin/
   - Username: Check your database or try `admin`
   - Password: If you don't know, reset it

### **Reset WordPress Password if Needed:**
```bash
# Connect to ElectroRomanos container
docker-compose exec electroromanos bash

# Reset admin password
wp user update admin --user_pass=NewPassword123! --skip-themes --skip-plugins

# Exit container
exit
```

### **Test Other Sites:**
- Visit each domain to see if containers are running
- Sites without databases will show setup screens
- We'll set those up next

---

## **STEP 11: Set Up Fresh WordPress for Other Sites** 🆕

### **For Each Remaining Site:**

**Example for Sabeel Agency:**
```bash
# Connect to Sabeel container
docker-compose exec sabeel bash

# Install WordPress
wp core install \
  --url="https://sabeel.agency" \
  --title="Sabeel Agency" \
  --admin_user="admin" \
  --admin_password="YourPassword123!" \
  --admin_email="admin@sabeel.agency" \
  --skip-themes --skip-plugins

# Exit container
exit
```

**Repeat for each site:**
- freshexpress.ma
- sabeelacademy.ma  
- sumo.ma
- yvesmorel.ma
- zonemation.com

---

## **STEP 12: Final Checks & Monitoring** 📊

### **Check All Services:**
```bash
./scripts/deploy.sh monitor
```

### **Create Your First Backup:**
```bash
./scripts/backup.sh backup
```

### **Set Up Monitoring:**
```bash
# Check container stats
ctop

# Check system resources
htop
```

---

## **🎉 CONGRATULATIONS!**

### **What You Now Have:**
- ✅ **ElectroRomanos**: Your e-commerce site with existing data
- ✅ **7 WordPress sites**: Fresh installations ready for content
- ✅ **Security**: Firewall, SSL certificates, automated backups
- ✅ **Monitoring**: Health checks and resource monitoring

### **Important Files to Keep Safe:**
- Server IP and login details
- Database passwords from `.env` file  
- WordPress admin passwords
- Domain registrar login details

### **Daily Management:**
```bash
# Check everything is working
./scripts/deploy.sh health

# View logs if there are issues
./scripts/deploy.sh logs

# Create backups (automated daily, but you can run manually)
./scripts/backup.sh backup
```

### **If Something Goes Wrong:**
```bash
# Restart all services
./scripts/deploy.sh restart

# View detailed logs
./scripts/deploy.sh logs

# Check system resources
./scripts/deploy.sh monitor
```

---

## **🆘 Emergency Contacts & Commands**

### **Emergency Restart:**
```bash
./scripts/deploy.sh stop
./scripts/deploy.sh start
```

### **Emergency Backup:**
```bash
./scripts/backup.sh backup
```

### **Get Help:**
```bash
# All available commands
./scripts/deploy.sh --help
./scripts/backup.sh --help
```

### **Key Log Locations:**
- **Nginx logs**: `/opt/wordpress-docker/logs/nginx/`
- **Container logs**: `docker-compose logs [service-name]`
- **System logs**: `/var/log/`

---

**You're now running a professional multi-site WordPress hosting environment! 🚀**

Let me know when you're ready to start, and I'll help you with each step!