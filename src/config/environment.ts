// Environment Configuration
interface EnvironmentConfig {
  API_BASE_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Development configuration
  if (isDevelopment) {
    return {
      API_BASE_URL: 'http://localhost:5000/api',
      NODE_ENV: 'development',
      IS_DEVELOPMENT: true,
      IS_PRODUCTION: false
    };
  }

  // Production configuration
  if (isProduction) {
    return {
      API_BASE_URL: 'https://ninetails.site/api',
      NODE_ENV: 'production',
      IS_DEVELOPMENT: false,
      IS_PRODUCTION: true
    };
  }

  // Default to development
  return {
    API_BASE_URL: 'http://localhost:5000/api',
    NODE_ENV: 'development',
    IS_DEVELOPMENT: true,
    IS_PRODUCTION: false
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
  const baseUrl = env.IS_DEVELOPMENT ? 'http://localhost:5000' : 'https://ninetails.site';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
