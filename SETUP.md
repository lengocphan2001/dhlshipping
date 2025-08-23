# DHL Shipping - Setup Guide

This guide will help you set up and run both the frontend and backend of the DHL Shipping application.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp env.example .env
```

Edit the `.env` file with your MySQL credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/dhlshipping_db"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 5. Start the backend server
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to the root directory
```bash
cd ..
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the frontend development server
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## Testing the Application

### Sample Users (Created by backend seed)

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

**Regular User:**
- Username: `user`
- Password: `user123`
- Role: `USER`

### Features to Test

1. **Registration**: Go to the registration page and create a new account
2. **Login**: Use the sample users or your newly created account to log in
3. **User Profile**: After logging in, view your profile information
4. **Logout**: Test the logout functionality

## API Endpoints

The backend provides the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

## Troubleshooting

### Backend Issues

1. **Database Connection Error**: Make sure MySQL is running and the credentials in `.env` are correct
2. **Port Already in Use**: Change the PORT in `.env` or kill the process using port 5000
3. **Prisma Issues**: Run `npm run db:generate` to regenerate the Prisma client

### Frontend Issues

1. **API Connection Error**: Make sure the backend is running on port 5000
2. **CORS Issues**: The backend is configured to allow requests from `http://localhost:3000`

### Common Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Frontend
npm start            # Start development server
npm run build        # Build for production
```

## Development

### Backend Development
- The backend uses Prisma ORM for database operations
- JWT tokens for authentication
- Express.js with middleware for security
- Automatic API documentation available at `http://localhost:5000`

### Frontend Development
- React with TypeScript
- Bootstrap for styling
- Context API for state management
- Responsive design for mobile and desktop

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend `.env`
2. Build the frontend: `npm run build`
3. Configure your production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data

## Support

If you encounter any issues, please check:
1. All prerequisites are installed
2. Database is running and accessible
3. Environment variables are correctly set
4. Both frontend and backend are running on the correct ports
