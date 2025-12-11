# Backend API Documentation

Express.js API with TypeScript, PostgreSQL (Prisma), Redis caching, and JWT authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see `.env.example`)

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": null,
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/login`
Login user (invalidates all previous sessions).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": null,
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/logout`
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

#### GET `/api/auth/me`
Get current authenticated user (cached).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": null,
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Users

#### GET `/api/users/:id`
Get user profile by ID (cached).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "bio": "My bio",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/users/:id`
Update user profile (invalidates cache). Only the owner can update.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Updated Name",
    "bio": "Updated bio",
    "avatar": "https://example.com/new-avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET `/api/users`
Search users with pagination (cached).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q` (optional): Search query (name or email)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "bio": null,
      "avatar": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Relationships

#### POST `/api/relationships/request`
Send a friend request.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "addresseeId": "uuid"
}
```

**Response:**
```json
{
  "message": "Friend request sent successfully",
  "relationship": {
    "id": "uuid",
    "requesterId": "uuid",
    "addresseeId": "uuid",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "requester": { ... },
    "addressee": { ... }
  }
}
```

#### GET `/api/relationships`
Get all user relationships (cached).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "relationships": [
    {
      "id": "uuid",
      "requesterId": "uuid",
      "addresseeId": "uuid",
      "status": "ACCEPTED",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "requester": { ... },
      "addressee": { ... }
    }
  ]
}
```

#### PUT `/api/relationships/:id`
Accept or block a relationship request. Only the addressee can update.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

**Response:**
```json
{
  "message": "Relationship updated successfully",
  "relationship": {
    "id": "uuid",
    "requesterId": "uuid",
    "addresseeId": "uuid",
    "status": "ACCEPTED",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "requester": { ... },
    "addressee": { ... }
  }
}
```

#### DELETE `/api/relationships/:id`
Remove a relationship.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Relationship removed successfully"
}
```

## Code Structure

- **controllers/**: Handle HTTP requests and responses
- **services/**: Business logic and data operations
- **routes/**: Route definitions and middleware chaining
- **middleware/**: Authentication, validation, error handling
- **config/**: Database, Redis, environment setup
- **utils/**: JWT utilities, validation schemas

## Caching Strategy

- **User Profiles**: Cached for 5 minutes, invalidated on update
- **Relationships**: Cached for 2 minutes, invalidated on changes
- **Sessions**: Cached for 1 hour for quick validation

Cache keys:
- `user:{userId}` - User profile
- `relationships:{userId}` - User relationships
- `session:{token}` - Session data

## Database Migrations

Run migrations:
```bash
npm run prisma:migrate
```

View database:
```bash
npm run prisma:studio
```

## Error Handling

All errors are handled by the centralized error handler middleware. Error responses follow this format:

```json
{
  "error": "Error message here"
}
```

Validation errors include details:
```json
{
  "error": "Validation error",
  "details": [...]
}
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- One active session per user (previous sessions invalidated on login)
- CORS configured for frontend origin only
- Input validation using Zod schemas

