# DHL Shipping Backend API

A modern, secure authentication backend built with Express.js, Prisma ORM, and MySQL.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Password Management**: Secure password hashing, reset functionality
- **User Profiles**: Complete user profile management
- **Referral System**: Built-in referral code system
- **Role-based Access**: Admin, moderator, and user roles
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: Prisma ORM with MySQL
- **Type Safety**: Full TypeScript support with Prisma

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dhlshipping/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/dhlshipping_db"
   JWT_SECRET="your_super_secret_jwt_key_here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### Admin (Protected)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/admin/users` | Get all users | Yes (Admin) |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### User Model
- `id`: Primary key
- `username`: Unique username
- `email`: Optional unique email
- `passwordHash`: Hashed password
- `firstName`, `lastName`: User names
- `phone`: Phone number
- `referralCode`: Unique referral code
- `referredBy`: Referral code used during registration
- `isActive`: Account status
- `isVerified`: Email verification status
- `role`: User role (USER, ADMIN, MODERATOR)
- `createdAt`, `updatedAt`: Timestamps

### UserSession Model
- Manages JWT tokens and sessions
- Automatic cleanup of expired tokens

### PasswordResetToken Model
- Handles password reset functionality
- Time-limited tokens

### UserProfile Model
- Extended user information
- Address, city, state, country, etc.

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for all inputs
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## 🧪 Testing

### Sample Users (Created by seed)

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: `ADMIN`

**Regular User:**
- Username: `user`
- Password: `user123`
- Role: `USER`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration | 24h |
| `FRONTEND_URL` | CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 🚀 Deployment

1. **Production Environment**
   ```bash
   NODE_ENV=production npm start
   ```

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js           # Database seeding
├── lib/
│   └── prisma.js         # Prisma client configuration
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── validation.js     # Input validation
├── controllers/
│   └── authController.js # Authentication logic
├── routes/
│   └── auth.js           # API routes
├── utils/
│   └── auth.js           # Authentication utilities
├── server.js             # Express server
├── package.json          # Dependencies
└── README.md            # This file
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with initial data |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the repository or contact the development team.
