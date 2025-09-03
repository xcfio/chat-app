import { Server as SocketIOServer } from "socket.io"
import { Type } from "@sinclair/typebox"

declare module "fastify" {
    interface FastifyInstance {
        io: SocketIOServer
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            DATABASE_URI: string
            COOKIE_SECRET: string
            JWT_SECRET: string

            // Discord auth
            DISCORD_CLIENT_ID: string
            DISCORD_CLIENT_SECRET: string

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

export interface User {
    id: string
    oauthProvider: "discord" | "github" | "google"
    oauthId: string
    email: string
    username: string
    displayName: string
    avatar: string
    status: UserStatus
    lastSeen: Date
    isOnline: boolean
    createdAt: Date
    updatedAt: Date
}

export type UserStatus = "online" | "offline"

export interface UserProfile {
    id: string
    username: string
    displayName: string
    avatar?: string
    status: UserStatus
    isOnline: boolean
    lastSeen: Date
}

export interface Message {
    id: string
    content: string
    senderId: string
    roomId: string
    type: MessageType
    attachments?: Attachment[]
    replyTo?: string
    editedAt?: Date
    deletedAt?: Date
    createdAt: Date
    sender: UserProfile
}

export type MessageType = "text" | "image" | "file" | "system"

export interface Attachment {
    id: string
    messageId: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    uploadthingKey: string
    createdAt: Date
}

export interface Room {
    id: string
    name: string
    description?: string
    type: RoomType
    isPrivate: boolean
    ownerId: string
    avatar?: string
    memberCount: number
    lastMessage?: Message
    lastActivity: Date
    createdAt: Date
    updatedAt: Date
}

export type RoomType = "direct" | "group" | "channel"

export interface RoomMember {
    id: string
    roomId: string
    userId: string
    role: MemberRole
    joinedAt: Date
    lastReadAt?: Date
    user: UserProfile
}

export type MemberRole = "owner" | "admin" | "moderator" | "member"

export interface ServerToClientEvents {
    new_message: (message: Message) => void
    message_edited: (message: Message) => void
    message_deleted: (messageId: string) => void
    user_joined: (user: UserProfile, roomId: string) => void
    user_left: (userId: string, roomId: string) => void
    user_typing: (userId: string, roomId: string) => void
    user_stopped_typing: (userId: string, roomId: string) => void
    user_status_changed: (userId: string, status: UserStatus) => void
    room_updated: (room: Room) => void
    error: (error: { message: string; code: string }) => void
}

export interface ClientToServerEvents {
    join_room: (roomId: string) => void
    leave_room: (roomId: string) => void
    send_message: (data: SendMessageData) => void
    edit_message: (messageId: string, content: string) => void
    delete_message: (messageId: string) => void
    start_typing: (roomId: string) => void
    stop_typing: (roomId: string) => void
    update_status: (status: UserStatus) => void
}

export interface SendMessageData {
    content: string
    roomId: string
    type: MessageType
    replyTo?: string
    attachments?: {
        filename: string
        uploadthingKey: string
        mimeType: string
        size: number
    }[]
}

export interface CreateRoomData {
    name: string
    description?: string
    type: RoomType
    isPrivate: boolean
    memberIds?: string[]
}

export interface JoinRoomData {
    roomId: string
    inviteCode?: string
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: {
        message: string
        code: string
        details?: any
    }
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        hasMore: boolean
    }
}

export interface AuthUser {
    id: string
    email: string
    email_verified: boolean
    username?: string
    picture?: string
    sub: string
}

export interface JWTPayload {
    sub: string
    email: string
    username: string
    iat: number
    exp: number
}

export interface DatabaseUser {
    id: string
    auth0Id: string
    email: string
    username: string
    displayName: string
    avatar?: string
    status: UserStatus
    lastSeen: Date
    createdAt: Date
    updatedAt: Date
}

export interface DatabaseMessage {
    id: string
    content: string
    senderId: string
    roomId: string
    type: MessageType
    replyToId?: string
    editedAt?: Date
    deletedAt?: Date
    createdAt: Date
}

export interface DatabaseRoom {
    id: string
    name: string
    description?: string
    type: RoomType
    isPrivate: boolean
    ownerId: string
    avatar?: string
    inviteCode?: string
    createdAt: Date
    updatedAt: Date
}

export interface MessageListProps {
    messages: Message[]
    currentUserId: string
    onEditMessage: (messageId: string, content: string) => void
    onDeleteMessage: (messageId: string) => void
    onReplyMessage: (message: Message) => void
}

export interface MessageInputProps {
    roomId: string
    replyTo?: Message
    onSendMessage: (content: string) => void
    onCancelReply: () => void
}

export interface RoomListProps {
    rooms: Room[]
    currentRoomId?: string
    onRoomSelect: (roomId: string) => void
}

export interface UserListProps {
    users: UserProfile[]
    currentUserId: string
    onUserClick: (userId: string) => void
}

export type MessageWithSender = Message & {
    sender: UserProfile
}

export type RoomWithLastMessage = Room & {
    lastMessage?: MessageWithSender
    unreadCount: number
}

export type CreateRoomRequest = Omit<CreateRoomData, "memberIds"> & {
    memberUsernames?: string[]
}

export type UpdateUserRequest = Partial<Pick<User, "displayName" | "avatar" | "status">>

export interface ChatError {
    code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "RATE_LIMITED" | "SERVER_ERROR"
    message: string
    details?: any
}

export interface ConnectionState {
    isConnected: boolean
    reconnectAttempts: number
    lastPing?: Date
    currentRooms: string[]
}

export interface TypingIndicator {
    userId: string
    roomId: string
    username: string
    startedAt: Date
}
