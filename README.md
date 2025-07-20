# 🚀 Enterprise Auth System

Modern, scalable ve production-ready authentication sistemi. Node.js, Express.js, TypeScript ve Prisma ORM kullanılarak geliştirilmiştir.

## ✨ Özellikler

### 🔐 Authentication & Authorization
- ✅ JWT Access & Refresh Token sistemi
- ✅ Role-based access control (USER, ADMIN, MODERATOR)
- ✅ Bcrypt ile güvenli şifre hashleme
- ✅ Session yönetimi ve logout (all devices)

### 📧 Password & Email Management
- ✅ Password reset functionality
- ✅ Email verification system
- ✅ Forgot password workflow

### 👥 User Management
- ✅ User CRUD operations
- ✅ Role management (Admin only)
- ✅ User status toggle (active/inactive)
- ✅ Pagination support

### 📊 Audit Logging
- ✅ Comprehensive activity tracking
- ✅ User-specific activity logs
- ✅ System-wide audit logs (Admin)
- ✅ Sensitive data masking

### 🛡️ Security Features
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Global error handling

### 🏗️ Architecture
- ✅ Clean MVC architecture
- ✅ Service layer pattern
- ✅ TypeScript support
- ✅ Prisma ORM
- ✅ Environment-based configuration

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone <repository-url>
cd auth-system

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

## 📚 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/refresh-token` | Refresh access token | ❌ |
| POST | `/api/auth/logout` | Logout user | ❌ |
| POST | `/api/auth/logout-all` | Logout from all devices | ✅ |
| GET | `/api/auth/me` | Get user profile | ✅ |

### 📧 Password & Email Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/forgot-password` | Request password reset | ❌ |
| POST | `/api/auth/reset-password` | Reset password with token | ❌ |
| POST | `/api/auth/send-verification` | Send verification email | ✅ |
| POST | `/api/auth/verify-email` | Verify email with token | ❌ |

### 👥 User Management Endpoints (Admin Only)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users | ADMIN |
| GET | `/api/users/:id` | Get user by ID | ADMIN, MODERATOR |
| PUT | `/api/users/:id/role` | Update user role | ADMIN |
| PUT | `/api/users/:id/status` | Toggle user status | ADMIN |
| DELETE | `/api/users/:id` | Delete user | ADMIN |

### 📊 Audit Log Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/audit/my-activity` | Get own activity logs | USER+ |
| GET | `/api/audit/system` | Get system audit logs | ADMIN |

## 🧪 Testing with Postman

Proje ile birlikte hazır Postman koleksiyonları gelir:

```bash
postman-collection/
├── Auth-System-Environment.json          # Environment variables
├── Auth-System-Postman-Collection.json   # Main API collection
├── Admin-Test-Scenarios.json             # Admin test scenarios
└── README-Postman.md                     # Usage guide
```

### Import Instructions:
1. Import `Auth-System-Environment.json` as Environment
2. Import `Auth-System-Postman-Collection.json` as Collection
3. Select "Auth System Environment" in Postman
4. Start testing with Health Check endpoint

## 🗃️ Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  password     String
  name         String?
  isActive     Boolean  @default(true)
  isVerified   Boolean  @default(false)
  role         Role     @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Supported Roles
- `USER` - Standard user permissions
- `MODERATOR` - Extended permissions
- `ADMIN` - Full system access

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## 🌍 Environment Variables

```env
# Database
DATABASE_URL="your-database-connection-string"

# JWT Configuration
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
```

## 🏗️ Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # Route definitions
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── lib/             # External library configs
└── index.ts         # Application entry point

prisma/
└── schema.prisma    # Database schema

postman-collection/  # API testing files
```

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt
- ✅ JWT token expiration
- ✅ Rate limiting per IP
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Sensitive data masking in logs
- ✅ Environment-based secrets

## 🚀 Production Deployment

### Environment Setup
1. Set production environment variables
2. Use strong JWT secrets
3. Configure production database
4. Enable HTTPS
5. Set up proper logging
6. Configure rate limiting

### Recommended Stack
- **Database**: PostgreSQL
- **Hosting**: Vercel, Railway, or AWS
- **Email Service**: SendGrid, Mailgun
- **Monitoring**: Sentry, LogRocket

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📖 Check the documentation
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

**Built with ❤️ using Node.js, TypeScript, and Prisma**