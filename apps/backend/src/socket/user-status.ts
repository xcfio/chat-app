import { AuthenticatedSocket } from "schema"

export default async function UserStatusChanged(socket: Required<AuthenticatedSocket>) {
    try {
    } catch (error) {
        console.error(error)
        socket.emit("error", { message: "Failed to update user status", code: "STATUS_UPDATE_ERROR" })
    }
}
