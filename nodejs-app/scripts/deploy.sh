#!/bin/bash

APP_DIR="/var/www/devops-demo-app"
APP_NAME="devops-demo-app"

echo "=========================================="
echo "Deploying Application"
echo "=========================================="

# Navigate to app directory
cd $APP_DIR || exit 1

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "Pulling latest code..."
    git pull origin main
fi

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Restart application with PM2
echo "Restarting application..."
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start server.js --name $APP_NAME -i max
pm2 save

# Show status
pm2 status

echo "=========================================="
echo "Deployment Complete!"
echo "Application is running on port 3000"
echo "=========================================="
