export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'DHL Shipping',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENV: process.env.REACT_APP_ENV || 'development'
};
