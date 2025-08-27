const fs = require('fs');
const path = require('path');

// Environment setup script
const setupEnvironment = () => {
  const env = process.argv[2] || 'development';
  
  console.log(`Setting up environment for: ${env}`);
  
  let envContent = '';
  
  if (env === 'development') {
    envContent = `# Development Environment Configuration
NODE_ENV=development
PORT=5000

# Database - MySQL for development
DATABASE_URL="mysql://root:@localhost:3306/dhlshipping_dev"

# JWT
JWT_SECRET=your_jwt_secret_key_here_development
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# API Configuration
API_BASE_URL=http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/images/products
`;
  } else if (env === 'production') {
    envContent = `# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database - MySQL for production
DATABASE_URL="mysql://root:@localhost:3306/dhlshipping_prod"

# JWT
JWT_SECRET=your_jwt_secret_key_here_production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://ninetails.site

# API Configuration
API_BASE_URL=https://ninetails.site

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/images/products
`;
  }
  
  // Write .env file
  const envPath = path.join(__dirname, '..', '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`✅ Environment file created: ${envPath}`);
  console.log(`📝 Environment: ${env}`);
  console.log(`🌐 API Base URL: ${env === 'development' ? 'http://localhost:5000' : 'https://ninetails.site'}`);
  console.log(`🗄️ Database: MySQL (${env === 'development' ? 'dhlshipping_dev' : 'dhlshipping_prod'})`);
  console.log(`⚠️ Please ensure MySQL is running and create the database if it doesn't exist!`);
  console.log(`💡 Run: CREATE DATABASE IF NOT EXISTS ${env === 'development' ? 'dhlshipping_dev' : 'dhlshipping_prod'};`);
};

setupEnvironment();
