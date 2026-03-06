import { Static } from "typebox"
import { UserSelect } from "../table"
import { Socket } from "socket.io"

export interface ClientToServerEvents {
    mark_as_read: (data: { chatId: string; messageIds: string[] }) => void
    typing: (chatId: string, status: "started" | "stopped") => void
}

type Message = any
type Notifications = any

export interface ServerToClientEvents {
    user_status_changed: (userId: string, status: "online" | "offline") => void
    message_created: (message: Message) => void
    message_edited: (message: Message) => void
    message_deleted: (message: string) => void
    messages_read: (data: { chatId: string; messageIds: string[]; readBy: string }) => void
    typing: (userId: string, status: "started" | "stopped") => void
    notification_created: (notification: Notifications) => void
    error: (data: { message: string; code: string }) => void
}

export interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    user: Static<typeof UserSelect>
}
