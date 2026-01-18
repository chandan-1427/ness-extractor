# Backend API - Financial Statement Management System

A modern, type-safe Express.js backend for managing user authentication and financial statement extraction/processing. Built with TypeScript, MongoDB, and JWT-based authentication.

## 🚀 Features

- **User Authentication**: Secure registration, login, and logout with JWT tokens
- **Refresh Token System**: Long-lived session management with token revocation
- **Statement Extraction**: Intelligent parsing of financial statement text into structured data
- **Cursor-Based Pagination**: Efficient pagination for large datasets with temporal sorting
- **Type Safety**: Full TypeScript support with strict type checking
- **Security**: Password hashing with bcrypt, CORS, Helmet security headers
- **Error Handling**: Global error middleware with custom error classes
- **Input Validation**: Zod schema validation for all API endpoints
- **Logging**: Morgan HTTP request logging in development mode

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Key Services](#key-services)
- [Middleware](#middleware)

## 🛠 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express** | 5.2.1 | Web framework |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 9.1.3 | ODM for MongoDB |
| **JWT** | 9.0.3 | Token-based authentication |
| **Bcrypt** | 6.0.0 | Password hashing |
| **Zod** | 4.3.5 | Schema validation |
| **Helmet** | 8.1.0 | Security headers |
| **CORS** | 2.8.5 | Cross-origin requests |

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                          # Express app setup & middleware config
│   ├── index.ts                        # Entry point
│   ├── config/
│   │   ├── db.ts                       # MongoDB connection
│   │   ├── env.ts                      # Environment validation
│   │   └── index.ts                    # Config exports
│   ├── controllers/
│   │   ├── auth.controller.ts          # Auth endpoints logic
│   │   └── statement.controller.ts     # Statement endpoints logic
│   ├── middlewares/
│   │   ├── authenticate.middleware.ts  # JWT verification
│   │   ├── error.middleware.ts         # Global error handler
│   │   ├── validate.middleware.ts      # Zod validation
│   │   └── types/
│   │       └── auth.ts                 # Auth types
│   ├── models/
│   │   ├── user.model.ts               # User schema
│   │   ├── refresh-token.model.ts      # Refresh token schema
│   │   ├── statement.model.ts          # Financial statement schema
│   │   └── types/
│   │       ├── user.ts                 # User interfaces
│   │       └── refresh-token.ts        # RefreshToken interfaces
│   ├── routes/
│   │   ├── health.route.ts             # Health check endpoint
│   │   ├── auth.routes.ts              # Auth endpoints
│   │   ├── user.routes.ts              # User endpoints
│   │   ├── statement.route.ts          # Statement endpoints
│   │   └── secure.route.ts             # Protected routes wrapper
│   ├── schemas/
│   │   ├── auth.schema.ts              # Auth validation schemas
│   │   └── statement.schema.ts         # Statement validation schemas
│   ├── services/
│   │   ├── auth.service.ts             # Auth business logic
│   │   ├── statement-extract.service.ts # Statement parsing logic
│   │   └── statement-cursor.service.ts  # Pagination service
│   ├── types/
│   │   ├── express.d.ts                # Express type augmentation
│   │   └── statement.ts                # Statement interfaces
│   └── utils/
│       ├── appError.ts                 # Custom error class
│       ├── catchAsync.ts               # Async error wrapper
│       ├── crypto.ts                   # Token & hash utilities
│       ├── cursor.ts                   # Pagination cursor encoding
│       └── jwt.ts                      # JWT operations
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```

## ⚙️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud instance)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Setup](#environment-setup))

4. **Build TypeScript**
   ```bash
   npm run build
   ```

## 🔧 Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long

# CORS
CLIENT_URL=http://localhost:3000
```

### Environment Variables Explained

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | 5000 | Server port |
| `NODE_ENV` | string | development | Environment (development/production) |
| `DATABASE_URL` | string | - | MongoDB connection string (required) |
| `JWT_SECRET` | string | - | Secret for signing JWTs, min 32 chars (required) |
| `CLIENT_URL` | string | - | Frontend URL for CORS (required) |

## ▶️ Running the Application

### Development
```bash
npm run dev
```
Runs with nodemon for automatic restart on file changes.

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run typecheck
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints (`/auth`)

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "_id": "user-id",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2026-01-18T10:30:00Z"
}
```

**Errors:**
- `409 Conflict`: Email or username already taken
- `400 Bad Request`: Invalid input format

---

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "random-token-string"
}
```

**Errors:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Invalid input format

---

#### 3. Logout User
```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "random-token-string"
}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Errors:**
- `404 Not Found`: Token invalid or already revoked
- `400 Bad Request`: Refresh token missing

---

### Protected Endpoints (Requires Authorization Header)

```http
Authorization: Bearer <accessToken>
```

#### 4. Get Current User Info
```http
GET /user/me
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "userId": "user-id",
  "message": "Authenticated user"
}
```

**Errors:**
- `401 Unauthorized`: Missing or invalid token

---

#### 5. Extract & Create Statement
```http
POST /secure/statements/extract
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "text": "UPI Transfer to John Doe Amount: 500 INR Debited on 2026-01-18"
}
```

**Response (201):**
```json
{
  "_id": "statement-id",
  "userId": "user-id",
  "amount": 500,
  "currency": "INR",
  "type": "debit",
  "date": "2026-01-18T00:00:00Z",
  "description": "UPI Transfer to John Doe",
  "rawText": "UPI Transfer to John Doe Amount: 500 INR Debited on 2026-01-18",
  "createdAt": "2026-01-18T10:35:00Z"
}
```

**Errors:**
- `400 Bad Request`: Invalid input (text < 10 characters)
- `401 Unauthorized`: Invalid or missing token

---

#### 6. List Statements with Pagination
```http
GET /secure/statements/fetch?limit=10&cursor=optional-cursor&type=debit&fromDate=2026-01-01&toDate=2026-01-31&minAmount=100&maxAmount=5000
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "statement-id-1",
      "userId": "user-id",
      "amount": 500,
      "currency": "INR",
      "type": "debit",
      "date": "2026-01-18T10:00:00Z",
      "description": "UPI Transfer",
      "createdAt": "2026-01-18T10:35:00Z"
    }
  ],
  "nextCursor": "base64-encoded-cursor-or-null"
}
```

**Query Parameters:**
- `limit` (number, 1-50, default 10): Results per page
- `cursor` (string, optional): Pagination cursor from previous request
- `type` (string, optional): Filter by 'debit' or 'credit'
- `fromDate` (ISO string, optional): Filter from date
- `toDate` (ISO string, optional): Filter to date
- `minAmount` (number, optional): Minimum amount filter
- `maxAmount` (number, optional): Maximum amount filter

**Errors:**
- `401 Unauthorized`: Invalid or missing token

---

#### 7. Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok"
}
```

