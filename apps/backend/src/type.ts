import { Type } from "@sinclair/typebox"
import { Server } from "socket.io"

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => void
        io: Server
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string
            COOKIE_SECRET: string
            JWT_SECRET: string

            // Github auth
            GITHUB_CLIENT_ID: string
            GITHUB_CLIENT_SECRET: string
            // Google auth
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
        }
    }
}

export const ErrorResponse = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
    details: Type.Optional(Type.Any())
})

export type UserStatus = "online" | "offline"
export type OAuthProvider = "github" | "google"

export interface AuthUser {
    id: string
    email: string
    username: string
    avatar?: string
}

export interface JWTPayload {
    sub: string
    email: string
    username: string
    iat: number
    exp: number
}

export interface User {
    id: string
    oauthProvider: OAuthProvider
    oauthId: string
    email: string
    username: string
    name?: string
    avatar?: string
    status: UserStatus
    lastSeen: Date
    createdAt: Date
}

export interface Message {
    id: string
    content: string
    senderId: string
    receiverId: string
    createdAt: Date
    sender: User
}

export interface Conversation {
    id: string
    participants: [User, User]
    lastMessage?: Message
    updatedAt: Date
}

export interface ServerToClientEvents {
    new_message: (message: Message) => void
    user_status_changed: (userId: string, status: UserStatus) => void
    error: (error: { message: string; code: string }) => void
}

export interface ClientToServerEvents {
    send_message: (content: string, receiverId: string) => void
    update_status: (status: UserStatus) => void
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}
