# Frontend Documentation

Next.js 15 application with React 19, TypeScript, and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Build and Deployment

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/           # Auth routes (login, register)
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard-specific components
├── lib/
│   ├── api.ts            # API client with interceptors
│   ├── auth.ts           # Auth utilities
│   ├── contexts/         # React contexts (AuthContext)
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## Component Structure

### UI Components (`components/ui/`)

- **Button**: Reusable button with variants (primary, secondary, outline, ghost, danger)
- **Input**: Form input with label and error display
- **ErrorBoundary**: Error boundary for error handling

### Auth Components (`components/auth/`)

- **AuthForm**: Reusable form for login/register
- **ProtectedRoute**: Route protection wrapper

### Dashboard Components (`components/dashboard/`)

- **Navbar**: Navigation bar with auth state
- **UserCard**: User profile card display
- **RelationshipButton**: Add/remove friend button
- **FriendRequest**: Friend request component

## State Management

### Auth Context

Global authentication state managed via React Context:

```typescript
const { user, isLoading, login, register, logout, updateUser } = useAuth();
```

### Custom Hooks

- **useAuth**: Access authentication state and methods
- **useRelationships**: Manage relationship data

## API Client

Centralized API client in `lib/api.ts`:

- Automatic JWT token attachment
- Request/response interceptors
- Error handling and retry logic
- Automatic redirect on 401

## Routing

Uses Next.js App Router:

- `/` - Landing page (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Main dashboard (protected)
- `/profile` - User profile (protected)
- `/users` - User discovery/search (protected)
- `/friends` - Friends list (protected)

## Styling

Uses Tailwind CSS with a modern design system:

- Mobile-first responsive approach
- Consistent color scheme
- Smooth animations and transitions
- Accessible components

## Form Validation

Uses React Hook Form with Zod validation:

- Client-side validation
- Type-safe form handling
- User-friendly error messages

## Mobile Responsiveness

All pages are mobile-responsive:

- Mobile-first design approach
- Responsive navigation
- Touch-friendly interactions
- Optimized layouts for all screen sizes

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:5000/api`)

## Type Safety

Full TypeScript coverage with type definitions in `types/`:

- `user.ts`: User types
- `auth.ts`: Authentication types
- `relationship.ts`: Relationship types
- `api.ts`: API response types

## Error Handling

- Error boundaries for component errors
- User-friendly error messages
- API error handling with retry logic
- Form validation errors displayed inline
