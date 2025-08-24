#!/bin/bash

echo "🔍 Diagnosing 502 Bad Gateway Error for ninetails.site"
echo "=================================================="

echo ""
echo "1. Checking PM2 Status..."
pm2 status

echo ""
echo "2. Checking if port 5000 is listening..."
netstat -tlnp | grep :5000

echo ""
echo "3. Checking PM2 logs (last 20 lines)..."
pm2 logs dhlshipping-backend --lines 20

echo ""
echo "4. Testing local backend connection..."
curl -s http://localhost:5000 || echo "❌ Backend not responding locally"

echo ""
echo "5. Checking Nginx error logs (last 10 lines)..."
tail -10 /var/log/nginx/error.log

echo ""
echo "6. Checking if .env file exists..."
if [ -f "/var/www/ninetails.site/backend/.env" ]; then
    echo "✅ .env file exists"
    echo "DATABASE_URL: $(grep DATABASE_URL /var/www/ninetails.site/backend/.env | cut -d'=' -f2 | cut -d'"' -f2)"
else
    echo "❌ .env file missing"
fi

echo ""
echo "7. Testing database connection..."
mysql -u dhlshipping_user -p -e "SELECT 1;" 2>/dev/null && echo "✅ Database connection OK" || echo "❌ Database connection failed"

echo ""
echo "8. Checking file permissions..."
ls -la /var/www/ninetails.site/backend/ | head -5

echo ""
echo "9. Checking Node.js version..."
node --version

echo ""
echo "10. Checking if backend dependencies are installed..."
if [ -d "/var/www/ninetails.site/backend/node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing"
fi

echo ""
echo "=================================================="
echo "🔧 Quick Fix Commands:"
echo "pm2 restart dhlshipping-backend"
echo "systemctl reload nginx"
echo "cd /var/www/ninetails.site/backend && node server.js"
