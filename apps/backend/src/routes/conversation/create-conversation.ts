import { CreateError, isFastifyError } from "../../function"
import { Conversation, ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function CreateConversation(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/conversations/:id",
        schema: {
            description: "Create new conversation with another user",
            tags: ["Conversations"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the user to start conversation with" })
            }),
            response: {
                201: Conversation,
                400: ErrorResponse(400, "Bad request - invalid user id or conversation already exists"),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "User not found error"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement create conversation logic
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
