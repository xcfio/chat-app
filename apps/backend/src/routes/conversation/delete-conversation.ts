import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function DeleteConversation(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/conversations/:id",
        schema: {
            description: "Delete a conversation",
            tags: ["Conversations"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the conversation" })
            }),
            response: {
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if conversation is deleted" }),
                        message: Type.String({ description: "Confirmation message of deleted conversation" })
                    },
                    {
                        description: "Response schema for deleting conversation"
                    }
                ),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                403: ErrorResponse(403, "Forbidden - not authorized to delete this conversation"),
                404: ErrorResponse(404, "Conversation not found error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement delete conversation logic
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
