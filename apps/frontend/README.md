# Chat App Frontend

A modern, real-time chat application built with Next.js 15, TypeScript, Mantine UI, Socket.IO, and Tailwind CSS. This frontend provides a seamless messaging experience with OAuth authentication, real-time communication, and a responsive design.

## 🚀 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Component Documentation](#-component-documentation)
- [State Management](#-state-management)
- [Real-time Features](#-real-time-features)
- [Authentication Flow](#-authentication-flow)
- [Performance Optimizations](#-performance-optimizations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Messaging Features

- **Real-time messaging** with instant delivery
- **Message editing and deletion** with live updates
- **Message status tracking** (sent, delivered, read)
- **Typing indicators** to show when users are composing messages
- **Message search** across conversations
- **File attachments** support (planned)
- **Message reactions** (planned)

### User Management

- **OAuth Authentication** via GitHub and Google
- **User search** to find and connect with other users
- **User profiles** with avatars and display names
- **Online/offline status** tracking
- **User presence** indicators

### Conversation Management

- **Create new conversations** with any user
- **Delete conversations** with confirmation
- **Conversation list** with last message preview
- **Unread message counts** (backend support required)
- **Conversation search** and filtering

### User Interface

- **Responsive design** that works on desktop and mobile
- **Dark/light theme** support via Mantine
- **Accessibility compliant** with ARIA labels and keyboard navigation
- **Modern UI components** with smooth animations
- **Message bubbles** with proper alignment and styling
- **Avatar integration** throughout the interface

### Real-time Features

- **WebSocket connections** for instant updates
- **Live typing indicators**
- **Real-time message delivery**
- **Online status synchronization**
- **Automatic reconnection** handling

## 🛠 Technology Stack

### Frontend Framework

- **Next.js 15** - React framework with App Router
- **React 18** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript development

### UI & Styling

- **Mantine UI v7** - Modern React components library
- **Tailwind CSS v3** - Utility-first CSS framework
- **@tabler/icons-react** - Comprehensive icon library
- **@emotion/react** - CSS-in-JS library for Mantine

### Real-time Communication

- **Socket.IO Client v4** - Real-time bidirectional communication
- **WebSocket** - Underlying transport protocol

### HTTP Client & State

- **Axios** - Promise-based HTTP client
- **React Context** - Built-in state management
- **React Hooks** - Modern state and effect management

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS preprocessing
- **Autoprefixer** - CSS vendor prefixing

## 🏗 Architecture Overview

### Component Architecture

The application follows a modular component architecture with clear separation of concerns:

```
├── Layout Components (App-wide wrappers)
├── Provider Components (Context providers)
├── Page Components (Route handlers)
├── UI Components (Reusable components)
└── Utility Components (Helpers and hooks)
```

### Data Flow

1. **Authentication Layer**: OAuth providers → JWT tokens → User context
2. **API Layer**: REST endpoints for CRUD operations
3. **WebSocket Layer**: Real-time event handling
4. **State Management**: React Context + Local state
5. **UI Layer**: Mantine components + Custom styling

### Real-time Architecture

- **Socket.IO Client** connects to backend on authentication
- **Event listeners** handle incoming messages and status updates
- **Event emitters** send user actions (typing, status changes)
- **Automatic reconnection** maintains connection stability

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18.17 or higher
- **npm** 9.0 or higher (or yarn/pnpm equivalent)
- **Backend API** running on configured endpoint

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/your-username/chat-app-frontend.git
cd chat-app-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative Package Managers

**Using Yarn:**

```bash
yarn install
yarn dev
```

**Using pnpm:**

```bash
pnpm install
pnpm dev
```

### Docker Setup (Optional)

**Development:**

```bash
docker build -t chat-app-frontend .
docker run -p 3000:3000 chat-app-frontend
```

**Production:**

```bash
docker build -t chat-app-frontend --target production .
docker run -p 3000:3000 chat-app-frontend
```

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID

# Optional: Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional: Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

### Environment-Specific Configurations

**Development (.env.local):**

```bash
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true
```

**Production (.env.production):**

```bash
NEXT_PUBLIC_API_ENDPOINT=https://api.yourapp.com
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
```

**Staging (.env.staging):**

```bash
NEXT_PUBLIC_API_ENDPOINT=https://staging-api.yourapp.com
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_DEBUG=false
```

## 📁 Project Structure

```
chat-app-frontend/
├── public/                      # Static assets
│   ├── favicon.ico
│   └── images/
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── auth/               # Authentication pages
│   │   │   └── page.tsx        # OAuth callback handling
│   │   ├── chat/               # Chat application
│   │   │   ├── [id]/          # Individual conversation
│   │   │   │   └── page.tsx   # Conversation page
│   │   │   └── page.tsx       # Chat home page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/             # React components
│   │   ├── providers/         # Context providers
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── MantineProvider.tsx
│   │   │   └── SocketProvider.tsx
│   │   └── ui/                # UI components
│   │       ├── AuthButtons.tsx
│   │       ├── ChatList.tsx
│   │       ├── ChatWindow.tsx
│   │       ├── MessageInput.tsx
│   │       ├── MessageList.tsx
│   │       └── UserSearch.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   └── useSocket.ts
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts             # API client configuration
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── socket.ts          # Socket.IO configuration
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── utils.ts           # General utilities
│   └── styles/                 # Additional stylesheets
├── .env.example                # Environment template
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Docker configuration
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
├── README.md                  # This file
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

### Key Directories Explained

**`src/app/`** - Next.js App Router pages following the file-system routing convention

**`src/components/`** - Reusable React components organized by function

- `providers/` - Context providers for global state management
- `ui/` - User interface components

**`src/lib/`** - Utility libraries and configurations

- `api.ts` - Axios configuration and API endpoint definitions
- `types.ts` - TypeScript interfaces matching the backend API
- `socket.ts` - Socket.IO client configuration

**`src/hooks/`** - Custom React hooks for shared logic

## 🔌 API Integration

### REST API Endpoints

The application integrates with the following API endpoints:

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

### API Client Configuration

The API client is configured in `src/lib/api.ts` with the following features:

- **Automatic cookie handling** for authentication
- **Base URL configuration** from environment variables
- **Response/request interceptors** for error handling
- **TypeScript interfaces** for all endpoints
- **Centralized error handling**

Example usage:

```typescript
import { auth, users, conversations, messages } from "@/lib/api"

// Get current user
const userResponse = await auth.me()

// Search users
const searchResults = await users.search("john")

// Send message
const newMessage = await messages.send(conversationId, "Hello!")
```

### Error Handling

The API client includes comprehensive error handling:

```typescript
// Automatic retry for network errors
// User-friendly error messages
// Authentication error redirects
// Rate limiting handling
```

## 🧩 Component Documentation

### Provider Components

#### AuthProvider

Manages user authentication state and provides methods for login/logout.

```typescript
interface AuthContextType {
    user: User | null
    loading: boolean
    login: (provider: "github" | "google") => void
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}
```

**Usage:**

```typescript
const { user, login, logout } = useAuth()
```

#### SocketProvider

Handles WebSocket connection and provides real-time communication methods.

```typescript
interface SocketContextType {
    socket: Socket | null
    connected: boolean
    updateStatus: (status: UserStatus) => void
    startTyping: (chatId: string) => void
    stopTyping: (chatId: string) => void
}
```

**Usage:**

```typescript
const { socket, connected, startTyping } = useSocket()
```

#### MantineProvider

Configures Mantine UI theme and provides notifications.

### UI Components

#### ChatList

Displays a list of user conversations with previews and metadata.

**Props:**

```typescript
interface ChatListProps {
    selectedChatId?: string
    onChatSelect: (chatId: string) => void
    refreshTrigger?: number
}
```

**Features:**

- Conversation preview with last message
- Unread message indicators
- Conversation deletion
- Real-time updates

#### ChatWindow

Main chat interface for individual conversations.

**Props:**

```typescript
interface ChatWindowProps {
    conversationId: string
    otherUserId: string
}
```

**Features:**

- Message history display
- Real-time message updates
- Message composition area
- User information header

#### MessageList

Displays messages within a conversation with proper formatting.

**Props:**

```typescript
interface MessageListProps {
    conversationId: string
    otherUser: User
    onEditMessage: (message: Message) => void
}
```

**Features:**

- Message bubbles with timestamps
- Edit/delete message options
- Message status indicators
- Typing indicators
- Auto-scrolling to new messages

#### MessageInput

Text input component for composing and sending messages.

**Props:**

```typescript
interface MessageInputProps {
    conversationId: string
    editingMessage?: Message | null
    onCancelEdit: () => void
}
```

**Features:**

- Message composition with character limit
- Edit mode for existing messages
- Send button with loading state
- Typing indicator emission

#### UserSearch

Modal component for searching and starting conversations with users.

**Props:**

```typescript
interface UserSearchProps {
    onConversationCreated: (conversationId: string) => void
}
```

**Features:**

- Real-time user search
- User profile display
- Conversation creation
- Error handling

#### AuthButtons

Landing page component with OAuth login options.

**Features:**

- GitHub OAuth login
- Google OAuth login
- Responsive design
- Loading states

## 🔄 State Management

### Context-Based Architecture

The application uses React Context for global state management:

```typescript
// Authentication state
AuthContext -> User session, login/logout methods

// Socket connection state
SocketContext -> WebSocket connection, real-time methods

// Theme and UI state
MantineProvider -> Theme configuration, notifications
```

### Local State Management

Components use React hooks for local state:

```typescript
// Component state
const [messages, setMessages] = useState<Message[]>([])
const [loading, setLoading] = useState(false)

// Form state
const [message, setMessage] = useState("")
const [editing, setEditing] = useState<Message | null>(null)

// UI state
const [searchQuery, setSearchQuery] = useDebouncedState("", 300)
```

### State Synchronization

Real-time state synchronization is handled through Socket.IO events:

```typescript
// Incoming events update local state
socket.on("new_message", (message) => {
    setMessages((prev) => [...prev, message])
})

// Outgoing events emit user actions
socket.emit("typing", conversationId, true)
```

## ⚡ Real-time Features

### WebSocket Events

#### Server to Client Events

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

#### Client to Server Events

```typescript
interface ClientToServerEvents {
    update_status: (status: UserStatus) => void
    typing: (chatId: string, isTyping: boolean) => void
}
```

### Connection Management

```typescript
// Automatic connection on authentication
useEffect(() => {
    if (user) {
        const socket = io(API_ENDPOINT, {
            withCredentials: true,
            transports: ["websocket"]
        })

        socket.on("connect", () => {
            socket.emit("update_status", "online")
        })

        return () => {
            socket.emit("update_status", "offline")
            socket.disconnect()
        }
    }
}, [user])
```

### Real-time Features Implementation

**Live Typing Indicators:**

- Emit typing events on input change
- Display typing indicator for other users
- Auto-hide after timeout

**Message Status Updates:**

- Show delivery confirmation
- Update read receipts
- Handle message editing/deletion

**Presence Management:**

- Track online/offline status
- Update on window focus/blur
- Handle connection drops

## 🔐 Authentication Flow

### OAuth Integration

#### GitHub OAuth Flow

1. User clicks GitHub login button
2. Redirect to `/auth/github` endpoint
3. Backend redirects to GitHub OAuth
4. GitHub redirects to `/auth/github/callback`
5. Backend processes callback and sets cookie
6. Frontend redirect to `/auth` page
7. Frontend calls `/auth/me` to get user data
8. User redirected to chat interface

#### Google OAuth Flow

1. User clicks Google login button
2. Redirect to `/auth/google` endpoint
3. Backend redirects to Google OAuth
4. Google redirects to `/auth/google/callback`
5. Backend processes callback and sets cookie
6. Frontend redirect to `/auth` page
7. Frontend calls `/auth/me` to get user data
8. User redirected to chat interface

### Authentication State Management

```typescript
// Check authentication on app load
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

### Protected Routes

```typescript
// Route protection in page components
useEffect(() => {
    if (!loading && !user) {
        router.push("/")
    }
}, [user, loading, router])
```

### Session Management

- **Automatic session refresh** on API errors
- **Logout cleanup** of local state and WebSocket connections
- **Cookie-based authentication** with HTTP-only cookies

## ⚡ Performance Optimizations

### Code Splitting

- **Automatic code splitting** with Next.js dynamic imports
- **Component-level splitting** for better load times
- **Route-based splitting** through App Router

### Bundle Optimization

```javascript
// next.config.js optimizations
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
    },
    images: {
        domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"]
    }
}
```

### Component Optimization

- **React.memo** for expensive components
- **useMemo/useCallback** for expensive computations
- **Debounced search** to reduce API calls

### Real-time Optimization

- **Event listener cleanup** to prevent memory leaks
- **Throttled typing indicators** to reduce event spam
- **Connection pooling** for Socket.IO

### Asset Optimization

- **Image optimization** with Next.js Image component
- **Font optimization** with Next.js font system
- **CSS optimization** with PostCSS and Tailwind

## 🧪 Testing

### Testing Setup

**Install testing dependencies:**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Jest configuration (jest.config.js):**

```javascript
const nextJest = require("next/jest")

const createJestConfig = nextJest({
    dir: "./"
})

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testEnvironment: "jest-environment-jsdom"
}

module.exports = createJestConfig(customJestConfig)
```

### Component Testing

**Example component test:**

```typescript
// components/ui/__tests__/MessageList.test.tsx
import { render, screen } from '@testing-library/react'
import { MessageList } from '../MessageList'

describe('MessageList', () => {
  const mockProps = {
    conversationId: 'test-id',
    otherUser: mockUser,
    onEditMessage: jest.fn(),
  }

  it('renders messages correctly', () => {
    render(<MessageList {...mockProps} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })
})
```

### Integration Testing

**API integration tests:**

```typescript
// lib/__tests__/api.test.ts
import { messages } from "../api"

describe("API Client", () => {
    it("sends messages correctly", async () => {
        const response = await messages.send("conv-id", "test message")
        expect(response.data).toHaveProperty("id")
    })
})
```

### E2E Testing

**Playwright setup:**

```bash
npm install --save-dev @playwright/test
```

**Example E2E test:**

```typescript
// tests/chat.spec.ts
import { test, expect } from "@playwright/test"

test("user can send message", async ({ page }) => {
    await page.goto("/chat")
    await page.fill('[placeholder="Type a message..."]', "Hello world")
    await page.click('[type="submit"]')
    await expect(page.locator("text=Hello world")).toBeVisible()
})
```

### Testing Scripts

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:e2e": "playwright test",
        "test:e2e:ui": "playwright test --ui"
    }
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

**Automatic deployment:**

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

**Manual deployment:**

```bash
npm install -g vercel
vercel --prod
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build application
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Netlify Deployment

**Build configuration:**

```toml
# netlify.toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment-Specific Deployments

**Staging deployment:**

```bash
# Set staging environment variables
export NEXT_PUBLIC_API_ENDPOINT=https://staging-api.yourapp.com
npm run build
npm start
```

**Production deployment:**

```bash
# Set production environment variables
export NEXT_PUBLIC_API_ENDPOINT=https://api.yourapp.com
npm run build
npm start
```

### CI/CD Pipeline

**GitHub Actions example:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3

            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: "18"
                  cache: "npm"

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              run: npm test

            - name: Build application
              run: npm run build
              env:
                  NEXT_PUBLIC_API_ENDPOINT: ${{ secrets.API_ENDPOINT }}

            - name: Deploy to Vercel
              run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🔧 Troubleshooting

### Common Issues

#### Socket Connection Problems

**Problem:** Socket.IO connection fails or drops frequently

**Solutions:**

```typescript
// 1. Check network connectivity
// 2. Verify API endpoint configuration
// 3. Check CORS settings on backend
// 4. Enable transport fallbacks

const socket = io(API_ENDPOINT, {
    withCredentials: true,
    transports: ["websocket", "polling"], // Add polling fallback
    timeout: 20000,
    retries: 3
})
```

#### Authentication Issues

**Problem:** OAuth login redirects fail or user session not maintained

**Solutions:**

```typescript
// 1. Verify OAuth app configuration
// 2. Check cookie domain settings
// 3. Ensure HTTPS in production
// 4. Verify callback URLs

// Debug authentication
console.log("Current user:", user)
console.log("Loading state:", loading)
```

#### Build Errors

**Problem:** Next.js build fails with TypeScript or import errors

**Solutions:**

```bash
# 1. Clear Next.js cache
rm -rf .next
npm run build

# 2. Check TypeScript configuration
npx tsc --noEmit

# 3. Verify import paths
# Use absolute imports with @/ prefix
```

#### Performance Issues

**Problem:** App loads slowly or consumes excessive memory

**Solutions:**

```typescript
// 1. Implement component memoization
const MessageList = React.memo(({ messages }) => {
  return <div>{/* render messages */}</div>
})

// 2. Add loading states
const [loading, setLoading] = useState(true)

// 3. Implement pagination
const loadMoreMessages = useCallback(async () => {
  // Implement infinite scroll
}, [])
```

### Debug Mode

**Enable debug logging:**

```bash
# Development
NEXT_PUBLIC_DEBUG=true npm run dev

# Check console for debug information
```

**Socket.IO debugging:**

```typescript
// Enable Socket.IO debug mode
import { io } from "socket.io-client"

const socket = io(API_ENDPOINT, {
    withCredentials: true,
    forceNew: true
})

// Monitor connection events
socket.on("connect", () => console.log("Connected"))
socket.on("disconnect", () => console.log("Disconnected"))
socket.on("error", (error) => console.error("Socket error:", error))
```

### Performance Monitoring

**Add performance monitoring:**

```typescript
// Monitor API response times
api.interceptors.response.use((response) => {
    console.log(`${response.config.method?.toUpperCase()} ${response.config.url}: ${response.duration}ms`)
    return response
})

// Monitor component render times
const ProfiledComponent = React.profiler(YourComponent, (id, phase, actualDuration) => {
    console.log(`${id} (${phase}): ${actualDuration}ms`)
})
```

### Log Analysis

**Structured logging:**

```typescript
const logger = {
    info: (message: string, data?: any) => {
        console.log(`[INFO] ${message}`, data)
    },
    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${message}`, error)
    },
    debug: (message: string, data?: any) => {
        if (process.env.NEXT_PUBLIC_DEBUG) {
            console.log(`[DEBUG] ${message}`, data)
        }
    }
}
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Clone your fork**

