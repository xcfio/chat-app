# Chat App Backend

A production-ready, enterprise-grade real-time chat application backend built with modern TypeScript technologies, featuring OAuth authentication, real-time messaging, and comprehensive API documentation.

## Architecture Overview

This backend implements a **RESTful API** with **WebSocket support** for real-time features, designed with type safety and scalability in mind. The application follows modern architectural patterns with separation of concerns, comprehensive error handling, and robust security measures.

### Core Features

- **Real-time bidirectional communication** with Socket.IO for instant messaging and presence
- **OAuth 2.0 authentication** with GitHub and Google providers for secure user access
- **Type-safe development** with TypeScript, TypeBox schemas, and comprehensive validation
- **PostgreSQL persistence** with Drizzle ORM for reliable data storage and queries
- **Interactive API documentation** with Swagger UI and OpenAPI 3.1.1 specification
- **Production security** with rate limiting, CORS, JWT tokens, and error handling
- **Message lifecycle management** with delivery status tracking and editing capabilities
- **Advanced search functionality** across users and message content
- **User presence system** with online/offline status and typing indicators

## Technology Stack

### Backend Framework

- **Fastify 5.6.0** - High-performance web framework with built-in validation
- **TypeScript** - Type-safe JavaScript with modern ES features
- **Socket.IO 4.8.1** - Real-time WebSocket communication engine

### Database & ORM

- **PostgreSQL** - Robust relational database for data persistence
- **Drizzle ORM 0.44.5** - Type-safe database toolkit with migration support
- **UUID v7** - Time-ordered unique identifiers for all entities

### Authentication & Security

- **JWT tokens** - Stateless authentication with secure cookie storage
- **OAuth 2.0** - GitHub and Google provider integration
- **Rate limiting** - Protection against abuse and spam
- **CORS configuration** - Secure cross-origin resource sharing

### Validation & Documentation

- **TypeBox** - Runtime type validation and schema generation
- **Swagger UI** - Interactive API documentation and testing
- **OpenAPI 3.1.1** - Comprehensive API specification

## Database Schema

### User Model

```typescript
{
  id: string,           // UUID v7 format
  email: string,        // OAuth provider email
  username: string,     // Unique username
  name: string | null,  // Optional display name
  avatar: string | null,// Profile image URL
  createdAt: string     // ISO timestamp
}
```

### Message Model

```typescript
{
  id: string,           // UUID v7 format
  content: string,      // Max 2000 characters
  sender: string,       // User UUID
  conversation: string, // Conversation UUID
  status: "sent" | "delivered" | "read" | "deleted",
  createdAt: string,    // ISO timestamp
  editedAt: string | null // Edit timestamp
}
```

### Conversation Model

```typescript
{
  id: string,           // UUID v7 format
  p1: string,          // First participant UUID
  p2: string,          // Second participant UUID
  createdAt: string,   // ISO timestamp
  updatedAt: string    // Last message timestamp
}
```

## Installation & Setup

### Prerequisites

- **Node.js 18+** - Runtime environment
- **PostgreSQL 14+** - Database server
- **GitHub OAuth App** - For GitHub authentication
- **Google OAuth App** - For Google authentication

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/xcfio/chat-app.git
cd chat-app/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Configure your .env file (see below)

# Generate database schema
npm run gen

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with the following variables :

```env
# Application Environment
NODE_ENV=development

# Database Configuration
DATABASE_URI=postgresql://username:password@localhost:5432/chatapp

# Security Secrets
COOKIE_SECRET=your-secure-cookie-secret-key
JWT_SECRET=your-secure-jwt-secret-key

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-app-client-id
GITHUB_CLIENT_SECRET=your-github-app-client-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-app-client-id
GOOGLE_CLIENT_SECRET=your-google-app-client-secret
```

## Development Scripts

```bash
# Development with hot reload and file watching
npm run dev

# Production server (requires build)
npm start

# TypeScript compilation check (no output)
npm test

# Database studio UI (accessible at http://localhost:4000)
npm run db

# Generate new database migrations
npm run gen
```

## API Documentation

### Authentication Endpoints

The application uses **OAuth 2.0 flow** with state-based CSRF protection :

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| `GET`  | `/auth/github`          | Initiate GitHub OAuth login     |
| `GET`  | `/auth/github/callback` | Handle GitHub OAuth callback    |
| `GET`  | `/auth/google`          | Initiate Google OAuth login     |
| `GET`  | `/auth/google/callback` | Handle Google OAuth callback    |
| `GET`  | `/auth/me`              | Get current authenticated user  |
| `POST` | `/auth/refresh`         | Refresh user data from provider |
| `POST` | `/auth/logout`          | Clear authentication session    |

