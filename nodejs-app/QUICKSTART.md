# 🚀 Quick Start Guide

## Option 1: Fastest Way (Docker on Jenkins Server)

### 1. SSH into Jenkins Server
```bash
ssh -i myKeyPair.pem ubuntu@<jenkins-server-ip>
```

### 2. Clone and Deploy
```bash
# Clone repository
git clone <your-repo-url>
cd devops-demo-app

# Build and run with Docker
docker build -t devops-demo-app .
docker run -d --name devops-demo-app -p 3000:3000 devops-demo-app

# Test
curl http://localhost:3000/health
```

### 3. Access Application
Open browser: `http://<jenkins-server-ip>:3000`

---

## Option 2: Full CI/CD Pipeline (Recommended)

### Prerequisites Checklist
- [ ] Terraform infrastructure deployed
- [ ] Jenkins server running
- [ ] Web server provisioned
- [ ] Git repository created

### Step-by-Step

#### 1. Push Code to Git
```bash
cd devops-demo-app
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-url>
git push -u origin main
```

#### 2. Setup Jenkins (One-time)
```bash
# Access Jenkins
Open: http://<jenkins-ip>:8080

# Login with initial password:
ssh ubuntu@<jenkins-ip>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Install suggested plugins
# Create admin user
```

#### 3. Create Jenkins Job
```
1. New Item → "devops-demo-app" → Pipeline → OK
2. Pipeline → Definition: Pipeline script from SCM
3. SCM: Git
4. Repository URL: <your-git-url>
5. Script Path: Jenkinsfile
6. Save
```

#### 4. Build & Deploy
```
1. Click "Build Now"
2. Watch Console Output
3. Wait for success ✅
```

#### 5. Verify
```bash
curl http://<web-server-ip>:3000
curl http://<alb-dns-name>
```

---

## Option 3: Manual Deployment (Web Server)

### 1. SSH into Web Server
```bash
ssh -i myKeyPair.pem ubuntu@<web-server-ip>
```

### 2. Install Dependencies
```bash
# Upload script
exit
scp -i myKeyPair.pem scripts/install_on_webserver.sh ubuntu@<web-server-ip>:~
ssh -i myKeyPair.pem ubuntu@<web-server-ip>

# Run installation
chmod +x install_on_webserver.sh
sudo ./install_on_webserver.sh
```

### 3. Deploy Application
```bash
# Clone app
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

### 4. Test
```bash
curl http://localhost:3000/health
pm2 status
```

---

## 🎯 Quick Commands Reference

### Docker Commands
```bash
docker build -t devops-demo-app .              # Build image
docker run -d -p 3000:3000 devops-demo-app     # Run container
docker ps                                       # List containers
docker logs devops-demo-app                    # View logs
docker stop devops-demo-app                    # Stop container
docker rm devops-demo-app                      # Remove container
```

### PM2 Commands
```bash
pm2 start server.js --name devops-demo-app     # Start app
pm2 restart devops-demo-app                    # Restart
pm2 stop devops-demo-app                       # Stop
pm2 delete devops-demo-app                     # Remove
pm2 logs devops-demo-app                       # View logs
pm2 status                                      # Status
```

### Testing Commands
```bash
curl http://localhost:3000                     # Home page
curl http://localhost:3000/health              # Health check
curl http://localhost:3000/api/info            # App info
```

---

## ⚡ Expected Timeline

| Task | Time | Status |
|------|------|--------|
| Infrastructure (Terraform) | 5 min | ⏳ |
| Jenkins Setup | 10 min | ⏳ |
| App Deployment (Docker) | 2 min | ⏳ |
| App Deployment (PM2) | 5 min | ⏳ |
| Pipeline Setup | 10 min | ⏳ |
| **Total** | **~30 min** | |

---

## ✅ Success Checklist

- [ ] Infrastructure deployed (terraform apply)
- [ ] Jenkins accessible and configured
- [ ] Application code in Git repository
- [ ] Jenkins pipeline created
- [ ] First build successful
- [ ] Application accessible via browser
- [ ] Health check returns 200 OK
- [ ] ALB routing traffic correctly

---

## 🆘 Quick Troubleshooting

**App won't start?**
```bash
# Check logs
docker logs devops-demo-app
# or
pm2 logs devops-demo-app
```

**Port already in use?**
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

**Can't access from browser?**
```bash
# Check security group allows port 3000
# Check app is running: pm2 status
# Test locally first: curl localhost:3000
```

**Jenkins build fails?**
```bash
# Check Jenkins has Docker permission
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

---

## 📞 Need Help?

1. Check main README.md for detailed instructions
2. Review application logs
3. Verify security group rules
4. Test locally before remote access

**Happy Deploying! 🎉**
