import { AuthenticatedSocket } from "schema"

export default async function TypingStatusChanged(socket: Required<AuthenticatedSocket>) {
    socket.on("typing", async (chatId: string, status: "started" | "stopped") => {
        try {
        } catch (error) {
            console.error(error)
            socket.emit("errors", "Internal Server Error")
        }
    })
}
