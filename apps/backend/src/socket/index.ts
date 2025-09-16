import { ClientToServerEvents, ServerToClientEvents, Message, UserStatus, JWTPayload } from "../type"
import { Socket } from "socket.io"
import { v7 } from "uuid"
import { main } from "../"

export interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    user?: JWTPayload
}

export default (fastify: Awaited<ReturnType<typeof main>>) => (socket: AuthenticatedSocket) => {
    console.log(`Socket ${socket.id} attempting to connect`)

    try {
        const cookieHeader = socket.handshake.headers.cookie

        if (!cookieHeader) {
            console.log(`Socket ${socket.id}: No cookies provided`)
            socket.emit("error", {
                message: "Authentication required",
                code: "NO_COOKIES"
            })
            socket.disconnect(true)
            return
        }

        const mockRequest = { headers: { cookie: cookieHeader } } as any
        const cookies = fastify.parseCookie(mockRequest)
        const authCookie = cookies.auth

        if (!authCookie) {
            console.log(`Socket ${socket.id}: No auth cookie found`)
            socket.emit("error", {
                message: "Authentication token not found",
                code: "NO_AUTH_COOKIE"
            })
            socket.disconnect(true)
            return
        }

        const decoded = fastify.jwt.verify(authCookie) as JWTPayload
        socket.user = decoded

        console.log(`User ${socket.user.username} (${socket.user.id}) connected with socket ${socket.id}`)
        socket.join(`user:${socket.user.id}`)

        // Broadcast that user is online
        socket.broadcast.emit("user_status_changed", socket.user.id, "online")
    } catch (error) {
        console.error(`Socket ${socket.id} authentication failed:`, error)
        socket.emit("error", {
            message: "Invalid authentication token",
            code: "AUTH_FAILED"
        })
        socket.disconnect(true)
        return
    }

    // Connection successful - set up event handlers

    socket.on("disconnect", (reason) => {
        console.log(`User ${socket.user?.username} (${socket.user?.id}) disconnected: ${reason}`)

        if (socket.user) {
            // Broadcast that user went offline
            socket.broadcast.emit("user_status_changed", socket.user.id, "offline")
        }
    })

    socket.on("send_message", async (content, receiverId) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            // Validate message content
            if (!content || typeof content !== "string") {
                return socket.emit("error", {
                    message: "Message content is required",
                    code: "INVALID_CONTENT"
                })
            }

            const trimmedContent = content.trim()
            if (!trimmedContent) {
                return socket.emit("error", {
                    message: "Message cannot be empty",
                    code: "EMPTY_MESSAGE"
                })
            }

            if (trimmedContent.length > 2000) {
                return socket.emit("error", {
                    message: "Message too long (maximum 2000 characters)",
                    code: "MESSAGE_TOO_LONG"
                })
            }

            // Validate receiver ID
            if (!receiverId || typeof receiverId !== "string") {
                return socket.emit("error", {
                    message: "Receiver ID is required",
                    code: "INVALID_RECEIVER"
                })
            }

            // Don't allow sending messages to self
            if (receiverId === socket.user.id) {
                return socket.emit("error", {
                    message: "Cannot send message to yourself",
                    code: "SELF_MESSAGE"
                })
            }

            // Create message object
            const message: Message = {
                id: v7(),
                content: trimmedContent,
                sender: socket.user.id,
                receiver: receiverId,
                status: "sent",
                createdAt: new Date().toISOString(),
                editedAt: null
            }

            // TODO: Save message to database here
            // await saveMessageToDatabase(message)

            // Send message to receiver if they're online
            const receiverSocketsInRoom = await socket.to(`user:${receiverId}`).fetchSockets()
            if (receiverSocketsInRoom.length > 0) {
                socket.to(`user:${receiverId}`).emit("new_message", message)
                // Update status to delivered since receiver is online
                message.status = "delivered"
            }

            // Send confirmation back to sender
            socket.emit("new_message", message)

            console.log(
                `Message sent from ${socket.user.username} to ${receiverId}: ${trimmedContent.substring(0, 50)}${trimmedContent.length > 50 ? "..." : ""}`
            )
        } catch (error) {
            console.error("Error handling send_message:", error)
            socket.emit("error", {
                message: "Failed to send message",
                code: "SEND_FAILED"
            })
        }
    })

    socket.on("mark_message_read", async (messageId) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            if (!messageId || typeof messageId !== "string") {
                return socket.emit("error", {
                    message: "Message ID is required",
                    code: "INVALID_MESSAGE_ID"
                })
            }

            // TODO: Update message status in database
            // await updateMessageStatus(messageId, 'read')

            // Notify all connected clients that message was read
            fastify.io.emit("message_read", messageId)

            console.log(`Message ${messageId} marked as read by ${socket.user.username}`)
        } catch (error) {
            console.error("Error handling mark_message_read:", error)
            socket.emit("error", {
                message: "Failed to mark message as read",
                code: "READ_FAILED"
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
                    message: "Invalid status. Must be 'online' or 'offline'",
                    code: "INVALID_STATUS"
                })
            }

            // TODO: Update user status in database
            // await updateUserStatus(socket.user.id, status)

            // Broadcast status change to all other users
            socket.broadcast.emit("user_status_changed", socket.user.id, status)

            console.log(`User ${socket.user.username} status updated to: ${status}`)
        } catch (error) {
            console.error("Error handling update_status:", error)
            socket.emit("error", {
                message: "Failed to update status",
                code: "STATUS_UPDATE_FAILED"
            })
        }
    })

    socket.on("start_typing", (receiverId) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            if (!receiverId || typeof receiverId !== "string") {
                return socket.emit("error", {
                    message: "Receiver ID is required",
                    code: "INVALID_RECEIVER"
                })
            }

            // Send typing indicator to specific user
            socket.to(`user:${receiverId}`).emit("user_typing", socket.user.id, true)

            console.log(`${socket.user.username} started typing to ${receiverId}`)
        } catch (error) {
            console.error("Error handling start_typing:", error)
        }
    })

    socket.on("stop_typing", (receiverId) => {
        if (!socket.user) {
            return socket.emit("error", {
                message: "Not authenticated",
                code: "UNAUTHORIZED"
            })
        }

        try {
            if (!receiverId || typeof receiverId !== "string") {
                return socket.emit("error", {
                    message: "Receiver ID is required",
                    code: "INVALID_RECEIVER"
                })
            }

            // Stop typing indicator for specific user
            socket.to(`user:${receiverId}`).emit("user_typing", socket.user.id, false)

            console.log(`${socket.user.username} stopped typing to ${receiverId}`)
        } catch (error) {
            console.error("Error handling stop_typing:", error)
        }
    })

    // Handle any uncaught errors on this socket
    socket.on("error", (error) => {
        console.error(`Socket error for user ${socket.user?.username}:`, error)
    })

    console.log(`Socket connection established for ${socket.user.username}`)
}
