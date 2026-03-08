import { AuthenticatedSocket } from "schema"
import { xcf } from "../function"
import { FrontendError } from "../type"

export default async function Errors(socket: Required<AuthenticatedSocket>) {
    socket.on("errors", async (obj) => {
        try {
            const error = new FrontendError(obj)
            await xcf(error, "", "frontend", false)
        } catch (error) {
            console.error(error)
            socket.emit("errors", "Internal Server Error")
        }
    })
}
