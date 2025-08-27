# Environment Setup Guide

## Overview
This guide explains how to configure environment variables for both frontend and backend to avoid hardcoded URLs.

## Frontend Environment Configuration

### 1. Environment Files

#### Development (`env.development`)
```bash
# Development Environment Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_APP_NAME=DHL Shipping
REACT_APP_VERSION=1.0.0
```

#### Production (`env.production`)
```bash
# Production Environment Configuration
REACT_APP_API_URL=https://ninetails.site/api
REACT_APP_BASE_URL=https://ninetails.site
REACT_APP_ENV=production
REACT_APP_APP_NAME=DHL Shipping
REACT_APP_VERSION=1.0.0
```

### 2. Configuration Files

#### `src/config/config.ts`
```typescript
export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  BASE_URL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000',
  APP_NAME: process.env.REACT_APP_APP_NAME || 'DHL Shipping',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  ENV: process.env.REACT_APP_ENV || 'development'
};
```

#### `src/config/environment.ts`
```typescript
import { config } from './config';

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
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = env.BASE_URL;
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${cleanPath}`;
};
```

## Backend Environment Configuration

### 1. Environment Files

#### Development (`backend/env.development`)
```bash
# Development Environment Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="file:./dev.db"

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
```

#### Production (`backend/env.production`)
```bash
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="file:./prod.db"

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
```

## API Service Updates

### 1. Centralized API Service (`src/services/api.ts`)

All API calls now use the centralized service with environment-based URLs:

```typescript
class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // ... implementation
  }
}
```

### 2. Added Methods

- `getUsers(params)` - Get users with pagination and search
- `getUser(id)` - Get specific user
- `updateUser(id, userData)` - Update user
- `deleteUser(id)` - Delete user
- `updateUserBalance(userId, amount)` - Update user balance
- `getProfile()` - Get user profile
- `getReviews(params)` - Get reviews with filters
- `approveReview(id, isApproved)` - Approve/reject review
- `deleteReview(id)` - Delete review

## Files Updated

### Frontend Files
1. `src/config/config.ts` - Updated to use environment variables
2. `src/config/environment.ts` - Updated to use centralized config
3. `src/services/api.ts` - Added new methods and centralized URL handling
4. `src/pages/UserManagementPage.tsx` - Replaced hardcoded URLs with API service
5. `src/pages/ReviewManagementPage.tsx` - Replaced hardcoded URLs with API service
6. `src/components/ui/UserProfile.tsx` - Replaced hardcoded URLs with API service

### Backend Files
1. `backend/controllers/uploadController.js` - Already using environment variables
2. `backend/env.development` - Development environment configuration
3. `backend/env.production` - Production environment configuration

## Deployment Instructions

### 1. Frontend Deployment
```bash
# Copy appropriate environment file
cp env.production .env

# Build for production
npm run build
```

### 2. Backend Deployment
```bash
# Copy appropriate environment file
cp env.production .env

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Start server
npm start
```

### 3. Environment Variable Setup
Make sure to set the following environment variables in your deployment platform:

#### Frontend (Netlify/Vercel)
- `REACT_APP_API_URL`
- `REACT_APP_BASE_URL`
- `REACT_APP_ENV`

#### Backend (Vultr/VPS)
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `API_BASE_URL`

## Benefits

1. **Environment Flexibility**: Easy switching between development and production
2. **Security**: No hardcoded URLs in source code
3. **Maintainability**: Centralized configuration management
4. **Scalability**: Easy to add new environments (staging, testing, etc.)
5. **Consistency**: All API calls use the same base URL configuration

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Ensure environment files are in the correct location
   - Check that variable names start with `REACT_APP_` for frontend
   - Restart the development server after changes

2. **API calls failing**
   - Verify the `API_BASE_URL` is correct for your environment
   - Check CORS configuration in backend
   - Ensure backend server is running

3. **Image URLs not working**
   - Verify `BASE_URL` configuration
   - Check that image paths are correct
   - Ensure backend serves static files correctly
