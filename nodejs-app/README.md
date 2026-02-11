# DevOps Demo Application

A Node.js Express application designed for deployment with Jenkins CI/CD pipeline on AWS infrastructure.

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Deployment Methods](#deployment-methods)
- [Infrastructure Setup](#infrastructure-setup)
- [Jenkins Pipeline Setup](#jenkins-pipeline-setup)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- ✅ Express.js web server
- ✅ Health check endpoint
- ✅ RESTful API
- ✅ Docker containerization
- ✅ Jenkins CI/CD pipeline
- ✅ PM2 process management
- ✅ Automated tests
- ✅ Production-ready

## 🔧 Prerequisites

### Required Software
- Node.js 18.x or higher
- npm 9.x or higher
- Docker (for containerized deployment)
- Git

### Infrastructure Requirements
- AWS EC2 instances (from your Terraform setup)
- Jenkins server
- Web server(s)

## 💻 Local Development

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd devops-demo-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Test Application
```bash
# Run tests
npm test

# Access application
curl http://localhost:3000
curl http://localhost:3000/health
```

## 🚀 Deployment Methods

### Method 1: Docker Deployment (Recommended)

#### On Jenkins Server:
```bash
# Build Docker image
docker build -t devops-demo-app .

# Run container
docker run -d \
  --name devops-demo-app \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  devops-demo-app:latest

# Check status
docker ps
docker logs devops-demo-app

# Test
curl http://localhost:3000/health
```

### Method 2: PM2 Deployment

#### On Web Server:
```bash
# Install Node.js and PM2
chmod +x scripts/install_on_webserver.sh
sudo ./scripts/install_on_webserver.sh

# Clone application
cd /var/www
git clone <your-repo-url> devops-demo-app
cd devops-demo-app

# Install dependencies
npm install --production

# Start with PM2
pm2 start server.js --name devops-demo-app -i max
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs devops-demo-app
```

### Method 3: Direct Node.js

```bash
# Install dependencies
npm install --production

# Run in background
nohup node server.js > app.log 2>&1 &

# Or use screen/tmux
screen -S app
node server.js
# Ctrl+A, D to detach
```

## 🏗️ Infrastructure Setup

### Step 1: Deploy AWS Infrastructure

```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Deploy infrastructure
terraform apply -auto-approve

# Note the outputs:
# - web_server_url
# - jenkins_server_url
# - alb_dns_name
```

### Step 2: Configure Web Server

SSH into web server:
```bash
# Get web server IP from terraform output
ssh -i myKeyPair.pem ubuntu@<web-server-ip>

# Upload and run installation script
scp -i myKeyPair.pem scripts/install_on_webserver.sh ubuntu@<web-server-ip>:~
ssh -i myKeyPair.pem ubuntu@<web-server-ip>
chmod +x install_on_webserver.sh
sudo ./install_on_webserver.sh
```

### Step 3: Setup Application on Web Server

```bash
# Clone application
cd /var/www
sudo git clone <your-repo-url> devops-demo-app
sudo chown -R ubuntu:ubuntu devops-demo-app
cd devops-demo-app

# Install and start
npm install --production
pm2 start server.js --name devops-demo-app
pm2 startup
pm2 save
```

## 🔄 Jenkins Pipeline Setup

### Step 1: Access Jenkins

```bash
# Get Jenkins URL from terraform output
# http://<jenkins-server-ip>:8080

# Get initial password
ssh -i myKeyPair.pem ubuntu@<jenkins-server-ip>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### Step 2: Initial Jenkins Configuration

1. **Unlock Jenkins**: Paste the initial admin password
2. **Install Suggested Plugins**: Click "Install suggested plugins"
3. **Create Admin User**: Fill in your details
4. **Configure Jenkins URL**: Use your Jenkins server URL

### Step 3: Install Required Plugins

Navigate to: `Manage Jenkins` → `Manage Plugins` → `Available`

Install these plugins:
- ✅ Git Plugin
- ✅ Docker Pipeline
- ✅ NodeJS Plugin
- ✅ SSH Agent

### Step 4: Configure NodeJS

Navigate to: `Manage Jenkins` → `Global Tool Configuration`

1. Scroll to **NodeJS**
2. Click **Add NodeJS**
3. Name: `NodeJS-18`
4. Version: `18.x`
5. Save

### Step 5: Create Jenkins Pipeline Job

1. **New Item** → Enter name: `devops-demo-app` → **Pipeline** → OK

2. **Configure Pipeline**:
   - **Description**: "Deploy DevOps Demo Application"
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `<your-git-repo-url>`
   - **Credentials**: Add your Git credentials if private
   - **Branch**: `*/main` or `*/master`
   - **Script Path**: `Jenkinsfile`

3. **Build Triggers** (Optional):
   - ✅ Poll SCM: `H/5 * * * *` (every 5 minutes)
   - ✅ GitHub hook trigger (if using GitHub webhooks)

4. **Save**

### Step 6: Run Pipeline

1. Click **Build Now**
2. Monitor **Console Output**
3. Check each stage:
   - ✅ Checkout
   - ✅ Install Dependencies
   - ✅ Run Tests
   - ✅ Build Docker Image
   - ✅ Deploy Application
   - ✅ Health Check

### Step 7: Verify Deployment

```bash
# Check application
curl http://<web-server-ip>:3000
curl http://<web-server-ip>:3000/health

# Or via ALB
curl http://<alb-dns-name>
```

## 📝 Application Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page with UI |
| GET | `/health` | Health check (JSON) |
| GET | `/api/info` | Application info (JSON) |

## 🔍 Monitoring & Logs

### Docker Logs
```bash
docker logs devops-demo-app
docker logs -f devops-demo-app  # Follow logs
```

### PM2 Logs
```bash
pm2 logs devops-demo-app
pm2 logs --lines 100
```

### Application Metrics
```bash
pm2 monit              # Real-time monitoring
pm2 status             # Process status
docker stats           # Container stats
```

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000
# or
sudo netstat -tulpn | grep 3000

# Kill the process
sudo kill -9 <PID>
```

### Issue: Docker Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
sudo usermod -aG docker jenkins

# Restart Docker
sudo systemctl restart docker

# Re-login or restart session
```

### Issue: Application Won't Start

```bash
# Check Node.js version
node --version  # Should be 18.x+

# Check logs
pm2 logs devops-demo-app --lines 50

# Restart application
pm2 restart devops-demo-app

# Or with Docker
docker restart devops-demo-app
```

### Issue: Jenkins Build Fails

```bash
# Check Jenkins has Docker permissions
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Verify Docker works in Jenkins
# Go to Jenkins Console and run:
docker --version
docker ps
```

### Issue: Cannot Access Application

```bash
# Check if app is running
pm2 status
# or
docker ps

# Check if port is listening
sudo netstat -tulpn | grep 3000

# Check security group allows port 3000
# AWS Console → EC2 → Security Groups → web_sg
# Ensure inbound rule allows port 3000 from ALB security group

# Test locally first
curl http://localhost:3000/health

# Then test from outside
curl http://<public-ip>:3000/health
```

### Issue: Health Check Fails

```bash
# Check application logs
docker logs devops-demo-app

# Test health endpoint
curl -v http://localhost:3000/health

# Check if app is listening on correct interface
# Should be 0.0.0.0, not 127.0.0.1
```

## 📊 Project Structure

```
devops-demo-app/
├── server.js                 # Main application file
├── package.json             # Dependencies and scripts
├── Dockerfile               # Docker configuration
├── Jenkinsfile             # CI/CD pipeline definition
├── .dockerignore           # Docker ignore file
├── .gitignore              # Git ignore file
├── .env.example            # Environment variables template
├── server.test.js          # Test file
├── scripts/
│   ├── install_on_webserver.sh  # Web server setup script
│   └── deploy.sh                # Manual deployment script
└── README.md               # This file
```

## 🔐 Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use non-root user in Docker
3. ✅ Keep dependencies updated
4. ✅ Use HTTPS in production (add SSL/TLS)
5. ✅ Restrict security group rules
6. ✅ Regular security audits: `npm audit`

## 📈 Next Steps

1. **Add SSL/TLS**: Configure HTTPS with Let's Encrypt
2. **Implement Monitoring**: Add Prometheus/Grafana
3. **Add Database**: Connect to RDS/MongoDB
4. **Blue-Green Deployment**: Zero-downtime deployments
5. **Auto Scaling**: Configure ASG for web servers
6. **Backup Strategy**: Automated backups
7. **Logging**: Centralized logging with ELK stack

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review Jenkins console output
3. Check application logs
4. Verify infrastructure with `terraform plan`

## 📄 License

MIT License - Feel free to use this for learning and projects!
