import { config } from './config';

// Environment Configuration
interface EnvironmentConfig {
  API_BASE_URL: string;
  BASE_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = config.ENV === 'development';
  const isProduction = config.ENV === 'production';

  return {
    API_BASE_URL: config.API_BASE_URL,
    BASE_URL: config.BASE_URL,
    NODE_ENV: config.ENV,
    IS_DEVELOPMENT: isDevelopment,
    IS_PRODUCTION: isProduction
  };
};

export const env = getEnvironmentConfig();

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = env.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Helper function to get image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // For relative paths, construct the full URL
  // Images are served from the backend at /images path
  const baseUrl = env.API_BASE_URL.replace('/api', '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Ensure the path starts with /images if it's a product image
  if (cleanPath.includes('products/') && !cleanPath.startsWith('/images/')) {
    return `${baseUrl}/images${cleanPath}`;
  }
  
  return `${baseUrl}${cleanPath}`;
};
