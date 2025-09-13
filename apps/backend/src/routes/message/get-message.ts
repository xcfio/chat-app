import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
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
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if messages retrieved successfully" }),
                        data: Type.Object({
                            messages: Type.Array(
                                Type.Object({
                                    id: Type.String({ format: "uuid" }),
                                    content: Type.String(),
                                    userId: Type.String({ format: "uuid" }),
                                    conversationId: Type.String({ format: "uuid" }),
                                    createdAt: Type.String({ format: "date-time" }),
                                    isRead: Type.Boolean()
                                })
                            ),
                            pagination: Type.Object({
                                page: Type.Number(),
                                limit: Type.Number(),
                                total: Type.Number(),
                                hasMore: Type.Boolean()
                            })
                        })
                    },
                    {
                        description: "Response schema for getting messages"
                    }
                ),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "Conversation not found error"),
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
