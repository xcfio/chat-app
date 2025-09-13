import { CreateError, isFastifyError } from "../../function"
import { Conversation, ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function GetConversation(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/conversations",
        schema: {
            description: "Get user's conversations list",
            tags: ["Conversations"],
            querystring: Type.Object({
                page: Type.Optional(Type.Number({ minimum: 1, default: 1, description: "Page number" })),
                limit: Type.Optional(
                    Type.Number({ minimum: 1, maximum: 100, default: 20, description: "Conversations per page" })
                )
            }),
            response: {
                200: Type.Array(Conversation, {
                    description: "Array of conversation objects for the authenticated user",
                    maxItems: 100,
                    minItems: 1
                }),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement get conversations logic
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
