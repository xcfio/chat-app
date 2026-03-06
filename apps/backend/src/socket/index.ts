import { and, eq, isNull } from "drizzle-orm"
import { db, table } from "../database"
import { main } from "../"
import MarkAsRead from "./read"
import UserStatusChanged from "./user-status"
import TypingStatusChanged from "./typing"
import { AuthenticatedSocket, Payload } from "schema"

export default (fastify: Awaited<ReturnType<typeof main>>) => async (socket: AuthenticatedSocket) => {
    console.log(`Socket ${socket.id} attempting to connect`)

    try {
        const cookieHeader = socket.handshake.headers.cookie

        if (!cookieHeader) {
            console.log(`Socket ${socket.id}: No cookies provided`)
            socket.emit("error", { message: "Authentication required", code: "NO_COOKIES" })
            socket.disconnect(true)
            return
        }

        const cookies = fastify.parseCookie(cookieHeader)
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

        const tokenParts = authCookie.split(".")
        const cleanToken = tokenParts.length >= 3 ? tokenParts.slice(0, 3).join(".") : authCookie
        const decoded = fastify.jwt.verify(cleanToken) as Payload

        console.log(`User ${decoded.id} connected with socket ${socket.id}`)

        const [user] = await db
            .select()
            .from(table.users)
            .where(and(isNull(table.users.ban), eq(table.users.id, decoded.id)))

        if (!user) {
            console.log(`Socket ${socket.id}: User does not exist`)
            socket.emit("error", { message: "User does not exist", code: "USER_NOT_FOUND" })
            socket.disconnect(true)
            return
        }

        socket.user = user
        socket.join(socket.user.id)

        MarkAsRead(socket as Required<AuthenticatedSocket>)
        UserStatusChanged(socket as Required<AuthenticatedSocket>)
        TypingStatusChanged(socket as Required<AuthenticatedSocket>)
    } catch (error) {
        console.error(`Socket ${socket.id} authentication failed:`, error)
        socket.emit("error", { message: "Invalid authentication token", code: "AUTH_FAILED" })
        socket.disconnect(true)
        return
    }

    socket.on("disconnect", (reason) => {
        console.log(`User ${socket.user?.username} (${socket.user?.id}) disconnected: ${reason}`)
    })

    socket.on("error", (error) => {
        console.error(`Socket error for user ${socket.user?.name}:`, error)
    })

    console.log(`Socket connection established for ${socket.user.name}`)
}
