# 🚀 VPS Deployment Guide - ninetails.site (CORRECTED)

This guide will help you deploy your DHL Shipping project to your VPS with domain `https://ninetails.site/`.

## 📋 Prerequisites

1. **VPS Access**: SSH access to your server
2. **Domain**: `ninetails.site` configured and pointing to your VPS
3. **Node.js**: Version 16+ installed on VPS
4. **Nginx**: Web server installed
5. **PM2**: Process manager for Node.js
6. **SSL Certificate**: Let's Encrypt for HTTPS

## 🛠️ VPS Setup

### 1. Connect to Your VPS
```bash
ssh root@your-vps-ip
```

### 2. Update System
```bash
apt update && apt upgrade -y
```

### 3. Install Required Software
```bash
# Install Node.js 22.06
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs

# Install Nginx
apt install nginx -y

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Install MySQL
apt install mysql-server -y
mysql_secure_installation
```

## 📁 Project Deployment

### 1. Clean and Create Project Directory
```bash
# Remove any existing directory
rm -rf /var/www/ninetails.site

# Create fresh directory
mkdir -p /var/www/ninetails.site
cd /var/www/ninetails.site
```

### 2. Clone Your Repository (CORRECT WAY)
```bash
# Clone directly into the directory (note the dot at the end)
git clone https://github.com/yourusername/dhlshipping.git .
```

### 3. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 4. Build Frontend
```bash
npm run build
```

### 5. Configure Environment Variables

**Backend (.env):**
```bash
cd /var/www/ninetails.site/backend
nano .env
```

Add this content:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://dhlshipping_user:your_secure_password@localhost:3306/dhlshipping"
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://ninetails.site
```

## 🗄️ Database Setup

### 1. Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE dhlshipping;
CREATE USER 'dhlshipping_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON dhlshipping.* TO 'dhlshipping_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Run Prisma Migrations
```bash
cd /var/www/ninetails.site/backend

# Fix file permissions first
sudo chown -R $USER:$USER /var/www/ninetails.site
sudo chmod -R 755 /var/www/ninetails.site

# Install Prisma locally
npm install prisma @prisma/client

# Run migrations with proper permissions
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

## 🌐 Nginx Configuration

### 1. Remove Old Configurations
```bash
# Remove old configurations
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/000-default
```

### 2. Create Nginx Site Configuration
```bash
nano /etc/nginx/sites-available/ninetails.site
```

### 3. Add Configuration
```nginx
server {
    listen 80;
    server_name ninetails.site www.ninetails.site;
    
    # Frontend (React App)
    location / {
        root /var/www/ninetails.site/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }
        
        # Cache HTML files
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### 4. Enable Site
```bash
ln -s /etc/nginx/sites-available/ninetails.site /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🚀 PM2 Configuration

### 1. Create PM2 Ecosystem File
```bash
nano /var/www/ninetails.site/ecosystem.config.js
```

### 2. Add Configuration
```javascript
module.exports = {
  apps: [
    {
      name: 'dhlshipping-backend',
      script: './backend/server.js',
      cwd: '/var/www/ninetails.site',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/pm2/dhlshipping-backend-error.log',
      out_file: '/var/log/pm2/dhlshipping-backend-out.log',
      log_file: '/var/log/pm2/dhlshipping-backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### 3. Create Log Directory
```bash
mkdir -p /var/log/pm2
```

### 4. Start Application
```bash
cd /var/www/ninetails.site
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔒 SSL Certificate Setup

### 1. Configure Firewall
```bash
# Allow necessary ports
ufw allow 80
ufw allow 443
ufw allow 22
ufw allow 5000
```

### 2. Get SSL Certificate
```bash
certbot --nginx -d ninetails.site -d www.ninetails.site
```

### 3. Auto-renewal
```bash
crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Deployment Script

### 1. Create Deployment Script
```bash
nano /var/www/ninetails.site/deploy.sh
```

### 2. Add Script Content
```bash
#!/bin/bash

echo "🚀 Starting deployment for ninetails.site..."

# Navigate to project directory
cd /var/www/ninetails.site

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend
npx prisma migrate deploy
npx prisma generate
cd ..

# Restart PM2 processes
echo "🔄 Restarting application..."
pm2 restart all

# Reload Nginx
echo "🌐 Reloading Nginx..."
systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Your site is live at: https://ninetails.site/"
```

### 3. Make Script Executable
```bash
chmod +x /var/www/ninetails.site/deploy.sh
```

## 🔧 Environment Configuration

### 1. Update Frontend API URL
```bash
nano /var/www/ninetails.site/src/config/config.ts
```

Update to:
```typescript
export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://ninetails.site/api',
  APP_NAME: 'DHL Shipping',
  VERSION: '1.0.0'
};
```

## 📊 Monitoring & Logs

### 1. PM2 Monitoring
```bash
# View processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

