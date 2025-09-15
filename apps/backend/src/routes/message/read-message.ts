import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, JWTPayload } from "../../type"
import { db, table } from "../../database"
import { Type } from "@sinclair/typebox"
import { main } from "../../"
import { eq, and } from "drizzle-orm"

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
                404: ErrorResponse(404, "Not found - Message not found error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                const { id } = request.params
                const { id: userId } = request.user as JWTPayload

                const existingMessage = await db.select().from(table.message).where(eq(table.message.id, id)).limit(1)
                if (existingMessage.length === 0) {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                const message = existingMessage[0]
                if (message.receiver !== userId) {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                if (message.status === "read") {
                    return reply.code(200).send({
                        success: true,
                        message: "Message is already marked as read"
                    })
                }

                if (message.status === "deleted") {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                await db
                    .update(table.message)
                    .set({
                        status: "read",
                        editedAt: new Date()
                    })
                    .where(and(eq(table.message.id, id), eq(table.message.receiver, userId)))

                return reply.code(200).send({
                    success: true,
                    message: "Message marked as read successfully"
                })
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
