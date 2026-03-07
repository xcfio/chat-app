import { CreateError, xcf } from "../../function"
import { ErrorResponse, UUID } from "schema"
import { db, table } from "../../database"
import { eq } from "drizzle-orm"
import { Type } from "typebox"
import { main } from "../../"

export default function ReadMessage(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "PUT",
        url: "/messages/:id/read",
        schema: {
            description: "Mark a message as read",
            tags: ["Messages"],
            params: Type.Object({ id: UUID }),
            response: {
                200: Type.Object({ success: Type.Boolean() }),
                400: ErrorResponse(400, "Bad request - message already read"),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                404: ErrorResponse(404, "Not found - Message not found error"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.auth,
        handler: async (request, reply) => {
            try {
                const { id } = request.params

                const [{ messages, conversations }] = await db
                    .select()
                    .from(table.messages)
                    .leftJoin(table.conversations, eq(table.conversations.id, table.messages.conversation))
                    .where(eq(table.messages.id, id))

                if (!messages || !conversations || messages.status.includes("deleted")) {
                    throw CreateError(404, "MESSAGE_NOT_FOUND", "Message not found")
                }

                if (messages.status.includes("read")) {
                    throw CreateError(400, "MESSAGE_ALREADY_READ", "Message is already marked as read")
                }

                await db
                    .update(table.messages)
                    .set({ status: [...messages.status, "read"] })
                    .where(eq(table.messages.id, id))

                return reply.code(200).send({ success: true })
            } catch (error) {
                await xcf(error)
            }
        }
    })
}