### 2. Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### 3. Application Logs
```bash
# PM2 logs
tail -f /var/log/pm2/dhlshipping-backend-out.log
tail -f /var/log/pm2/dhlshipping-backend-error.log
```

## 🔍 Troubleshooting

### Common Issues:

1. **Port 5000 not accessible**: Check firewall settings
2. **Database connection failed**: Verify MySQL credentials
3. **Build fails**: Check Node.js version and dependencies
4. **SSL issues**: Verify domain DNS settings
5. **PM2 not starting**: Check logs and environment variables

### 502 Bad Gateway - API Not Accessible:

If you get `502 Bad Gateway` when accessing `https://ninetails.site/api`, follow these steps:

#### 1. Check if Backend is Running
```bash
# Check PM2 status
pm2 status

# Check if process is running
ps aux | grep node

# Check if port 5000 is listening
netstat -tlnp | grep :5000
```

#### 2. Check Backend Logs
```bash
# Check PM2 logs
pm2 logs dhlshipping-backend

# Check specific log files
tail -f /var/log/pm2/dhlshipping-backend-error.log
tail -f /var/log/pm2/dhlshipping-backend-out.log
```

#### 3. Test Backend Directly
```bash
# Test if backend responds locally
curl http://localhost:5000

# Test API endpoint locally
curl http://localhost:5000/api/auth/health

# Check if backend is accessible from server
wget -qO- http://localhost:5000
```

#### 4. Restart Backend Services
```bash
# Restart PM2 processes
pm2 restart dhlshipping-backend

# Or restart all PM2 processes
pm2 restart all

# Check status again
pm2 status
```

#### 5. Check Nginx Configuration
```bash
# Test Nginx configuration
nginx -t

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Reload Nginx
systemctl reload nginx
```

#### 6. Verify Environment Variables
```bash
# Check if .env file exists and has correct values
cd /var/www/ninetails.site/backend
cat .env

# Verify DATABASE_URL is correct
grep DATABASE_URL .env
```

#### 7. Test Database Connection
```bash
# Test MySQL connection
mysql -u dhlshipping_user -p -e "SELECT 1;"

# Check if database exists
mysql -u dhlshipping_user -p -e "SHOW DATABASES;"
```

#### 8. Manual Backend Start (for debugging)
```bash
# Stop PM2
pm2 stop dhlshipping-backend

# Start backend manually to see errors
cd /var/www/ninetails.site/backend
node server.js

# If it starts successfully, you'll see the server logs
# Press Ctrl+C to stop, then restart PM2
pm2 start ecosystem.config.js
```

#### 9. Check File Permissions
```bash
# Ensure proper ownership
sudo chown -R $USER:$USER /var/www/ninetails.site
sudo chmod -R 755 /var/www/ninetails.site

# Check specific files
ls -la /var/www/ninetails.site/backend/
ls -la /var/www/ninetails.site/backend/.env
```

#### 10. Verify Node.js and Dependencies
```bash
# Check Node.js version
node --version

# Check if all dependencies are installed
cd /var/www/ninetails.site/backend
npm list --depth=0

# Reinstall dependencies if needed
rm -rf node_modules package-lock.json
npm install
```

### Prisma Permission Issues:
```bash
# Fix file permissions (use current user instead of root)
sudo chown -R $USER:$USER /var/www/ninetails.site
sudo chmod -R 755 /var/www/ninetails.site

# Alternative: If still having issues, try these steps
sudo chown -R $(whoami):$(whoami) /var/www/ninetails.site
sudo chmod -R 755 /var/www/ninetails.site

# Install Prisma locally
cd /var/www/ninetails.site/backend
npm install prisma @prisma/client

# Run with explicit permissions
npx --yes prisma migrate deploy
npx --yes prisma generate
npx --yes prisma db seed

# If still failing, try with sudo (not recommended but sometimes necessary)
sudo npx prisma migrate deploy
sudo npx prisma generate
sudo npx prisma db seed
```

### Useful Commands:
```bash
# Check service status
systemctl status nginx
systemctl status mysql
pm2 status

# Check ports
netstat -tlnp

# Check disk space
df -h

# Check memory usage
free -h

# Check file permissions
ls -la /var/www/ninetails.site/
```

## 🛡️ Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Fail2ban installed
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] Environment variables secured
- [ ] PM2 process monitoring

## 📞 Support

If you encounter issues:
1. Check all logs for errors
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings
5. Verify domain DNS configuration

---

**Your site will be live at: https://ninetails.site/ 🎉**
