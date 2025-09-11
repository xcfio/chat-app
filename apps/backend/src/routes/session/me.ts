import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, JWTPayload } from "../../type"
import { db, table } from "../../database"
import { Type } from "@sinclair/typebox"
import { eq } from "drizzle-orm"
import { main } from "../../"

const UserResponseSchema = Type.Object({
    id: Type.String(),
    type: Type.Union([Type.Literal("github"), Type.Literal("google")]),
    email: Type.String(),
    username: Type.String(),
    name: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
    lastSeen: Type.Optional(Type.String()),
    createdAt: Type.String()
})

const AuthMeResponseSchema = Type.Object({
    success: Type.Boolean(),
    user: UserResponseSchema
})

export default function SessionMe(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/auth/me",
        schema: {
            description: "Get current authenticated user",
            tags: ["Session"],
            response: {
                200: AuthMeResponseSchema,
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                const user = (request as any).user as JWTPayload
                const userData = await db.select().from(table.user).where(eq(table.user.id, user.id)).limit(1)

                if (!userData.length) throw CreateError(404, "USER_NOT_FOUND", "User not found")
                const currentUser = userData[0]

                return reply.send({
                    success: true,
                    user: {
                        id: currentUser.id,
                        type: currentUser.type,
                        email: currentUser.email,
                        username: currentUser.username,
                        name: currentUser.name ?? undefined,
                        avatar: currentUser.avatar ?? undefined,
                        lastSeen: currentUser.lastSeen?.toISOString(),
                        createdAt: currentUser.createdAt?.toISOString() || new Date().toISOString()
                    }
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
