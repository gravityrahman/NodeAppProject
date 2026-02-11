#!/bin/bash

echo "=========================================="
echo "Installing Application Dependencies"
echo "=========================================="

# Update system
sudo apt update -y

# Install Node.js 18.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install PM2 for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/devops-demo-app
sudo chown -R ubuntu:ubuntu /var/www/devops-demo-app

echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo "Next steps:"
echo "1. Clone your application to /var/www/devops-demo-app"
echo "2. Run: cd /var/www/devops-demo-app && npm install"
echo "3. Run: pm2 start server.js --name devops-demo-app"
echo "4. Run: pm2 startup"
echo "5. Run: pm2 save"
echo "=========================================="
