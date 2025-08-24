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
