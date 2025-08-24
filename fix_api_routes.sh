#!/bin/bash

echo "🔧 Fixing API Routes Configuration"
echo "=================================="

echo ""
echo "1. Testing different endpoints..."
echo "Testing root endpoint:"
curl -s http://localhost:5000

echo ""
echo "Testing /api endpoint:"
curl -s http://localhost:5000/api

echo ""
echo "Testing /api/auth endpoint:"
curl -s http://localhost:5000/api/auth

echo ""
echo "2. Checking backend server.js file..."
if [ -f "/var/www/ninetails.site/backend/server.js" ]; then
    echo "✅ server.js exists"
    echo "Checking if routes are properly mounted..."
    grep -n "app.use.*api" /var/www/ninetails.site/backend/server.js || echo "❌ API routes not found in server.js"
else
    echo "❌ server.js missing"
fi

echo ""
echo "3. Checking if routes directory exists..."
if [ -d "/var/www/ninetails.site/backend/routes" ]; then
    echo "✅ routes directory exists"
    ls -la /var/www/ninetails.site/backend/routes/
else
    echo "❌ routes directory missing"
fi

echo ""
echo "4. Checking if auth.js route file exists..."
if [ -f "/var/www/ninetails.site/backend/routes/auth.js" ]; then
    echo "✅ auth.js exists"
else
    echo "❌ auth.js missing"
fi

echo ""
echo "5. Checking backend package.json..."
if [ -f "/var/www/ninetails.site/backend/package.json" ]; then
    echo "✅ package.json exists"
    echo "Main script: $(grep '"main"' /var/www/ninetails.site/backend/package.json)"
else
    echo "❌ package.json missing"
fi

echo ""
echo "6. Checking PM2 logs for errors..."
pm2 logs dhlshipping-backend --lines 20

echo ""
echo "=================================="
echo "🔧 Common fixes:"
echo "1. Restart backend: pm2 restart dhlshipping-backend"
echo "2. Check server.js has: app.use('/api', authRoutes)"
echo "3. Verify all route files exist in /backend/routes/"
echo "4. Check if all dependencies are installed"
