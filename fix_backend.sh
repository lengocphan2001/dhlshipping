#!/bin/bash

echo "🔧 Fixing Backend Server Not Running"
echo "===================================="

echo ""
echo "1. Checking current PM2 status..."
pm2 status

echo ""
echo "2. Stopping any existing processes..."
pm2 stop all
pm2 delete all

echo ""
echo "3. Checking if backend directory exists..."
if [ -d "/var/www/ninetails.site/backend" ]; then
    echo "✅ Backend directory exists"
    cd /var/www/ninetails.site/backend
else
    echo "❌ Backend directory missing"
    exit 1
fi

echo ""
echo "4. Checking if .env file exists..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file missing - creating one..."
    cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://dhlshipping_user:your_secure_password@localhost:3306/dhlshipping"
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://ninetails.site
EOF
    echo "⚠️  Please update the .env file with your actual database password and JWT secret"
fi

echo ""
echo "5. Installing dependencies..."
npm install

echo ""
echo "6. Running Prisma setup..."
npx prisma generate

echo ""
echo "7. Starting backend with PM2..."
cd /var/www/ninetails.site
pm2 start ecosystem.config.js

echo ""
echo "8. Checking PM2 status..."
pm2 status

echo ""
echo "9. Testing backend connection..."
sleep 3
curl -s http://localhost:5000 && echo "✅ Backend is now running!" || echo "❌ Backend still not responding"

echo ""
echo "10. Checking PM2 logs..."
pm2 logs dhlshipping-backend --lines 10

echo ""
echo "===================================="
echo "🔧 If backend is still not working:"
echo "1. Check the logs above for errors"
echo "2. Verify your .env file has correct database credentials"
echo "3. Run: pm2 logs dhlshipping-backend"
echo "4. Try manual start: cd /var/www/ninetails.site/backend && node server.js"
