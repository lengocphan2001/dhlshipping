# 🚀 VPS Deployment Guide - ninetails.site

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
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs

# Install Nginx
apt install nginx -y

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

## 📁 Project Deployment

### 1. Create Project Directory
```bash
mkdir -p /var/www/ninetails.site
cd /var/www/ninetails.site
```

### 2. Clone Your Repository
```bash
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

**Frontend (.env):**
```bash
REACT_APP_API_URL=https://ninetails.site/api
```

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/dhlshipping"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://ninetails.site
```

## 🌐 Nginx Configuration

### 1. Create Nginx Site Configuration
```bash
nano /etc/nginx/sites-available/ninetails.site
```

### 2. Add Configuration
```nginx
server {
    listen 80;
    server_name ninetails.site www.ninetails.site;
    
    # Frontend (React App)
    location / {
        root /var/www/ninetails.site/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
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
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 3. Enable Site
```bash
ln -s /etc/nginx/sites-available/ninetails.site /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🔒 SSL Certificate Setup

### 1. Get SSL Certificate
```bash
certbot --nginx -d ninetails.site -d www.ninetails.site
```

### 2. Auto-renewal
```bash
crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
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
      time: true
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

## 🗄️ Database Setup

### 1. Install MySQL
```bash
apt install mysql-server -y
mysql_secure_installation
```

### 2. Create Database
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

### 3. Run Prisma Migrations
```bash
cd /var/www/ninetails.site/backend
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

## 🔄 Deployment Script

### 1. Create Deployment Script
```bash
nano /var/www/ninetails.site/deploy.sh
```

### 2. Add Script Content
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

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
const config = {
  API_BASE_URL: 'https://ninetails.site/api'
};

export default config;
```

### 2. Update Backend Environment
```bash
nano /var/www/ninetails.site/backend/.env
```

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://dhlshipping_user:your_secure_password@localhost:3306/dhlshipping"
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://ninetails.site
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

## 🔄 Continuous Deployment

### 1. GitHub Webhook (Optional)
```bash
# Install webhook handler
npm install -g webhook-handler

# Create webhook script
nano /var/www/ninetails.site/webhook.js
```

### 2. Webhook Script
```javascript
const http = require('http');
const createHandler = require('webhook-handler');
const { exec } = require('child_process');

const handler = createHandler({ path: '/webhook', secret: 'your-webhook-secret' });

http.createServer((req, res) => {
  handler(req, res, () => {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777);

handler.on('push', () => {
  console.log('Received push event');
  exec('/var/www/ninetails.site/deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});
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

## 🔍 Troubleshooting

### Common Issues:

1. **Port 5000 not accessible**: Check firewall settings
2. **Database connection failed**: Verify MySQL credentials
3. **Build fails**: Check Node.js version and dependencies
4. **SSL issues**: Verify domain DNS settings
5. **PM2 not starting**: Check logs and environment variables

### Prisma Permission Issues:

If you get "Permission denied" when running Prisma commands:

```bash
# Fix file permissions
chown -R root:root /var/www/ninetails.site
chmod -R 755 /var/www/ninetails.site

# Reinstall Prisma CLI globally
npm uninstall -g prisma
npm install -g prisma

# Or use npx with explicit path
cd /var/www/ninetails.site/backend
npx --yes prisma migrate deploy
npx --yes prisma generate
npx --yes prisma db seed

# Alternative: Install Prisma locally in backend
cd /var/www/ninetails.site/backend
npm install prisma @prisma/client
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
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
ls -la /var/www/ninetails.site/backend/
```

## 📞 Support

If you encounter issues:
1. Check all logs for errors
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings
5. Verify domain DNS configuration

---

**Your site will be live at: https://ninetails.site/ 🎉**
