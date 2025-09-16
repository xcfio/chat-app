import { FastifyInstance } from "fastify"
import { AuthenticatedSocket } from "."
import { JWTPayload } from "../type"

export function SocketAuth(fastify: FastifyInstance) {
    return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
        try {
            next()
        } catch (error) {
            console.error("Socket authentication error:", error)
            next(new Error("Authentication failed"))
        }
    }
}
