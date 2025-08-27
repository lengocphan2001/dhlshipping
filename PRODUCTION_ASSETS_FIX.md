# Production Assets Fix Guide

## Issues Fixed

### 1. Favicon.ico 404 Error
**Problem**: `GET https://ninetails.site/admin/favicon.ico 404 (Not Found)`

**Root Cause**: The favicon was using `%PUBLIC_URL%` which doesn't work correctly in production with React Router.

**Solution**: 
- Updated `public/index.html` to use absolute paths (`/favicon.ico` instead of `%PUBLIC_URL%/favicon.ico`)
- Updated `public/manifest.json` to use absolute paths
- Updated app title to "DHL Shipping"

### 2. Product Images 404 Error
**Problem**: `GET https://ninetails.site/images/products/product-1756338213737-371002293.png 404 (Not Found)`

**Root Cause**: 
1. Nginx configuration was missing a location block for `/images` to proxy to the backend
2. Frontend `getImageUrl` function wasn't correctly constructing the image URLs

**Solution**:
1. **Nginx Configuration**: Added `/images` location block to proxy to backend
2. **Frontend Configuration**: Updated `getImageUrl` function in `src/config/environment.ts`

## Files Modified

### Frontend Files
1. **`public/index.html`**
   - Changed favicon path from `%PUBLIC_URL%/favicon.ico` to `/favicon.ico`
   - Changed manifest path from `%PUBLIC_URL%/manifest.json` to `/manifest.json`
   - Updated app title to "DHL Shipping"
   - Updated meta description

2. **`public/manifest.json`**
   - Updated all asset paths to use absolute paths
   - Updated app name and short name

3. **`src/config/environment.ts`**
   - Fixed `getImageUrl` function to properly construct image URLs
   - Added logic to ensure product images use `/images` path

### Backend Files
1. **`nginx.conf`**
   - Added `/images` location block to proxy image requests to backend
   - Added proper caching headers for images

## Deployment Steps

### 1. Update Frontend
```bash
cd /var/www/ninetails.site
rm -rf build
npm install
npm run build
sudo chown -R www-data:www-data build
sudo chmod -R 755 build
```

### 2. Update Nginx Configuration
```bash
# Copy the updated nginx.conf to the server
sudo cp nginx.conf /etc/nginx/sites-available/ninetails.site
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Verify Backend is Running
```bash
sudo systemctl status dhlshipping-backend
# If not running:
sudo systemctl start dhlshipping-backend
```

### 4. Test the Fixes
```bash
# Test favicon
curl -I https://ninetails.site/favicon.ico

# Test product images
curl -I https://ninetails.site/images/products/product-1756337530193-485935763.png

# Test backend directly
curl -I http://localhost:5000/images/products/product-1756337530193-485935763.png
```

## Troubleshooting

### If Images Still Don't Work

1. **Check Backend Status**:
   ```bash
   sudo systemctl status dhlshipping-backend
   journalctl -u dhlshipping-backend -f
   ```

2. **Check Nginx Configuration**:
   ```bash
   sudo nginx -t
   sudo cat /etc/nginx/sites-available/ninetails.site
   ```

3. **Check Nginx Logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

4. **Verify Image Files Exist**:
   ```bash
   ls -la /var/www/ninetails.site/backend/public/images/products/
   ```

5. **Test Backend Directly**:
   ```bash
   curl -I http://localhost:5000/images/products/product-1756337530193-485935763.png
   ```

### If Favicon Still Doesn't Work

1. **Check Build Output**:
   ```bash
   ls -la /var/www/ninetails.site/build/
   ls -la /var/www/ninetails.site/build/favicon.ico
   ```

2. **Check File Permissions**:
   ```bash
   sudo chown -R www-data:www-data /var/www/ninetails.site/build
   sudo chmod -R 755 /var/www/ninetails.site/build
   ```

## Expected Results

After applying these fixes:

1. ✅ Favicon should load correctly at `https://ninetails.site/favicon.ico`
2. ✅ Product images should load correctly at `https://ninetails.site/images/products/[filename]`
3. ✅ No more 404 errors in browser console
4. ✅ Images should display properly in the admin panel and product pages

## Quick Fix Script

Run the provided `fix_production_assets.sh` script on your production server:

```bash
chmod +x fix_production_assets.sh
./fix_production_assets.sh
```

This script will automatically:
- Rebuild the frontend with updated configurations
- Fix file permissions
- Test the endpoints
- Reload Nginx
