import { ErrorResponse, Message } from "../../type"
import { CreateError, isFastifyError } from "../../function"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export default function SendMessage(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/conversations/:id/messages",
        schema: {
            description: "Send a new message to a conversation",
            tags: ["Messages"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the conversation" })
            }),
            body: Type.Object({
                content: Type.String({ minLength: 1, maxLength: 2000, description: "Message content" })
            }),
            response: {
                201: Message,
                400: ErrorResponse(400, "Bad request - invalid message content"),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement this logic
            } catch (error) {
                if (isFastifyError(error)) {
                    throw error
                } else {
                    console.trace(error)
                    throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
                }
            }
        }
    })
}
