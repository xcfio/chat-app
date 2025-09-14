import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export default function ReadMessage(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/messages/:id/read",
        schema: {
            description: "Mark a message as read",
            tags: ["Messages"],
            params: Type.Object({
                id: Type.String({ format: "uuid", description: "Id of the message" })
            }),
            response: {
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if message marked as read successfully" }),
                        message: Type.String({ description: "Confirmation message" })
                    },
                    {
                        description: "Response schema for marking message as read"
                    }
                ),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "Message not found error"),
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