## 📊 Database Models

### User Model
```typescript
interface IUser extends Document {
  email: string;                    // Unique, indexed
  username: string;                // Unique, indexed
  passwordHash: string;             // Bcrypt hashed
  createdAt: Date;
}
```

### Refresh Token Model
```typescript
interface IRefreshToken extends Document {
  userId: ObjectId;                 // Reference to User
  tokenHash: string;                // Hash of the refresh token
  expiresAt: Date;                  // Expiration (7 days)
  revokedAt?: Date;                 // Null until revoked
  ipAddress?: string;               // For audit trail
  userAgent?: string;               // For audit trail
}
```

### Statement Model
```typescript
interface IStatement extends Document {
  userId: ObjectId;                 // Reference to User, indexed
  amount: number;
  balance?: number;                 // Optional closing balance
  currency: string;                 // Default: 'INR'
  type: 'debit' | 'credit';
  date: Date;                       // Transaction date, indexed
  description: string;              // Human-readable description
  rawText: string;                  // Original input text
  createdAt: Date;                  // Record creation time
}
```

**Indexes:**
- `{ userId, date: -1 }`
- `{ userId, createdAt: -1, _id: -1 }`
- `{ userId, type }`

## 🎯 Key Services

### Authentication Service (`auth.service.ts`)
- **registerUser()**: Creates new user with password hashing
- **loginUser()**: Authenticates user and generates tokens
- **logoutUser()**: Revokes refresh token for logout

### Statement Extraction Service (`statement-extract.service.ts`)
Parses financial statement text with intelligent extraction:
- Detects transaction type (debit/credit) with scoring algorithm
- Extracts amounts handling various formats (1,234.50, 1234, etc.)
- Parses dates in multiple formats
- Filters noise (OTP, Reference IDs, etc.)
- Returns structured `ExtractedStatement` object

### Statement Cursor Service (`statement-cursor.service.ts`)
Provides cursor-based pagination:
- Efficient temporal pagination with ObjectId
- Handles complex filters (type, date range, amount range)
- Prevents duplicate records with `$or` logic
- Generates next cursor for client

## 🛡️ Middleware

| Middleware | Purpose | Location |
|-----------|---------|----------|
| `express.json()` | Parse JSON bodies | Global |
| `morgan()` | HTTP request logging | Global (dev only) |
| `helmet()` | Security headers | Global |
| `cors()` | Cross-origin requests | Global |
| `authenticateUser()` | JWT verification | Protected routes |
| `validate()` | Zod schema validation | Route-specific |
| `errorHandler()` | Global error handler | Last middleware |

## 🔐 Security Features

✅ Password hashing with bcrypt (salt rounds: 12)  
✅ JWT-based stateless authentication  
✅ Refresh token rotation and revocation  
✅ CORS restricted to CLIENT_URL  
✅ Helmet security headers enabled  
✅ Input validation with Zod schemas  
✅ Type-safe Express integration  
✅ Secure error messages (no sensitive data leaks)  

## 📝 Error Handling

The application uses a custom `AppError` class for consistent error responses:

```json
{
  "status": "error",
  "message": "User-friendly error message",
  "statusCode": 400
}
```

## 🚦 Development Workflow

1. **Write/modify code** in `src/`
2. **Nodemon auto-compiles** TypeScript
3. **Check types** with `npm run typecheck`
4. **Test endpoints** with Postman/Thunder Client
5. **Build production** with `npm run build`
6. **Deploy** `dist/` folder

## 📦 Dependencies Overview

- **express**: HTTP server framework
- **mongoose**: MongoDB ODM with schema validation
- **jsonwebtoken**: JWT creation and verification
- **bcrypt**: Password hashing
- **zod**: Runtime type validation
- **helmet**: Security middleware
- **cors**: CORS handling
- **morgan**: HTTP request logging
- **dotenv**: Environment variable management

## 🐛 Common Issues

### MongoDB Connection Failed
- Verify `DATABASE_URL` in `.env`
- Check MongoDB is running
- Ensure IP whitelist includes your connection IP

### JWT Secret Too Short
- `JWT_SECRET` must be at least 32 characters
- Use a strong random string (use password generator)

### CORS Errors
- Ensure `CLIENT_URL` in `.env` matches your frontend origin
- Include trailing `/` if needed

## 📞 Support

For issues or questions:
1. Check environment variables are set correctly
2. Verify MongoDB connection
3. Review error logs in console
4. Check API response status codes

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**License**: ISC
