# Chat App

A production-ready real-time chat application built with Fastify, Socket.IO, PostgreSQL backend and Next.js, Mantine UI, Tailwind CSS frontend. Features OAuth authentication, direct messaging, comprehensive message management, and a beautifully styled API documentation interface with enterprise-grade security and performance optimizations.

## Live Demo

- **Frontend Application**: [https://chat-app-xcfio.netlify.app/](https://chat-app-xcfio.netlify.app/)
- **Backend API & Documentation**: [https://api-xcfio.onrender.com/](https://api-xcfio.onrender.com/)

## Features

### Core Messaging System

- **Real-time bidirectional messaging** with Socket.IO and WebSocket fallbacks
- **Message CRUD operations** with edit, delete, and status tracking
- **Message status progression** (sent → delivered → read → deleted)
- **Message search** with full-text search across conversations
- **Message pagination** with cursor-based navigation for performance
- **Typing indicators** with real-time broadcast to participants
- **Message validation** with content length limits and sanitization

### Authentication & User Management

- **Multi-provider OAuth** integration (GitHub, Google) with extensible architecture
- **Secure JWT tokens** with signed HTTP-only cookies
- **User profile management** with avatar and display name support
- **User search and discovery** with pagination and filtering
- **Session management** with automatic refresh and logout capabilities
- **CSRF protection** with state parameter validation
- **Rate limiting** with IP forwarding and proxy support

### Conversation Management

- **Direct conversations** between two participants with validation
- **Conversation lifecycle** management (create, read, delete)
- **Participant validation** ensuring users can only access authorized conversations
- **Conversation search** and listing with metadata
- **Real-time conversation updates** when messages are sent

### Advanced Features

- **Comprehensive error handling** with detailed error codes and messages
- **Schema validation** with TypeBox for runtime type safety
- **Database migrations** with Drizzle ORM
- **Custom API documentation** with dark theme and enhanced UX
- **Production logging** with structured output and file rotation
- **Health check endpoints** for monitoring and load balancers

## Technology Stack

### Backend Framework

- **Fastify v5** - High-performance Node.js web framework
- **TypeScript v5** - Type-safe development with strict configuration
- **Socket.IO v4** - Real-time bidirectional communication
- **Node.js 24.x** - Modern JavaScript runtime with latest features

### Database & ORM

- **PostgreSQL** - Robust relational database with UUID v7 support
- **Drizzle ORM v0.44** - Type-safe SQL toolkit and query builder
- **postgres v3** - High-performance PostgreSQL client

### Frontend Framework

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript development

### UI & Styling

- **Mantine UI v7** - Modern React components library
- **Tailwind CSS v3** - Utility-first CSS framework
- **@tabler/icons-react** - Comprehensive icon library
- **@emotion/react** - CSS-in-JS library for Mantine

### Authentication & Security

- **@fastify/jwt v10** - JSON Web Token authentication
- **@fastify/cookie v11** - Secure cookie handling with signing
- **@fastify/cors v11** - Cross-origin resource sharing configuration
- **@fastify/rate-limit v10** - Request rate limiting with Redis support

### API Documentation

- **@fastify/swagger v9** - OpenAPI 3.1.1 specification generation
- **@fastify/swagger-ui v5** - Interactive API documentation with custom styling
- **@sinclair/typebox v0.34** - Runtime type validation and schema generation

### Development & Build

- **tsx** - TypeScript execution for development and production
- **drizzle-kit** - Database migration and studio tools
- **UUID v13** - UUID v7 generation for time-ordered identifiers
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS preprocessing
- **Autoprefixer** - CSS vendor prefixing

## Installation & Setup

### Prerequisites

- Node.js 24.x.x or higher (backend) / 18.17 or higher (frontend)
- PostgreSQL 13+ with UUID extension
- npm 10.0 or higher
- Git for version control

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/xcfio/chat-app.git
    cd chat-app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Database setup**

    ```bash
    # Create PostgreSQL database
    createdb chatapp

    # Generate and run migrations
    cd apps/backend
    node --run gen
    ```

4. **Configure environment**

    ```bash
    # Backend configuration
    cd apps/backend
    cp .env.example .env
    # Edit .env with your configuration (see Environment Configuration)

    # Frontend configuration
    cd ../frontend
    cp .env.example .env.local
    # Edit .env.local with your API endpoint
    ```

5. **Start development servers**

    ```bash
    # From project root - starts both backend and frontend
    node --run dev

    # Or start individually:
    cd apps/backend && node --run dev
    cd apps/frontend && node --run dev
    ```

6. **Access the application**
    - Frontend: `http://localhost:7700`
    - Backend API: `http://localhost:7200`
    - API Documentation: `http://localhost:7200`
    - Health Check: `http://localhost:7200/status`
    - Database Studio: `http://localhost:4000` (run `node --run db` in backend)

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in `apps/backend`:

```bash
# Server Configuration
NODE_ENV=development
PORT=7200

# Database Configuration
DATABASE_URI=postgresql://username:password@localhost:5432/chatapp

# Security Keys (Generate strong 32+ character keys)
COOKIE_SECRET=your-super-secure-cookie-secret-key-minimum-32-chars
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-chars

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_REDIRECT_URI=http://localhost:7200/auth/github/callback

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_app_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_app_client_secret
GOOGLE_REDIRECT_URI=http://localhost:7200/auth/google/callback

# Frontend URL for CORS and OAuth redirects
FRONTEND_URL=http://localhost:7700

# Optional: Monitoring and Analytics
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_api_key
```

### Frontend Environment Variables

Create a `.env.local` file in `apps/frontend`:

```bash
# API Configuration
NEXT_PUBLIC_API_ENDPOINT=http://localhost:7200

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

### OAuth Provider Setup

**GitHub OAuth App:**

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:7700`
4. Set Authorization callback URL: `http://localhost:7200/auth/github/callback`
5. Copy Client ID and Client Secret to your .env file

**Google OAuth App:**

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click "Create Credentials" → OAuth 2.0 Client IDs
3. Set Authorized JavaScript origins: `http://localhost:7200`
4. Set Authorized redirect URIs: `http://localhost:7200/auth/google/callback`
5. Copy Client ID and Client Secret to your .env file

## Project Structure

```
chat-app/
├── .github/
│   └── workflows/                   # CI/CD workflows
├── apps/
│   ├── backend/                     # Fastify API server
│   │   ├── src/
│   │   │   ├── database/           # Database schema and connections
│   │   │   │   ├── index.ts        # Database client and table exports
│   │   │   │   ├── user.ts         # User table schema with OAuth support
│   │   │   │   ├── conversation.ts # Conversation table with participants
│   │   │   │   └── message.ts      # Message table with status tracking
│   │   │   ├── function/           # Utility functions and helpers
│   │   │   │   ├── error.ts        # Custom error creation and handling
│   │   │   │   ├── validation.ts   # Schema validation error formatting
│   │   │   │   └── css.ts          # Custom CSS for API documentation
│   │   │   ├── plugin/             # Fastify plugin configurations
│   │   │   │   ├── index.ts        # Plugin registration orchestrator
│   │   │   │   ├── swagger.ts      # OpenAPI specification setup
│   │   │   │   ├── swagger-ui.ts   # Custom-styled documentation UI
│   │   │   │   ├── socket-io.ts    # Socket.IO server configuration
│   │   │   │   ├── cookie.ts       # Signed cookie middleware
│   │   │   │   ├── jwt.ts          # JWT authentication setup
│   │   │   │   ├── cors.ts         # CORS policy configuration
│   │   │   │   └── rate-limit.ts   # Rate limiting with proxy support
│   │   │   ├── routes/             # API route handlers
│   │   │   │   ├── index.ts        # Route registration orchestrator
│   │   │   │   ├── conversation/   # Conversation management endpoints
│   │   │   │   ├── message/        # Message management endpoints
│   │   │   │   ├── oauth/          # OAuth authentication flows
│   │   │   │   ├── search/         # Search functionality
│   │   │   │   ├── session/        # Session management
│   │   │   │   └── user/           # User management
│   │   │   ├── socket/             # Socket.IO event handlers
│   │   │   │   └── index.ts        # Connection handling and event routing
│   │   │   ├── index.ts            # Main server entry point
│   │   │   └── type.ts             # TypeScript type definitions and schemas
│   │   └── drizzle/                # Database migrations
│   └── frontend/                   # Next.js web application
│       ├── src/
│       │   ├── app/                # Next.js App Router
│       │   │   ├── auth/           # Authentication pages
│       │   │   ├── chat/           # Chat application
│       │   │   │   └── [id]/       # Individual conversation
│       │   │   ├── globals.css     # Global styles
│       │   │   ├── layout.tsx      # Root layout
│       │   │   └── page.tsx        # Landing page
│       │   ├── components/         # React components
│       │   │   ├── providers/      # Context providers
│       │   │   │   ├── AuthProvider.tsx
│       │   │   │   ├── MantineProvider.tsx
│       │   │   │   └── SocketProvider.tsx
│       │   │   └── ui/             # UI components
│       │   │       ├── AuthButtons.tsx
│       │   │       ├── ChatList.tsx
│       │   │       ├── ChatWindow.tsx
│       │   │       ├── MessageInput.tsx
│       │   │       ├── MessageList.tsx
│       │   │       └── UserSearch.tsx
│       │   ├── hooks/              # Custom React hooks
│       │   │   ├── useAuth.ts
│       │   │   ├── useChat.ts
│       │   │   └── useSocket.ts
│       │   ├── lib/                # Utility libraries
│       │   │   ├── api.ts          # API client configuration
│       │   │   ├── auth.ts         # Authentication utilities
│       │   │   ├── socket.ts       # Socket.IO configuration
│       │   │   ├── types.ts        # TypeScript type definitions
│       │   │   └── utils.ts        # General utilities
│       │   └── styles/             # Additional stylesheets
│       └── public/                 # Static assets
├── package.json                    # Root package configuration
├── turbo.json                      # Turborepo configuration (if using)
└── README.md                       # This file
```

### Request Flow

**REST API Requests:**

1. **Fastify Router** → Route matching and parameter extraction
2. **Plugin Chain** → Rate limiting → CORS → Authentication
3. **Schema Validation** → TypeBox runtime validation
4. **Route Handler** → Business logic and database operations
5. **Response** → JSON serialization and HTTP status codes

**WebSocket Connections:**

1. **Socket.IO Handshake** → Cookie parsing and JWT verification
2. **Connection Events** → User authentication and room joining
3. **Message Broadcasting** → Event emission to relevant participants
4. **Error Handling** → Graceful disconnection and error reporting

## Database Schema

The application uses PostgreSQL with UUID v7 identifiers for time-ordered, collision-resistant primary keys.

### User Table Schema

```sql
CREATE TABLE "user" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  "type" TEXT NOT NULL CHECK (type IN ('github', 'google')),
  "token" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "username" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "avatar" TEXT,
  "last_seen" TIMESTAMP DEFAULT NOW(),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_username ON "user"(username);
CREATE INDEX idx_user_type ON "user"(type);
```

### Conversation Table Schema

```sql
CREATE TABLE "conversation" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  "p1" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "p2" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_conversation_participants
ON "conversation"(LEAST(p1, p2), GREATEST(p1, p2));
CREATE INDEX idx_conversation_updated ON "conversation"(updated_at DESC);
```

### Message Table Schema

```sql
CREATE TABLE "message" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  "content" TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
  "sender" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "conversation" UUID NOT NULL REFERENCES "conversation"(id) ON DELETE CASCADE,
  "status" TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'deleted')),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "edited_at" TIMESTAMP
);

CREATE INDEX idx_message_conversation ON "message"(conversation, created_at DESC);
CREATE INDEX idx_message_sender ON "message"(sender);
CREATE INDEX idx_message_status ON "message"(status);
CREATE INDEX idx_message_content_search ON "message" USING gin(to_tsvector('english', content));
```

## API Documentation

The API includes a custom-styled, interactive documentation interface built with Swagger UI and enhanced with a modern dark theme.

### Documentation Features

**Enhanced UI/UX:**

- **GitHub-inspired dark theme** with glassmorphism effects
- **Gradient backgrounds** and smooth CSS animations
- **Custom syntax highlighting** for JSON examples
- **Responsive design** optimized for all screen sizes
- **Interactive examples** with working API calls
- **Enhanced accessibility** with ARIA labels and keyboard navigation

### Accessing Documentation

**Primary Documentation:**

- **Interactive UI:** `http://localhost:7200` (backend)
- **Raw OpenAPI JSON:** `http://localhost:7200/json`
- **Health Check:** `http://localhost:7200/status`

**Development Tools:**

- **Database Studio:** `http://localhost:4000` (via `node --run db` in backend)
- **Server Logs:** `./log.json` (in development mode)

### Key API Endpoints

#### Authentication Endpoints

```typescript
// OAuth login initiation
GET /auth/github
GET /auth/google

// OAuth callbacks
GET /auth/github/callback
GET /auth/google/callback

// Session management
GET /auth/me           # Get current user
POST /auth/refresh     # Refresh user data
POST /auth/logout      # Logout user
```

#### User Management

```typescript
GET /user              # Get all users (paginated)
GET /user/{id}         # Get specific user
GET /search/users      # Search users by query
```

#### Conversations

```typescript
GET /conversations            # Get user's conversations
GET /conversations/{id}       # Get specific conversation
POST /conversations/{userId}  # Create conversation with user
DELETE /conversations/{id}    # Delete conversation
```

#### Messages

```typescript
GET /conversations/{id}/messages    # Get conversation messages
POST /conversations/{id}/messages   # Send new message
PATCH /messages/{id}               # Edit message
DELETE /messages/{id}              # Delete message
PUT /messages/{id}/read            # Mark as read
GET /search/messages               # Search messages
```

## Real-time Features

### Socket.IO Architecture

**Connection Management:**

- **Automatic authentication** on connection using JWT cookies
- **User room assignment** for targeted message delivery
- **Connection state tracking** for presence management
- **Graceful disconnection** handling with cleanup

### Real-time Event System

**Server-to-Client Events:**

```typescript
interface ServerToClientEvents {
    new_message: (message: Message) => void
    message_deleted: (data: { messageId: string; conversationId: string }) => void
    message_edited: (data: { messageId: string; content: string; editedAt: string; conversationId: string }) => void
    user_status_changed: (userId: string, status: UserStatus) => void
    user_typing: (userId: string, isTyping: boolean) => void
    error: (error: { message: string; code: string }) => void
}
```

**Client-to-Server Events:**

```typescript
interface ClientToServerEvents {
    update_status: (status: UserStatus) => void
    typing: (chatId: string, isTyping: boolean) => void
}
```

## Authentication Flow

### OAuth Integration

#### GitHub OAuth Flow

1. User clicks GitHub login button on frontend
2. Frontend redirects to `/auth/github` endpoint on backend
3. Backend redirects to GitHub OAuth
4. GitHub redirects to `/auth/github/callback` on backend
5. Backend processes callback and sets cookie
6. Backend redirects to frontend `/auth` page
7. Frontend calls `/auth/me` to get user data
8. User redirected to chat interface

#### Google OAuth Flow

1. User clicks Google login button on frontend
2. Frontend redirects to `/auth/google` endpoint on backend
3. Backend redirects to Google OAuth
4. Google redirects to `/auth/google/callback` on backend
5. Backend processes callback and sets cookie
6. Backend redirects to frontend `/auth` page
7. Frontend calls `/auth/me` to get user data
8. User redirected to chat interface

### Authentication State Management

```typescript
// Frontend authentication check
useEffect(() => {
    checkAuth()
}, [])

const checkAuth = async () => {
    try {
        const response = await auth.me()
        setUser(response.data)
    } catch (error) {
        setUser(null)
    } finally {
        setLoading(false)
    }
}
```

## Performance & Optimization

### Database Optimization

**Indexing Strategy:**

- **Primary keys** using UUID v7 for time-ordered insertion
- **Foreign key indexes** for efficient joins
- **Composite indexes** for common query patterns
- **Full-text search indexes** using PostgreSQL GIN indexes
- **Partial indexes** for soft-deleted records

### API Performance

**Request Optimization:**

- **Schema validation caching** with TypeBox compilation
- **Response compression** with built-in Fastify compression
- **ETag support** for conditional requests
- **Request deduplication** for identical concurrent requests

**Rate Limiting:**

- **20 requests per 10 seconds** global limit
- **IP-based tracking** with X-Forwarded-For support
- **Graceful degradation** with informative error messages
- **Configurable limits** per endpoint type

### Frontend Performance

**Code Splitting:**

- **Automatic code splitting** with Next.js dynamic imports
- **Component-level splitting** for better load times
- **Route-based splitting** through App Router

**Component Optimization:**

- **React.memo** for expensive components
- **useMemo/useCallback** for expensive computations
- **Debounced search** to reduce API calls

### Development Workflow

**Setting Up Development Environment:**

1. **Clone and install dependencies**

    ```bash
    git clone https://github.com/xcfio/chat-app.git
    cd chat-app
    npm install
    ```

2. **Set up PostgreSQL database**

    ```bash
    createdb chatapp
    cd apps/backend
    node --run gen
    node --run migrate
    ```

3. **Configure environment variables**

    ```bash
    cd apps/backend
    cp .env.example .env
    # Edit .env with your OAuth credentials

    cd ../frontend
    cp .env.example .env.local
    # Edit .env.local with your API endpoint
    ```

4. **Start development servers**

    ```bash
    cd ../..
    node --run dev
    ```

5. **Open applications**
    - Frontend: `http://localhost:7700`
    - Backend API: `http://localhost:7200`

## Deployment

### Production Deployment

**Current Deployment:**

- **Frontend**: Deployed on Netlify with automatic builds from GitHub
- **Backend**: Deployed on Render with PostgreSQL database

### Environment-Specific Configurations

**Production (.env.production):**

```bash
# Backend
NODE_ENV=production
DATABASE_URI=postgresql://user:pass@prod-host:5432/chatapp
FRONTEND_URL=https://chat-app-xcfio.netlify.app
TRUST_PROXY=true

# Frontend
NEXT_PUBLIC_API_ENDPOINT=https://api-xcfio.onrender.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## Troubleshooting

### Common Issues

**Database Connection Problems:**

```typescript
// Debug database connectivity
const testConnection = async () => {
    try {
        const result = await db.select().from(table.user).limit(1)
        console.log("Database connection successful")
    } catch (error) {
        console.error("Database connection failed:", error)
        // Check: DATABASE_URI, PostgreSQL service, network connectivity
    }
}
```

**OAuth Authentication Issues:**

- Incorrect redirect URIs in OAuth app settings
- Mismatched client secrets
- CORS issues with frontend domain
- Cookie domain/path configuration

**Socket.IO Connection Issues:**

- CORS configuration for Socket.IO
- Cookie parsing in Socket.IO handshake
- WebSocket transport blocked by proxy/firewall
- Authentication token format issues

### Debug Mode

**Enable Debug Logging:**

```bash
# Environment variables for debugging
DEBUG=fastify:*,socket.io:*
LOG_LEVEL=debug
cd apps/backend && node --run dev
```

**Frontend Debug Mode:**

```bash
# Frontend debugging
NEXT_PUBLIC_DEBUG=true
cd apps/frontend && node --run dev
```

## Contributing

### Development Setup for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork locally**

    ```bash
    git clone https://github.com/your-username/chat-app.git
    cd chat-app
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Set up development environment**

    ```bash
    # Backend setup
    createdb chatapp_dev
    cd apps/backend
    cp .env.example .env
    # Edit .env with your settings
    node --run gen

    # Frontend setup
    cd ../frontend
    cp .env.example .env.local
    # Edit .env.local with your API endpoint
    ```

5. **Create feature branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

### Code Standards

**TypeScript Guidelines:**

- Use strict mode with `noImplicitAny` and `strictNullChecks`
- Define interfaces for all data structures
- Use enums for constant values
- Implement proper error handling with typed exceptions
- Add JSDoc comments for public APIs

**Database Guidelines:**

- Use transactions for multi-table operations
- Add appropriate indexes for query patterns
- Use UUID v7 for all primary keys
- Follow foreign key constraints
- Add database migrations for schema changes

**API Guidelines:**

- Follow RESTful principles for HTTP endpoints
- Use proper HTTP status codes
- Implement consistent error responses
- Add comprehensive OpenAPI documentation
- Include request/response examples

### Pull Request Process

1. **Update documentation** for any API changes
2. **Validate code quality** by running linting and type checks
3. **Update CHANGELOG.md** with your changes
4. **Follow commit message conventions:**

    ```
    feat: add message search endpoint
    fix: resolve socket authentication timeout
    docs: update API documentation
    refactor: optimize database queries
    ```

5. **Submit pull request** with detailed description
6. **Address review feedback** promptly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or contributions:

- **Email:** omarfaruksxp@gmail.com
- **Discord:** [Join our Discord server](https://discord.com/invite/FaCCaFM74Q)
- **GitHub Issues:** [Create an issue](https://github.com/xcfio/chat-app/issues)
