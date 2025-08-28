#!/bin/bash

echo "Restarting DHL Shipping Backend..."

# Navigate to the backend directory
cd /var/www/ninetails.site/backend

# Stop the current PM2 process
echo "Stopping current backend process..."
pm2 stop dhlshipping-backend

# Start the backend again
echo "Starting backend with new configuration..."
pm2 start server.js --name dhlshipping-backend

# Check the status
echo "Checking PM2 status..."
pm2 status

# Show recent logs
echo "Recent logs:"
pm2 logs dhlshipping-backend --lines 10

echo "Backend restart completed!"
