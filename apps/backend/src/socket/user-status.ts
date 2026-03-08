import { AuthenticatedSocket } from "schema"

export default async function UserStatusChanged(socket: Required<AuthenticatedSocket>) {
    try {
    } catch (error) {
        console.error(error)
        socket.emit("errors", "Internal Server Error")
    }
}
