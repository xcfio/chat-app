import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

const LogoutResponseSchema = Type.Object({
    success: Type.Boolean(),
    message: Type.String()
})

export default function SessionLogout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/logout",
        schema: {
            description: "Logout user and clear authentication",
            tags: ["Session"],
            response: {
                200: LogoutResponseSchema,
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
        preHandler: fastify.authenticate,
        handler: async (_, reply) => {
            try {
                reply.clearCookie("auth", {
                    path: "/",
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict"
                })

                return reply.send({
                    success: true,
                    message: "Successfully logged out"
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
