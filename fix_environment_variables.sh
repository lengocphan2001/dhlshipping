#!/bin/bash

# Fix Environment Variables Script
# This script will fix the environment variable configuration for production

echo "🔧 Fixing Environment Variables for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[HEADER]${NC} $1"
}

print_header "=== STEP 1: FIXING ENVIRONMENT FILES ==="

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Create proper .env files with dot prefix
print_status "Creating proper .env files..."

# Create .env.production
if [ -f "env.production" ]; then
    print_status "Creating .env.production from env.production..."
    cp env.production .env.production
    print_status "✅ .env.production created"
else
    print_status "Creating .env.production with production settings..."
    cat > .env.production << 'EOF'
# Production Environment Configuration
REACT_APP_API_URL=https://ninetails.site/api
REACT_APP_BASE_URL=https://ninetails.site
REACT_APP_ENV=production
REACT_APP_APP_NAME=DHL Shipping
REACT_APP_VERSION=1.0.0
EOF
    print_status "✅ .env.production created"
fi

# Create .env.development
if [ -f "env.development" ]; then
    print_status "Creating .env.development from env.development..."
    cp env.development .env.development
    print_status "✅ .env.development created"
else
    print_status "Creating .env.development with development settings..."
    cat > .env.development << 'EOF'
# Development Environment Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_APP_NAME=DHL Shipping
REACT_APP_VERSION=1.0.0
EOF
    print_status "✅ .env.development created"
fi

# Create .env.local for local overrides
print_status "Creating .env.local for local overrides..."
cat > .env.local << 'EOF'
# Local Environment Overrides
# This file is for local development overrides
# It will override .env.development settings
EOF
print_status "✅ .env.local created"

print_header "=== STEP 2: VERIFYING ENVIRONMENT FILES ==="

# Check if files were created
if [ -f ".env.production" ]; then
    print_status "✅ .env.production exists"
    print_status "Production API URL: $(grep REACT_APP_API_URL .env.production)"
else
    print_error "❌ .env.production not created"
fi

if [ -f ".env.development" ]; then
    print_status "✅ .env.development exists"
    print_status "Development API URL: $(grep REACT_APP_API_URL .env.development)"
else
    print_error "❌ .env.development not created"
fi

print_header "=== STEP 3: BUILDING FOR PRODUCTION ==="

# Clean previous build
print_status "Cleaning previous build..."
rm -rf build
print_status "✅ Previous build cleaned"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_status "✅ Dependencies installed"
fi

# Build for production
print_status "Building for production..."
npm run build

if [ $? -eq 0 ]; then
    print_status "✅ Production build completed successfully"
else
    print_error "❌ Production build failed"
    exit 1
fi

print_header "=== STEP 4: VERIFYING BUILD ==="

# Check if build was successful
if [ -d "build" ] && [ -f "build/index.html" ]; then
    print_status "✅ Build directory created successfully"
    
    # Check if the build contains the correct API URL
    print_status "Checking API URL in build..."
    if grep -q "ninetails.site" build/static/js/*.js; then
        print_status "✅ Production API URL found in build"
    else
        print_warning "⚠️  Production API URL not found in build"
        print_status "This might indicate the environment variables weren't loaded properly"
    fi
else
    print_error "❌ Build directory not found or incomplete"
    exit 1
fi

print_header "=== STEP 5: DEPLOYMENT PREPARATION ==="

# Ask user if they want to deploy
echo ""
echo "❓ Do you want to deploy the build to the server? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    print_status "Preparing for deployment..."
    
    # Check if running as root (for server deployment)
    if [ "$EUID" -eq 0 ]; then
        # Create directory if it doesn't exist
        mkdir -p /var/www/ninetails.site
        
        # Copy build files
        cp -r build/* /var/www/ninetails.site/build/
        
        # Set proper permissions
        chown -R www-data:www-data /var/www/ninetails.site
        chmod -R 755 /var/www/ninetails.site
        
        print_status "✅ Frontend deployed to /var/www/ninetails.site/build/"
        
        # Test nginx configuration
        print_status "Testing nginx configuration..."
        if nginx -t; then
            print_status "✅ Nginx configuration is valid"
            
            # Reload nginx
            print_status "Reloading nginx..."
            systemctl reload nginx
            
            print_status "✅ Nginx reloaded successfully!"
        else
            print_error "❌ Nginx configuration has errors"
        fi
        
        # Test the website
        print_status "Testing website accessibility..."
        sleep 2
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://ninetails.site || echo "000")
        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
            print_status "✅ Website is accessible (HTTP Code: $HTTP_CODE)"
        else
            print_warning "⚠️  Website might not be accessible (HTTP Code: $HTTP_CODE)"
        fi
        
    else
        print_warning "⚠️  Not running as root. Manual deployment required."
        echo ""
        print_status "📋 Manual deployment steps:"
        echo "1. Copy build files to server:"
        echo "   scp -r build/* user@your-server:/var/www/ninetails.site/build/"
        echo ""
        echo "2. SSH to your server and run:"
        echo "   sudo chown -R www-data:www-data /var/www/ninetails.site"
        echo "   sudo chmod -R 755 /var/www/ninetails.site"
        echo "   sudo nginx -t"
        echo "   sudo systemctl reload nginx"
    fi
else
    print_status "Build completed. Deploy manually when ready."
fi

print_header "=== STEP 6: TROUBLESHOOTING ==="

echo ""
print_status "🔍 If you still see localhost endpoints, check:"
echo ""
echo "1. Environment Variables:"
echo "   - Check .env.production file exists"
echo "   - Verify REACT_APP_API_URL=https://ninetails.site/api"
echo "   - Ensure no .env.local overrides production settings"
echo ""
echo "2. Build Process:"
echo "   - Run: npm run build"
echo "   - Check build/static/js/*.js for API URLs"
echo "   - Clear browser cache after deployment"
echo ""
echo "3. Browser Cache:"
echo "   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)"
echo "   - Clear browser cache completely"
echo "   - Try incognito/private browsing mode"
echo ""
echo "4. Server Configuration:"
echo "   - Ensure nginx is serving the correct build files"
echo "   - Check nginx error logs: tail -f /var/log/nginx/error.log"
echo ""

print_status "🎉 Environment variables fix completed!"
print_status "📁 Production build is ready in the 'build' directory"
