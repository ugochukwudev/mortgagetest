# Abbey Full-Stack Challenge

A modern, full-stack social networking application built with Next.js 15, Express, TypeScript, PostgreSQL, and Redis.

## Architecture Overview

This application consists of two separate applications:

- **Backend**: Express.js API with TypeScript, PostgreSQL (Prisma ORM), Redis caching, JWT authentication
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS (mobile-responsive UI)

### Technology Stack

**Backend:**
- Node.js, Express, TypeScript
- Prisma ORM with PostgreSQL (Neon)
- Redis (ioredis) for caching
- JWT authentication
- Zod for validation
- bcryptjs for password hashing

**Frontend:**
- Next.js 15, React 19, TypeScript
- Tailwind CSS
- React Hook Form + Zod validation
- Axios for API calls
- Lucide React (icons)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- PostgreSQL database (Neon account recommended)
- Redis server running locally or remote instance

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mortgagetest
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
POSTGRES_URL=postgresql://user:password@host:port/database?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:port/database?sslmode=require
POSTGRES_PRISMA_URL=postgresql://user:password@host:port/database?connect_timeout=15&sslmode=require

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Development

1. Start Redis (if not already running):
```bash
redis-server
```

2. Start the backend:
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

3. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production

1. Build the backend:
```bash
cd backend
npm run build
npm start
```

2. Build the frontend:
```bash
cd frontend
npm run build
npm start
```

## Project Structure

```
/
├── README.md
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Route definitions
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Helper functions
│   │   └── app.ts          # Express app setup
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── server.ts           # Entry point
└── frontend/
    ├── app/                 # Next.js app router
    ├── components/          # React components
    ├── lib/                 # Utilities and API client
    └── types/               # TypeScript types
```

## Key Features

- **User Authentication**: JWT-based auth with session management (one active session per user)
- **User Profiles**: Update name, bio, and avatar
- **Friend Requests**: Send, accept, reject, and manage friend requests
- **User Discovery**: Search and discover other users
- **Redis Caching**: User profiles (5min TTL), relationships (2min TTL), sessions
- **Mobile Responsive**: Modern, mobile-first UI design
- **Type Safe**: Full TypeScript coverage

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

## Database Schema

- **User**: id, email, password, name, bio, avatar, timestamps
- **Session**: id, userId, token, expiresAt, timestamps
- **Relationship**: id, requesterId, addresseeId, status (PENDING/ACCEPTED/BLOCKED), timestamps

## Caching Strategy

- User profiles: 5-minute TTL
- User relationships: 2-minute TTL
- Session validation: cached for performance
- Automatic cache invalidation on updates

## Testing

To test the application:

1. Register a new account
2. Login (verify previous session invalidation)
3. Update your profile
4. Search for users
5. Send friend requests
6. Accept/reject friend requests
7. View friends list

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is accessible
- Verify Redis is running
- Ensure all environment variables are set correctly

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running on the correct port

### Database connection errors
- Verify PostgreSQL connection string
- Check Prisma migrations have been run
- Ensure database exists and is accessible

### Redis connection errors
- Verify Redis is running: `redis-cli ping`
- Check Redis host/port in environment variables
- Ensure Redis password is set if required

## License

ISC

