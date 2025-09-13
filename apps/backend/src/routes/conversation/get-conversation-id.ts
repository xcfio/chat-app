import { CreateError, isFastifyError } from "../../function"
import { Conversation, ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function GetConversationId(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/conversations/:id",
        schema: {
            description: "Get specific conversation details",
            tags: ["Conversations"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the conversation" })
            }),
            response: {
                200: Conversation,
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                403: ErrorResponse(403, "Forbidden - not a participant in this conversation"),
                404: ErrorResponse(404, "Conversation not found error"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement get conversation details logic
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
