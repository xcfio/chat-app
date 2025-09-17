// src/lib/types.ts
export type UserStatus = "online" | "offline"
export type OAuthProvider = "github" | "google"
export type MessageStatus = "sent" | "delivered" | "read" | "deleted"

export interface User {
    id: string
    email: string
    username: string
    name: string | null
    avatar: string | null
    createdAt: string
}

export interface Message {
    id: string
    content: string
    sender: string
    conversation: string
    status: MessageStatus
    createdAt: string
    editedAt: string | null
}

export interface Conversation {
    id: string
    p1: string
    p2: string
    createdAt: string
    updatedAt: string
}

export interface JWTPayload {
    id: string
    email: string
    username: string
    name: string | null
    avatar: string | null
    type: OAuthProvider
    token: string
    iat: number
    exp: number
}

export interface ServerToClientEvents {
    new_message: (message: Message) => void
    message_deleted: (data: { messageId: string; conversationId: string }) => void
    message_edited: (data: { messageId: string; content: string; editedAt: string; conversationId: string }) => void
    user_status_changed: (userId: string, status: UserStatus) => void
    user_typing: (userId: string, isTyping: boolean) => void
    error: (error: { message: string; code: string }) => void
}

export interface ClientToServerEvents {
    update_status: (status: UserStatus) => void
    typing: (chatId: string, isTyping: boolean) => void
}
