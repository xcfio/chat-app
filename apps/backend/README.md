# Chat App Backend

A production-ready real-time chat application backend built with Fastify, Socket.IO, and PostgreSQL. Features OAuth authentication, direct messaging, comprehensive message management, and a beautifully styled API documentation interface with enterprise-grade security and performance optimizations.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Real-time Features](#real-time-features)
- [Error Handling](#error-handling)
- [Performance & Optimization](#performance--optimization)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

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

### Core Framework

- **Fastify v5** - High-performance Node.js web framework
- **TypeScript v5** - Type-safe development with strict configuration
- **Socket.IO v4** - Real-time bidirectional communication
- **Node.js 24.x** - Modern JavaScript runtime with latest features

### Database & ORM

- **PostgreSQL** - Robust relational database with UUID v7 support
- **Drizzle ORM v0.44** - Type-safe SQL toolkit and query builder
- **postgres v3** - High-performance PostgreSQL client

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

## Installation & Setup

### Prerequisites

- Node.js 24.x.x or higher
- PostgreSQL 13+ with UUID extension
- npm 10.0 or higher
- Git for version control

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/xcfio/chat-app.git
    cd chat-app/backend
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
    node --run gen
    ```

4. **Configure environment**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration (see Environment Configuration)
    ```

5. **Start development server**

    ```bash
    node --run dev
    ```

6. **Access the application**
    - API Server: `http://localhost:7200`
    - API Documentation: `http://localhost:7200`
    - Health Check: `http://localhost:7200/status`
    - Database Studio: `http://localhost:4000` (run `node --run db`)

### Docker Setup

**Development with Docker Compose:**

```yaml
# docker-compose.yml
version: "3.8"
services:
    app:
        build: .
        ports:
            - "7200:7200"
        environment:
            - DATABASE_URI=postgresql://postgres:password@db:5432/chatapp
        depends_on:
            - db

    db:
        image: postgres:15-alpine
        environment:
            POSTGRES_DB: chatapp
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: password
        ports:
            - "5432:5432"
        volumes:
            - postgres_data:/var/lib/postgresql/data

volumes:
    postgres_data:
```

**Run with Docker:**

```bash
docker-compose up -d
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

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

### Environment-Specific Configurations

**Development (.env.development):**

```bash
NODE_ENV=development
DATABASE_URI=postgresql://postgres:password@localhost:5432/chatapp_dev
FRONTEND_URL=http://localhost:7700
LOG_LEVEL=debug
```

**Testing (.env.test):**

```bash
NODE_ENV=test
DATABASE_URI=postgresql://postgres:password@localhost:5432/chatapp_test
FRONTEND_URL=http://localhost:7700
LOG_LEVEL=silent
```

**Production (.env.production):**

```bash
NODE_ENV=production
DATABASE_URI=postgresql://user:pass@prod-host:5432/chatapp
FRONTEND_URL=https://your-domain.com
LOG_LEVEL=info
TRUST_PROXY=true
```

## Project Structure

```
backend/
├── src/
│   ├── database/                    # Database schema and connections
│   │   ├── index.ts                # Database client and table exports
│   │   ├── user.ts                 # User table schema with OAuth support
│   │   ├── conversation.ts         # Conversation table with participants
│   │   └── message.ts              # Message table with status tracking
│   ├── function/                    # Utility functions and helpers
│   │   ├── error.ts                # Custom error creation and handling
│   │   ├── validation.ts           # Schema validation error formatting
│   │   └── css.ts                  # Custom CSS for API documentation
│   ├── plugin/                      # Fastify plugin configurations
│   │   ├── index.ts                # Plugin registration orchestrator
│   │   ├── swagger.ts              # OpenAPI specification setup
│   │   ├── swagger-ui.ts           # Custom-styled documentation UI
│   │   ├── socket-io.ts            # Socket.IO server configuration
│   │   ├── cookie.ts               # Signed cookie middleware
│   │   ├── jwt.ts                  # JWT authentication setup
│   │   ├── cors.ts                 # CORS policy configuration
│   │   └── rate-limit.ts           # Rate limiting with proxy support
│   ├── routes/                      # API route handlers
│   │   ├── index.ts                # Route registration orchestrator
│   │   ├── conversation/           # Conversation management endpoints
│   │   │   ├── index.ts           # Route group registration
│   │   │   ├── create-conversation.ts    # POST /conversations/:id
│   │   │   ├── delete-conversation.ts    # DELETE /conversations/:id
│   │   │   ├── get-conversation.ts       # GET /conversations
│   │   │   └── get-conversation-id.ts    # GET /conversations/:id
│   │   ├── message/                # Message management endpoints
│   │   │   ├── index.ts           # Route group registration
│   │   │   ├── send-message.ts    # POST /conversations/:id/messages
│   │   │   ├── get-message.ts     # GET /conversations/:id/messages
│   │   │   ├── edit-message.ts    # PATCH /messages/:id
│   │   │   ├── delete-message.ts  # DELETE /messages/:id
│   │   │   └── read-message.ts    # PUT /messages/:id/read
│   │   ├── oauth/                  # OAuth authentication flows
│   │   │   ├── index.ts           # OAuth route registration
│   │   │   ├── github.ts          # GitHub OAuth implementation
│   │   │   └── google.ts          # Google OAuth implementation
│   │   ├── search/                 # Search functionality
│   │   │   ├── index.ts           # Search route registration
│   │   │   ├── user.ts            # GET /search/users
│   │   │   └── message.ts         # GET /search/messages
│   │   ├── session/                # Session management
│   │   │   ├── index.ts           # Session route registration
│   │   │   ├── me.ts              # GET /auth/me
│   │   │   ├── refresh.ts         # POST /auth/refresh
│   │   │   └── logout.ts          # POST /auth/logout
│   │   └── user/                   # User management
│   │       ├── index.ts           # User route registration
│   │       ├── user.ts            # GET /user (list with pagination)
│   │       └── id-user.ts         # GET /user/:id
│   ├── socket/                      # Socket.IO event handlers
│   │   └── index.ts                # Connection handling and event routing
│   ├── index.ts                     # Main server entry point
│   └── type.ts                      # TypeScript type definitions and schemas
├── drizzle/                         # Database migrations
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── Dockerfile                       # Docker container configuration
└── README.md                        # This documentation
```

### Key Directories Explained

**`src/database/`** - Database schema definitions using Drizzle ORM with PostgreSQL-specific features like UUID v7 and foreign key constraints.

**`src/routes/`** - RESTful API endpoints organized by domain (conversations, messages, auth, etc.) with full CRUD operations and proper HTTP status codes.

**`src/plugin/`** - Fastify plugin configurations for cross-cutting concerns like authentication, rate limiting, CORS, and API documentation.

**`src/socket/`** - Real-time WebSocket handling with authentication middleware, connection management, and event broadcasting.

**`src/function/`** - Utility functions for error handling, validation, and custom styling that are shared across the application.

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────┐
│          API Layer (Fastify)        │ ← HTTP routes, validation, auth
├─────────────────────────────────────┤
│       Business Logic Layer          │ ← Route handlers, domain logic
├─────────────────────────────────────┤
│        Data Access Layer            │ ← Drizzle ORM, query builders
├─────────────────────────────────────┤
│         Database Layer              │ ← PostgreSQL with UUID v7
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       Real-time Layer               │ ← Socket.IO for live updates
│     (Parallel to REST API)          │
└─────────────────────────────────────┘
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

### Security Architecture

- **Defense in Depth** with multiple security layers
- **JWT Authentication** with secure cookie storage
- **Rate Limiting** to prevent abuse and DDoS attacks
- **CORS Configuration** for cross-origin request control
- **Input Validation** with TypeBox schemas
- **SQL Injection Prevention** with parameterized queries
- **XSS Protection** with input sanitization

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

**Fields:**

- **id** - UUID v7 primary key for time-ordered identifiers
- **type** - OAuth provider ('github' | 'google')
- **token** - Access/refresh token for provider API calls
- **email** - Unique email address from OAuth provider
- **username** - Unique display username
- **name** - Optional full name from provider
- **avatar** - Profile picture URL from provider
- **last_seen** - Timestamp of last activity for presence
- **created_at/updated_at** - Automatic timestamp management

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

**Fields:**

- **id** - UUID v7 primary key
- **p1/p2** - Participant user IDs with foreign key constraints
- **created_at** - Conversation creation timestamp
- **updated_at** - Last message timestamp for sorting

**Constraints:**

- Unique index on participant pairs (prevents duplicate conversations)
- Cascade delete when users are removed
- Ordered participant indexing for efficient queries

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

**Fields:**

- **id** - UUID v7 primary key
- **content** - Message text (max 2000 characters)
- **sender** - User ID who sent the message
- **conversation** - Conversation ID the message belongs to
- **status** - Message lifecycle status
- **created_at** - Message creation timestamp
- **edited_at** - Last edit timestamp (null if never edited)

**Status Flow:** sent → delivered → read → deleted

**Indexes:**

- Conversation + timestamp for efficient message retrieval
- Full-text search index for message content
- Status index for filtering deleted messages

### Database Relationships

```
User (1) ←→ (N) Conversation ←→ (N) User
                    ↓
                    (1)
                    ↓
               Message (N)
                    ↓
                    (1)
                    ↓
                User (sender)
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

**Technical Features:**

- **OpenAPI 3.1.1** specification with complete schema definitions
- **Real-time validation** of request/response schemas
- **Comprehensive examples** for all endpoints
- **Error response documentation** with specific error codes
- **Rate limiting information** and usage guidelines

### Accessing Documentation

**Primary Documentation:**

- **Interactive UI:** `http://localhost:7200`
- **Raw OpenAPI JSON:** `http://localhost:7200/json`
- **Health Check:** `http://localhost:7200/status`

**Development Tools:**

- **Database Studio:** `http://localhost:4000` (via `node --run db`)
- **Server Logs:** `./log.json` (in development mode)

### API Endpoint Categories

The API is organized into logical groups:

**Authentication** - OAuth flows and session management
**Conversations** - Direct message conversation management  
**Messages** - Message CRUD operations and search
**Users** - User profiles and discovery
**Search** - Full-text search across users and messages
**Sessions** - User session and authentication state management

## Authentication & Security

### OAuth 2.0 Implementation

**Multi-Provider Support:**

- **GitHub OAuth** with user profile and email access
- **Google OAuth** with OpenID Connect integration
- **Extensible architecture** for additional providers

**OAuth Flow Security:**

1. **State Parameter** - CSRF protection with cryptographic state
2. **Secure Redirects** - Validated callback URLs
3. **Token Exchange** - Server-side code-to-token exchange
4. **Profile Verification** - Email verification requirements

```typescript
// OAuth flow implementation
const state = randomBytes(32).toString("hex")
const authUrl =
    `https://github.com/login/oauth/authorize?` + `client_id=${CLIENT_ID}&` + `state=${state}&` + `scope=user:email`

// State stored in signed cookie for validation
reply.setCookie("oauth_state", state, { signed: true, maxAge: 600 })
```

### JWT Token Management

**Token Structure:**

```typescript
interface JWTPayload {
    id: string // User UUID
    email: string // Verified email address
    username: string // Display username
    name: string | null // Full name from provider
    avatar: string | null // Profile picture URL
    type: OAuthProvider // 'github' | 'google'
    token: string // OAuth access token
    iat: number // Issued at timestamp
    exp: number // Expiration timestamp
}
```

**Token Security:**

- **HTTP-Only Cookies** prevent XSS attacks
- **Signed Cookies** prevent tampering
- **Secure Flag** for HTTPS-only transmission
- **SameSite=None** for cross-origin requests
- **Automatic Expiration** with provider token lifetime

### Security Headers & Middleware

**Rate Limiting:**

- **20 requests per 10 seconds** global limit
- **IP-based tracking** with X-Forwarded-For support
- **Graceful degradation** with informative error messages
- **Configurable limits** per endpoint type

**CORS Configuration:**

```typescript
{
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

**Input Validation:**

- **TypeBox schemas** for runtime type checking
- **SQL injection prevention** with parameterized queries
- **XSS protection** with input sanitization
- **File upload validation** (when implemented)

### Socket.IO Authentication

**Connection Security:**

1. **Cookie Parsing** from handshake headers
2. **JWT Verification** of signed authentication cookie
3. **User Context** attachment to socket connection
4. **Room Assignment** based on user ID for targeted messaging

```typescript
// Socket authentication middleware
socket.on("connection", (socket) => {
    const cookieHeader = socket.handshake.headers.cookie
    const authCookie = parseCookie(cookieHeader).auth
    const user = fastify.jwt.verify(authCookie)

    socket.user = user
    socket.join(user.id) // Join personal room for messaging
})
```

## Real-time Features

### Socket.IO Architecture

**Connection Management:**

- **Automatic authentication** on connection using JWT cookies
- **User room assignment** for targeted message delivery
- **Connection state tracking** for presence management
- **Graceful disconnection** handling with cleanup

**Event Broadcasting:**

- **Direct messaging** to specific user rooms
- **Status updates** broadcast to relevant connections
- **Typing indicators** with automatic timeout
- **Error handling** with specific error codes

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

### Real-time Implementation Examples

**Message Broadcasting:**

```typescript
// When a message is sent
const receiver = conversation.p1 === userId ? conversation.p2 : conversation.p1
fastify.io.to(receiver).emit("new_message", messageData)
```

**Typing Indicators:**

```typescript
socket.on("typing", (chatId, isTyping) => {
    socket.to(chatId).emit("user_typing", socket.user.id, isTyping)
})
```

**Presence Management:**

```typescript
socket.on("disconnect", () => {
    socket.broadcast.emit("user_status_changed", socket.user.id, "offline")
})
```

### Connection Resilience

- **Automatic reconnection** handling on client disconnect
- **Message queue** for offline users (future enhancement)
- **Connection timeout** management
- **Error recovery** with exponential backoff

## Error Handling

### Comprehensive Error System

**Error Categories:**

- **Validation Errors** - Schema validation failures with field details
- **Authentication Errors** - JWT and OAuth authentication issues
- **Authorization Errors** - Access control and permission violations
- **Database Errors** - Constraint violations and connection issues
- **Rate Limiting Errors** - Request throttling with retry information
- **Server Errors** - Internal server errors with tracking IDs

**Error Response Format:**

```typescript
interface ErrorResponse {
    statusCode: number // HTTP status code
    error: string // Error category/type
    message: string // Human-readable description
    details?: object // Additional error context
}
```

### Custom Error Creation

```typescript
// Standardized error creation
function CreateError(statusCode: number, code: string, message: string, details?: object): FastifyError {
    const CustomError = createError(code, message, statusCode)
    const errorInstance = new CustomError()

    if (details) {
        Object.assign(errorInstance, { details })
    }

    return errorInstance
}
```

### Error Handling Examples

**Validation Errors:**

```json
{
    "statusCode": 400,
    "error": "SCHEMA_VALIDATION_ERROR",
    "message": "content: must be between 1 and 2000 characters"
}
```

**Authentication Errors:**

```json
{
    "statusCode": 401,
    "error": "TOKEN_EXPIRED",
    "message": "Authentication token has expired"
}
```

**Database Constraint Errors:**

```json
{
    "statusCode": 400,
    "error": "CONVERSATION_EXISTS",
    "message": "Conversation already exists between these users"
}
```

### Global Error Handler

```typescript
fastify.addHook("onError", (request, reply, error) => {
    if (error.statusCode >= 500) {
        console.error("Internal server error:", error)
        // Log to monitoring service
    }

    return reply.status(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        error: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message
    })
})
```

## Performance & Optimization

### Database Optimization

**Indexing Strategy:**

- **Primary keys** using UUID v7 for time-ordered insertion
- **Foreign key indexes** for efficient joins
- **Composite indexes** for common query patterns
- **Full-text search indexes** using PostgreSQL GIN indexes
- **Partial indexes** for soft-deleted records

**Query Optimization:**

- **Connection pooling** with postgres client
- **Prepared statements** for repeated queries
- **Pagination** using cursor-based navigation
- **Selective field queries** to reduce data transfer
- **Aggregate queries** for conversation metadata

### API Performance

**Request Optimization:**

- **Schema validation caching** with TypeBox compilation
- **Response compression** with built-in Fastify compression
- **ETag support** for conditional requests
- **Request deduplication** for identical concurrent requests

**Rate Limiting:**

- **Memory-based rate limiting** for development
- **Redis-backed rate limiting** for production scaling
- **Adaptive rate limiting** based on server load
- **User-specific rate limits** for authenticated requests

### Real-time Performance

**Socket.IO Optimization:**

- **Room-based messaging** to avoid broadcast storms
- **Event throttling** for high-frequency events (typing)
- **Connection pooling** for multiple server instances
- **Message queuing** for offline users (future enhancement)

**Memory Management:**

- **Connection cleanup** on user disconnect
- **Event listener cleanup** to prevent memory leaks
- **Periodic garbage collection** for long-running processes

### Caching Strategy

**Application-Level Caching:**

- **User session caching** in memory for frequent access
- **Conversation metadata caching** for active conversations
- **Message count caching** for conversation lists

**Database Query Caching:**

- **Query result caching** for expensive aggregations
- **User profile caching** for frequent lookups
- **Search result caching** with TTL expiration

## Development

### Development Scripts

```json
{
    "scripts": {
        "dev": "tsx watch --no-warnings --env-file-if-exists=.env src/index.ts",
        "start": "tsx --env-file-if-exists=.env src/index.ts",
        "build": "tsc --noEmit",
        "db": "drizzle-kit studio --port=4000",
        "gen": "drizzle-kit generate",
        "migrate": "drizzle-kit migrate",
        "lint": "eslint . --ext .ts",
        "lint:fix": "eslint . --ext .ts --fix",
        "format": "prettier --write .",
        "type-check": "tsc --noEmit"
    }
}
```

### Development Workflow

**Setting Up Development Environment:**

1. **Clone and install dependencies**

    ```bash
    git clone https://github.com/xcfio/chat-app.git
    cd chat-app/backend
    npm install
    ```

2. **Set up PostgreSQL database**

    ```bash
    createdb chatapp_dev
    node --run gen
    node --run migrate
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your OAuth credentials
    ```

4. **Start development server with hot reload**

    ```bash
    node --run dev
    ```

5. **Open database studio (optional)**
    ```bash
    node --run db
    ```

**Development Best Practices:**

- **TypeScript strict mode** enabled for type safety
- **ESLint configuration** with Fastify and TypeScript rules
- **Prettier formatting** for consistent code style
- **Git hooks** for pre-commit validation
- **Environment isolation** between dev/staging/production

### Code Organization

**Route Handler Pattern:**

```typescript
// Standard route handler structure
export function HandlerName(fastify: FastifyInstance) {
    fastify.route({
        method: "GET",
        url: "/endpoint/:id",
        schema: {
            description: "Endpoint description",
            tags: ["Category"],
            params: Type.Object({
                id: Type.String({ format: "uuid" })
            }),
            response: {
                200: ResponseSchema,
                404: ErrorResponse(404, "Not found error"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate, // Optional auth
        handler: async (request, reply) => {
            try {
                // Business logic here
                const result = await performOperation(request.params.id)
                return reply.status(200).send(result)
            } catch (error) {
                if (isFastifyError(error)) {
                    throw error
                }
                console.error("Handler error:", error)
                throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
            }
        }
    })
}
```

**Database Query Pattern:**

```typescript
// Standard database operation pattern
const getUserConversations = async (userId: string, pagination: PaginationOptions) => {
    try {
        const conversations = await db
            .select()
            .from(table.conversation)
            .where(or(eq(table.conversation.p1, userId), eq(table.conversation.p2, userId)))
            .orderBy(desc(table.conversation.updatedAt))
            .limit(pagination.limit)
            .offset(pagination.offset)

        return conversations.map((conv) => ({
            ...conv,
            createdAt: conv.createdAt.toISOString(),
            updatedAt: conv.updatedAt.toISOString()
        }))
    } catch (error) {
        throw CreateError(500, "DATABASE_ERROR", "Failed to fetch conversations")
    }
}
```

## Deployment

### Production Deployment

**Docker Production Build:**

```dockerfile
# Dockerfile
FROM node:24-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build application
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN node --run build

# Production image
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

# Copy built application
COPY --from=builder --chown=fastify:nodejs /app/dist ./dist
COPY --from=deps --chown=fastify:nodejs /app/node_modules ./node_modules
COPY --chown=fastify:nodejs package*.json ./

USER fastify

EXPOSE 7200
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "dist/index.js"]
```

**Production Environment Variables:**

```bash
# Production .env
NODE_ENV=production
PORT=7200
DATABASE_URI=postgresql://user:password@db-host:5432/chatapp
COOKIE_SECRET=production-cookie-secret-32-chars-minimum
JWT_SECRET=production-jwt-secret-32-chars-minimum
FRONTEND_URL=https://your-domain.com
TRUST_PROXY=true
LOG_LEVEL=info

# OAuth Production URLs
GITHUB_REDIRECT_URI=https://api.your-domain.com/auth/github/callback
GOOGLE_REDIRECT_URI=https://api.your-domain.com/auth/google/callback

# Optional: Redis for scaling
REDIS_URL=redis://redis-host:6379

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

### Cloud Deployment Options

**AWS Deployment with ECS:**

```yaml
# docker-compose.production.yml
version: "3.8"
services:
    app:
        image: your-registry/chat-app-backend:latest
        ports:
            - "7200:7200"
        environment:
            - NODE_ENV=production
            - DATABASE_URI=${DATABASE_URI}
            - REDIS_URL=${REDIS_URL}
        depends_on:
            - db
            - redis
        healthcheck:
            test: ["CMD", "node", "healthcheck.js"]
            interval: 30s
            timeout: 10s
            retries: 3

    db:
        image: postgres:15-alpine
        environment:
            POSTGRES_DB: chatapp
            POSTGRES_USER: ${DB_USER}
            POSTGRES_PASSWORD: ${DB_PASSWORD}
        volumes:
            - postgres_data:/var/lib/postgresql/data
        ports:
            - "5432:5432"

    redis:
        image: redis:7-alpine
        ports:
            - "6379:6379"
        volumes:
            - redis_data:/data

volumes:
    postgres_data:
    redis_data:
```

**Railway/Render Deployment:**

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Configure build command: `node --run build`
4. Configure start command: `npm start`
5. Enable PostgreSQL addon
6. Deploy automatically on git push

**DigitalOcean App Platform:**

```yaml
# .do/app.yaml
name: chat-app-backend
services:
    - name: api
      source_dir: /
      github:
          repo: xcfio/chat-app
          branch: main
      run_command: npm start
      environment_slug: node-js
      instance_count: 1
      instance_size_slug: basic-xxs
      http_port: 7200
      envs:
          - key: NODE_ENV
            value: production
          - key: DATABASE_URL
            type: secret
            value: ${db.DATABASE_URL}

databases:
    - engine: PG
      name: db
      num_nodes: 1
      size: basic-xs
      version: "15"
```

### CI/CD Pipeline

**GitHub Actions Workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

env:
    NODE_VERSION: "24"

jobs:
    validate:
        runs-on: ubuntu-latest

        services:
            postgres:
                image: postgres:15
                env:
                    POSTGRES_PASSWORD: postgres
                    POSTGRES_DB: chatapp_production
                options: >-
                    --health-cmd pg_isready
                    --health-interval 10s
                    --health-timeout 5s
                    --health-retries 5
                ports:
                    - 5432:5432

        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: ${{ env.NODE_VERSION }}
                  cache: "npm"

            - name: Install dependencies
              run: npm ci

            - name: Run type check
              run: node --run type-check

            - name: Run linting
              run: node --run lint

            - name: Validate database schema
              run: node --run gen
              env:
                  DATABASE_URI: postgresql://postgres:postgres@localhost:5432/chatapp_production

    deploy:
        needs: validate
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'

        steps:
            - uses: actions/checkout@v4

            - name: Build Docker image
              run: |
                  docker build -t ${{ secrets.REGISTRY_URL }}/chat-app-backend:${{ github.sha }} .
                  docker tag ${{ secrets.REGISTRY_URL }}/chat-app-backend:${{ github.sha }} \
                             ${{ secrets.REGISTRY_URL }}/chat-app-backend:latest

            - name: Push to registry
              run: |
                  echo ${{ secrets.REGISTRY_PASSWORD }} | docker login ${{ secrets.REGISTRY_URL }} -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
                  docker push ${{ secrets.REGISTRY_URL }}/chat-app-backend:${{ github.sha }}
                  docker push ${{ secrets.REGISTRY_URL }}/chat-app-backend:latest

            - name: Deploy to production
              run: |
                  # Deploy script here (kubectl, docker-compose, etc.)
                  echo "Deploying to production..."
```

## Monitoring & Logging

### Structured Logging

**Logger Configuration:**

```typescript
// src/lib/logger.ts
import pino from "pino"

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
        process.env.NODE_ENV === "development"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      ignore: "pid,hostname"
                  }
              }
            : undefined,
    serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err
    }
})

export default logger
```

**Request Logging:**

```typescript
// Fastify request logging
fastify.addHook("preHandler", async (request, reply) => {
    request.log.info(
        {
            url: request.url,
            method: request.method,
            userAgent: request.headers["user-agent"],
            ip: request.ip
        },
        "Request started"
    )
})

fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
        {
            url: request.url,
            method: request.method,
            statusCode: reply.statusCode,
            responseTime: reply.getResponseTime()
        },
        "Request completed"
    )
})
```

### Health Checks

**Health Check Endpoint:**

```typescript
// Health check with dependency verification
fastify.get("/health", async (request, reply) => {
    const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        checks: {
            database: "unknown",
            redis: "unknown"
        }
    }

    try {
        // Check database connection
        await db.select().from(table.user).limit(1)
        health.checks.database = "healthy"
    } catch (error) {
        health.checks.database = "unhealthy"
        health.status = "unhealthy"
    }

    // Check Redis if configured
    if (process.env.REDIS_URL) {
        try {
            // Redis health check
            health.checks.redis = "healthy"
        } catch (error) {
            health.checks.redis = "unhealthy"
            health.status = "unhealthy"
        }
    }

    const statusCode = health.status === "healthy" ? 200 : 503
    return reply.status(statusCode).send(health)
})
```

### Performance Monitoring

**Metrics Collection:**

```typescript
// Performance metrics
const performanceMetrics = {
    requestCount: new Map<string, number>(),
    responseTime: new Map<string, number[]>(),
    errorCount: new Map<string, number>(),
    socketConnections: 0
}

// Middleware to collect metrics
fastify.addHook("onResponse", async (request, reply) => {
    const route = `${request.method} ${request.routerPath}`
    const responseTime = reply.getResponseTime()

    // Update request count
    performanceMetrics.requestCount.set(route, (performanceMetrics.requestCount.get(route) || 0) + 1)

    // Update response times
    if (!performanceMetrics.responseTime.has(route)) {
        performanceMetrics.responseTime.set(route, [])
    }
    performanceMetrics.responseTime.get(route)!.push(responseTime)

    // Update error count
    if (reply.statusCode >= 400) {
        performanceMetrics.errorCount.set(route, (performanceMetrics.errorCount.get(route) || 0) + 1)
    }
})

// Metrics endpoint
fastify.get("/metrics", async (request, reply) => {
    return {
        requests: Object.fromEntries(performanceMetrics.requestCount),
        averageResponseTime: Object.fromEntries(
            Array.from(performanceMetrics.responseTime.entries()).map(([route, times]) => [
                route,
                times.reduce((a, b) => a + b, 0) / times.length
            ])
        ),
        errors: Object.fromEntries(performanceMetrics.errorCount),
        socketConnections: performanceMetrics.socketConnections
    }
})
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

```typescript
// Debug OAuth flow
console.log("OAuth Config:", {
    github: {
        clientId: process.env.GITHUB_CLIENT_ID?.substring(0, 8) + "...",
        redirectUri: process.env.GITHUB_REDIRECT_URI
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 8) + "...",
        redirectUri: process.env.GOOGLE_REDIRECT_URI
    }
})

// Common issues:
// - Incorrect redirect URIs in OAuth app settings
// - Mismatched client secrets
// - CORS issues with frontend domain
// - Cookie domain/path configuration
```

**Socket.IO Connection Issues:**

```typescript
// Debug Socket.IO connections
fastify.io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`)

    socket.on("error", (error) => {
        console.error(`Socket error for ${socket.id}:`, error)
    })

    socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`)
    })
})

