import { FastifyInstance } from "fastify"
import { AuthenticatedSocket } from "."
import { JWTPayload } from "../type"

// JWT payload interface
// Authentication middleware function

export function createAuthMiddleware(fastify: FastifyInstance) {
    return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
        try {
            // Get cookies from handshake headers
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

            // Verify JWT using Fastify's JWT plugin
            const decoded = fastify.jwt.verify(authCookie) as JWTPayload

            // Attach user data to socket
            socket.userId = decoded.id
            socket.user = decoded

            next()
        } catch (error) {
            console.error("Socket authentication error:", error)
            next(new Error("Authentication failed"))
        }
    }
}
