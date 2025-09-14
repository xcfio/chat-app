import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, Message } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export default function GetMessages(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/conversations/:id/messages",
        schema: {
            description: "Get messages in a conversation",
            tags: ["Messages"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the conversation" })
            }),
            querystring: Type.Object({
                page: Type.Optional(Type.Number({ minimum: 1, default: 1, description: "Page number" })),
                limit: Type.Optional(
                    Type.Number({ minimum: 1, maximum: 100, default: 50, description: "Messages per page" })
                ),
                before: Type.Optional(
                    Type.String({ format: "date-time", description: "Get messages before this timestamp" })
                )
            }),
            response: {
                200: Type.Array(Message, {
                    description: "Array of message objects from the conversation, ordered by creation time",
                    maxItems: 100,
                    minItems: 1
                }),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "Not found - Conversation not found error"),
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
