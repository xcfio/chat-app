import { ClientToServerEvents, ServerToClientEvents } from "../type"
import { Socket } from "socket.io"

export default function socket(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    socket.on("send_message", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("update_status", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
}
