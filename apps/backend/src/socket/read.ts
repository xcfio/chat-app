import { AuthenticatedSocket } from "schema"

export default function MarkAsRead(socket: Required<AuthenticatedSocket>) {
    socket.on("mark_as_read", async (data) => {
        try {
        } catch (error) {
            console.error("Error marking messages as read:", error)
            socket.emit("error", { message: "Failed to mark messages as read", code: "MARK_READ_FAILED" })
        }
    })
}
