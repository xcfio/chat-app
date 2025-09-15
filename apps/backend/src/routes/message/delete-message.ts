import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, JWTPayload } from "../../type"
import { db, table } from "../../database"
import { Type } from "@sinclair/typebox"
import { main } from "../../"
import { eq, and } from "drizzle-orm"

export default function DeleteMessage(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "DELETE",
        url: "/messages/:id",
        schema: {
            description: "Delete a message",
            tags: ["Messages"],
            params: Type.Object({ id: Type.String({ format: "uuid", description: "Id of the message" }) }),
            response: {
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if message is deleted" }),
                        message: Type.String({ description: "Confirmation message of deleted message" })
                    },
                    {
                        description: "Response schema for deleting operation"
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

                const existingMessage = await db
                    .select({
                        id: table.message.id,
                        sender: table.message.sender,
                        receiver: table.message.receiver,
                        status: table.message.status
                    })
                    .from(table.message)
                    .where(eq(table.message.id, id))
                    .limit(1)

                if (existingMessage.length === 0) {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                const message = existingMessage[0]

                if (message.sender !== userId) {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                if (message.status === "deleted") {
                    return reply.code(200).send({
                        success: true,
                        message: "Message is already deleted"
                    })
                }

                await db
                    .update(table.message)
                    .set({
                        status: "deleted",
                        editedAt: new Date()
                    })
                    .where(and(eq(table.message.id, id), eq(table.message.sender, userId)))

                if (fastify.io) {
                    fastify.io.to(message.receiver).emit("message_deleted", {
                        messageId: id,
                        conversationId: message.receiver
                    })
                }

                return reply.code(200).send({
                    success: true,
                    message: "Message deleted successfully"
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
