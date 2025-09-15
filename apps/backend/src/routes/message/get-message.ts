import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, JWTPayload, Message } from "../../type"
import { db, table } from "../../database"
import { Type } from "@sinclair/typebox"
import { main } from "../../"
import { eq, and, or, desc, lt, ne } from "drizzle-orm"

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
                    minItems: 0
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
                const { id: conversationId } = request.params
                const { page = 1, limit = 50, before } = request.query
                const { id: userId } = request.user as JWTPayload

                const conversation = await db
                    .select({
                        id: table.conversation.id,
                        p1: table.conversation.p1,
                        p2: table.conversation.p2
                    })
                    .from(table.conversation)
                    .where(
                        and(
                            eq(table.conversation.id, conversationId),
                            or(eq(table.conversation.p1, userId), eq(table.conversation.p2, userId))
                        )
                    )
                    .limit(1)

                if (conversation.length === 0) {
                    throw CreateError(404, "CONVERSATION_NOT_FOUND", "Conversation not found")
                }

                const conv = conversation[0]
                const otherParticipant = conv.p1 === userId ? conv.p2 : conv.p1

                const whereConditions = [
                    or(
                        and(eq(table.message.sender, userId), eq(table.message.receiver, otherParticipant)),
                        and(eq(table.message.sender, otherParticipant), eq(table.message.receiver, userId))
                    ),

                    ne(table.message.status, "deleted")
                ]

                if (before) {
                    const beforeDate = new Date(before)
                    if (isNaN(beforeDate.getTime())) {
                        throw CreateError(400, "INVALID_TIMESTAMP", "Invalid 'before' timestamp format")
                    }
                    whereConditions.push(lt(table.message.createdAt, beforeDate))
                }

                const offset = (page - 1) * limit

                const messages = await db
                    .select({
                        id: table.message.id,
                        content: table.message.content,
                        sender: table.message.sender,
                        receiver: table.message.receiver,
                        status: table.message.status,
                        createdAt: table.message.createdAt,
                        editedAt: table.message.editedAt
                    })
                    .from(table.message)
                    .where(and(...whereConditions))
                    .orderBy(desc(table.message.createdAt))
                    .limit(limit)
                    .offset(offset)

                const formattedMessages = messages.map((message) => ({
                    id: message.id,
                    content: message.content,
                    sender: message.sender,
                    receiver: message.receiver,
                    status: message.status,
                    createdAt: message.createdAt?.toISOString() || new Date().toISOString(),
                    editedAt: message.editedAt?.toISOString() || null
                }))

                return reply.code(200).send(formattedMessages)
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
