#!/bin/bash

echo "🔧 Fixing Production Asset Issues"
echo "================================="

echo ""
echo "1. Checking current frontend build..."
cd /var/www/ninetails.site

echo ""
echo "2. Removing old build directory..."
rm -rf build

echo ""
echo "3. Installing frontend dependencies..."
npm install

echo ""
echo "4. Building frontend with updated configurations..."
npm run build

echo ""
echo "5. Checking favicon and assets in build..."
ls -la build/
echo ""
echo "Favicon check:"
ls -la build/favicon.ico

echo ""
echo "6. Fixing file permissions..."
sudo chown -R www-data:www-data build
sudo chmod -R 755 build

echo ""
echo "7. Testing image access..."
echo "Testing backend image endpoint:"
curl -I http://localhost:5000/images/products/product-1756337530193-485935763.png 2>/dev/null | head -3

echo ""
echo "8. Reloading Nginx..."
systemctl reload nginx

echo ""
echo "9. Testing frontend access..."
curl -I http://localhost 2>/dev/null | head -3

echo ""
echo "================================="
echo "✅ Production assets should now be working!"
echo "🌐 Visit: https://ninetails.site"
echo ""
echo "If images still don't work, check:"
echo "1. Backend is running: systemctl status dhlshipping-backend"
echo "2. Nginx config: cat /etc/nginx/sites-available/ninetails.site"
echo "3. Backend logs: journalctl -u dhlshipping-backend -f"
echo "4. Nginx logs: tail -f /var/log/nginx/error.log"