```bash
git clone https://github.com/your-username/chat-app-frontend.git
```

3. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

4. **Install dependencies**

```bash
npm install
```

5. **Start development server**

```bash
npm run dev
```

### Code Standards

#### TypeScript Guidelines

- Use strict typing throughout the codebase
- Define interfaces for all props and API responses
- Use enums for constant values
- Implement proper error handling with typed exceptions

#### Component Guidelines

- Use functional components with hooks
- Implement proper prop validation
- Follow consistent naming conventions
- Add comprehensive JSDoc comments

#### Style Guidelines

- Use Tailwind utility classes for styling
- Follow Mantine component patterns
- Maintain consistent spacing and sizing
- Implement responsive design principles

### Commit Guidelines

**Use Conventional Commits:**

```bash
feat: add message editing functionality
fix: resolve socket connection timeout
docs: update API integration guide
style: format message input component
refactor: optimize message list rendering
test: add unit tests for auth provider
```

### Pull Request Process

1. **Update documentation** for any new features
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md**
5. **Request code review**

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Proper error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Accessibility guidelines are followed
- [ ] Security best practices are implemented

## 📄 License

MIT License

Copyright (c) 2024 Chat App Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 Support

For support, please contact:

- **Email**: omarfaruksxp@gmail.com
- **Discord**: [Join our Discord server](https://discord.com/invite/FaCCaFM74Q)
- **GitHub Issues**: [Create an issue](https://github.com/your-username/chat-app-frontend/issues)

---

**Made with ❤️ by the Chat App Team**
