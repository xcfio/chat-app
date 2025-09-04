import { ClientToServerEvents, ServerToClientEvents } from "../type"
import { Socket } from "socket.io"

export default function socket(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    socket.on("join_room", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("leave_room", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("send_message", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("edit_message", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("delete_message", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("start_typing", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("stop_typing", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
    socket.on("update_status", () => socket.emit("error", { message: "Not Implemented", code: "NOT_IMPLEMENTED" }))
}
