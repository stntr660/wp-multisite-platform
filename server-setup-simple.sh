#!/bin/bash

# Simple Hostinger VPS Setup Script
echo "Starting Hostinger VPS setup..."

# Update system
echo "Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install basic packages
echo "Installing required packages..."
apt-get install -y curl wget git nano htop ufw

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
echo "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker
systemctl start docker
systemctl enable docker

# Setup firewall
echo "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8080
ufw --force enable

# Create project directory
echo "Creating project directory..."
mkdir -p /opt/wordpress-docker
chmod 755 /opt/wordpress-docker

echo "Setup completed! Server ready for WordPress deployment."