import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, User } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export function SearchUsers(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/search/users",
        schema: {
            description: "Search for users by username or email",
            tags: ["Search"],
            querystring: Type.Object({
                query: Type.String({ minLength: 1, description: "Search query" }),
                limit: Type.Optional(
                    Type.Number({ minimum: 1, maximum: 50, default: 10, description: "Results limit" })
                )
            }),
            response: {
                200: User,
                400: ErrorResponse(400, "Bad request - search query is required"),
                401: ErrorResponse(401, "Unauthorized - authentication required"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                // TODO: Implement search users logic
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
