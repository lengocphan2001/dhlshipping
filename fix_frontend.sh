#!/bin/bash

echo "🔧 Fixing Frontend Deployment Issue"
echo "==================================="

echo ""
echo "1. Checking current package.json homepage setting..."
grep "homepage" /var/www/ninetails.site/package.json

echo ""
echo "2. Removing old build directory..."
rm -rf /var/www/ninetails.site/build

echo ""
echo "3. Installing frontend dependencies..."
cd /var/www/ninetails.site
npm install

echo ""
echo "4. Building frontend with correct settings..."
npm run build

echo ""
echo "5. Checking new build directory structure..."
ls -la /var/www/ninetails.site/build/
echo ""
echo "Static files:"
ls -la /var/www/ninetails.site/build/static/

echo ""
echo "6. Fixing file permissions..."
sudo chown -R www-data:www-data /var/www/ninetails.site/build
sudo chmod -R 755 /var/www/ninetails.site/build

echo ""
echo "7. Reloading Nginx..."
systemctl reload nginx

echo ""
echo "8. Testing frontend access..."
curl -I http://localhost 2>/dev/null | head -3

echo ""
echo "==================================="
echo "✅ Frontend should now be working!"
echo "🌐 Visit: https://ninetails.site"
echo ""
echo "If still not working, check:"
echo "1. Nginx error logs: tail -f /var/log/nginx/error.log"
echo "2. Nginx config: cat /etc/nginx/sites-available/ninetails.site"
