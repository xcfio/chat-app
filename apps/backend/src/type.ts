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

            GITHUB_CLIENT_ID: string
            GITHUB_CLIENT_SECRET: string

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
export type MessageStatus = "sent" | "delivered" | "read"
export type OAuthProvider = "github" | "google"

export interface AuthUser {
    id: string
    email: string
    username: string
    avatar?: string
}

export interface JWTPayload {
    id: string
    email: string
    username: string
    name: string | null
    avatar: string | null
    token: string
    iat: number
    exp: number
}

export interface User {
    id: string
    type: OAuthProvider
    token: string
    email: string
    username: string
    name: string | null
    avatar: string | null
    status: UserStatus
    lastSeen: Date
    createdAt: Date
}

export interface Message {
    id: string
    content: string
    status: MessageStatus
    createdAt: Date
    sender: User["id"]
    receiver: User["id"]
}

export interface Conversation {
    id: string
    participants: [User["id"], User["id"]]
    lastMessage?: Message["id"]
    updatedAt: Date
}

export interface ServerToClientEvents {
    new_message: (message: Message) => void
    message_read: (messageId: string) => void
    user_status_changed: (userId: string, status: UserStatus) => void
    user_typing: (userId: string, isTyping: boolean) => void
    error: (error: { message: string; code: string }) => void
}

export interface ClientToServerEvents {
    send_message: (receiverId: string, content: string) => void
    mark_message_read: (messageId: string) => void
    update_status: (status: UserStatus) => void
    start_typing: (receiverId: string) => void
    stop_typing: (receiverId: string) => void
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}
