import { ClientToServerEvents, ServerToClientEvents, Message, UserStatus } from "../type"
import { Socket } from "socket.io"
import { v7 } from "uuid"

export interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    userId?: string
    user?: {
        id: string
        email: string
        username: string
        name: string | null
        avatar: string | null
        token: string
    }
}

export default function socket(socket: AuthenticatedSocket) {
    console.log(`User ${socket.user?.username} connected with socket ${socket.id}`)

    if (socket.userId) {
        socket.join(`user:${socket.userId}`)
    }

    socket.on("disconnect", () => {
        console.log(`User ${socket.user?.username} disconnected`)

        if (socket.user) {
            socket.broadcast.emit("user_status_changed", socket.user.id, "offline")
        }
    })

    socket.on("send_message", (content, receiverId) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            if (!content || !content.trim()) {
                return socket.emit("error", {
                    message: "Message content is required",
                    code: "INVALID_DATA"
                })
            }

            if (content.length > 2000) {
                return socket.emit("error", {
                    message: "Message too long",
                    code: "MESSAGE_TOO_LONG"
                })
            }

            if (!receiverId) {
                return socket.emit("error", {
                    message: "Receiver ID is required",
                    code: "INVALID_DATA"
                })
            }

            const now = new Date()

            const message: Message = {
                id: v7(),
                content: content.trim(),
                sender: socket.user.id,
                receiver: receiverId,
                status: "sent",
                createdAt: now,
                editedAt: null
            }

            socket.to(`user:${receiverId}`).emit("new_message", message)

            socket.emit("new_message", message)

            console.log(`Message from ${socket.user.username} to ${receiverId}: ${content}`)
        } catch (error) {
            console.error("Error handling send_message:", error)
            socket.emit("error", {
                message: "Failed to send message",
                code: "INTERNAL_ERROR"
            })
        }
    })

    socket.on("update_status", (status) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            const validStatuses: UserStatus[] = ["online", "offline"]

            if (!status || !validStatuses.includes(status)) {
                return socket.emit("error", {
                    message: "Invalid status. Must be one of: online, offline",
                    code: "INVALID_STATUS"
                })
            }

            socket.broadcast.emit("user_status_changed", socket.user.id, status)

            console.log(`User ${socket.user.username} status updated to: ${status}`)
        } catch (error) {
            console.error("Error handling update_status:", error)
            socket.emit("error", {
                message: "Failed to update status",
                code: "INTERNAL_ERROR"
            })
        }
    })

    if (socket.user) {
        socket.broadcast.emit("user_status_changed", socket.user.id, "online")
    }
}