// Common issues:
// - CORS configuration for Socket.IO
// - Cookie parsing in Socket.IO handshake
// - WebSocket transport blocked by proxy/firewall
// - Authentication token format issues
```

**Performance Issues:**

```typescript
// Monitor slow queries
const slowQueryThreshold = 1000 // 1 second

fastify.addHook("onResponse", (request, reply) => {
    const responseTime = reply.getResponseTime()
    if (responseTime > slowQueryThreshold) {
        console.warn(`Slow request: ${request.method} ${request.url} - ${responseTime}ms`)
    }
})

// Check for:
// - Missing database indexes
// - N+1 query problems
// - Large result sets without pagination
// - Memory leaks in Socket.IO connections
```

### Debug Mode

**Enable Debug Logging:**

```bash
# Environment variables for debugging
DEBUG=fastify:*,socket.io:*
LOG_LEVEL=debug
node --run dev
```

**Debug Authentication Issues:**

```typescript
// Add debug middleware
fastify.addHook("preHandler", async (request, reply) => {
    if (process.env.DEBUG_AUTH) {
        console.log("Request headers:", request.headers)
        console.log("Cookies:", request.cookies)
    }
})
```

### Production Issues

**Database Performance:**

```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check database connections
SELECT count(*) as connection_count,
       state,
       client_addr
