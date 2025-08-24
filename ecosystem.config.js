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
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
