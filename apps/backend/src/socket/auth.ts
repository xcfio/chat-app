import { FastifyInstance } from "fastify"
import { AuthenticatedSocket } from "."
import { JWTPayload } from "../type"

export function createAuthMiddleware(fastify: FastifyInstance) {
    return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie

            if (!cookieHeader) {
                return next(new Error("No cookies provided"))
            }

            const mockRequest = { headers: { cookie: cookieHeader } } as any
            const cookies = fastify.parseCookie(mockRequest)
            const authCookie = cookies.auth

            if (!authCookie) {
                return next(new Error("No auth cookie found"))
            }

            const decoded = fastify.jwt.verify(authCookie) as JWTPayload

            socket.userId = decoded.id
            socket.user = decoded

            next()
        } catch (error) {
            console.error("Socket authentication error:", error)
            next(new Error("Authentication failed"))
        }
    }
}