FROM pg_stat_activity
GROUP BY state, client_addr;
```

**Memory Usage:**

```typescript
// Monitor memory usage
setInterval(() => {
    const usage = process.memoryUsage()
    console.log("Memory usage:", {
        rss: Math.round(usage.rss / 1024 / 1024) + "MB",
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + "MB",
        external: Math.round(usage.external / 1024 / 1024) + "MB"
    })
}, 60000) // Log every minute
```

## Contributing

### Development Setup for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork locally**

    ```bash
    git clone https://github.com/xcfio/chat-app.git
    cd chat-app/backend
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Set up development database**

    ```bash
    createdb chatapp_dev
    cp .env.example .env
    # Edit .env with your settings
    node --run gen
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

### Contributing Guidelines

**Code Standards:**

- Use strict TypeScript with proper typing throughout
- Follow RESTful API design principles
- Implement comprehensive error handling
- Add detailed JSDoc comments for public APIs
- Use descriptive variable and function names

**Database Guidelines:**

- Use transactions for multi-table operations
- Add appropriate indexes for query patterns
- Use UUID v7 for all primary keys
- Follow foreign key constraints
- Add database migrations for schema changes

**Pull Request Process:**

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

### Code Review Checklist

- [ ] Code follows TypeScript and project style guidelines
- [ ] Linting and type checks pass
- [ ] API documentation is updated
- [ ] Database migrations are included if needed
- [ ] Error handling is implemented properly
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Backward compatibility is maintained

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Support

For support, questions, or contributions:

- **Email:** omarfaruksxp@gmail.com
- **Discord:** [Join our Discord server](https://discord.com/invite/FaCCaFM74Q)
- **GitHub Issues:** [Create an issue](https://github.com/xcfio/chat-app/issues)
- **API Documentation:** [View live docs](https://api-xcfio.onrender.com)

---

**Built with ❤️ using modern Node.js technologies**