### User Management

User discovery and profile management with pagination support :

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| `GET`  | `/user`     | List all users (paginated) |
| `GET`  | `/user/:id` | Get specific user profile  |

### Conversation Management

Direct messaging conversation lifecycle :

| Method   | Endpoint             | Description                          |
| -------- | -------------------- | ------------------------------------ |
| `GET`    | `/conversations`     | Get user's conversations (paginated) |
| `POST`   | `/conversations/:id` | Create conversation with user        |
| `GET`    | `/conversations/:id` | Get conversation details             |
| `DELETE` | `/conversations/:id` | Delete conversation                  |

### Message Operations

Comprehensive message lifecycle with status tracking :

| Method   | Endpoint                      | Description               |
| -------- | ----------------------------- | ------------------------- |
| `GET`    | `/conversations/:id/messages` | Get conversation messages |
| `POST`   | `/conversations/:id/messages` | Send new message          |
| `PATCH`  | `/messages/:id`               | Edit existing message     |
| `DELETE` | `/messages/:id`               | Delete message            |
| `PUT`    | `/messages/:id/read`          | Mark message as read      |

### Search Functionality

Advanced search across users and message content :

| Method | Endpoint           | Description                          |
| ------ | ------------------ | ------------------------------------ |
| `GET`  | `/search/users`    | Search users by username/email       |
| `GET`  | `/search/messages` | Search messages across conversations |

## WebSocket Events

### Real-time Communication

The Socket.IO implementation provides bidirectional real-time communication :

#### Server → Client Events

```typescript
{
  new_message: (message: Message) => void,
  message_deleted: (data: { messageId: string, conversationId: string }) => void,
  message_edited: (data: { messageId: string, content: string, editedAt: string }) => void,
  user_status_changed: (userId: string, status: "online" | "offline") => void,
  user_typing: (userId: string, isTyping: boolean) => void,
  error: (error: { message: string, code: string }) => void
}
```

#### Client → Server Events

```typescript
{
  update_status: (status: "online" | "offline") => void,
  typing: (chatId: string, isTyping: boolean) => void
}
```

## Message Status Lifecycle

Messages follow a **comprehensive status tracking system** :

1. **`sent`** - Message created and stored in database
2. **`delivered`** - Message received by recipient's client
3. **`read`** - Message opened and viewed by recipient
4. **`deleted`** - Message removed by sender or recipient

## Security Features

### Authentication Security

- **JWT tokens** with expiration and refresh capabilities
- **Secure HTTP-only cookies** for token storage
- **OAuth state parameter** for CSRF protection
- **Rate limiting** on all endpoints to prevent abuse

### Data Validation

- **TypeBox schemas** for runtime validation of all inputs
- **UUID v7 format** validation for all entity identifiers
- **Content length limits** (2000 characters for messages)
- **Email pattern validation** for user accounts

### Error Handling

- **Standardized error responses** with consistent format
- **HTTP status code mapping** for different error types
- **Detailed error messages** for debugging and user feedback

## Development Tools

### Database Management

- **Drizzle Studio** - Visual database explorer at `http://localhost:4000`
- **Migration system** - Version-controlled schema changes
- **Type-safe queries** - Compile-time query validation

### API Testing

- **Swagger UI** - Interactive documentation at `/documentation`
- **OpenAPI 3.1.1** - Complete API specification
- **Example requests** - Pre-configured API examples

## Production Deployment

### Performance Considerations

- **Fastify framework** - High-performance HTTP server
- **Connection pooling** - Efficient database connections
- **Rate limiting** - Protection against traffic spikes
- **CORS configuration** - Optimized for production domains

### Monitoring & Logging

- **Structured error responses** - Consistent error format
- **HTTP status codes** - Proper status code usage
- **Request validation** - Input sanitization and validation

## Project Information

**Author**: Omar Faruk (omarfaruksxp@gmail.com)
**License**: MIT License
**Version**: 1.0.0

### Support Channels

- **Email Support**: omarfaruksxp@gmail.com
- **Community Discord**: https://discord.com/invite/FaCCaFM74Q
- **Issue Tracking**: https://github.com/xcfio/chat-app/issues

### Repository

**GitHub**: https://github.com/xcfio/chat-app
