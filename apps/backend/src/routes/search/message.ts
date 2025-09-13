import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, Message } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function SearchMessages(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/search/messages",
        schema: {
            description: "Search messages across conversations",
            tags: ["Search"],
            querystring: Type.Object({
                query: Type.String({ minLength: 1, description: "Search query" }),
                page: Type.Optional(Type.Number({ minimum: 1, default: 1, description: "Page number" })),
                limit: Type.Optional(
                    Type.Number({ minimum: 1, maximum: 100, default: 20, description: "Results per page" })
                ),
                conversationId: Type.Optional(
                    Type.String({ format: "uuid", description: "Search within specific conversation" })
                )
            }),
            response: {
                200: Message,
                400: ErrorResponse(400, "Bad request - search query is required"),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement search messages logic
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
