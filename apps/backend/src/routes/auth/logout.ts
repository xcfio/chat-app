import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { main } from "../../"
import { Type } from "@sinclair/typebox"

export default function Logout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/auth/logout",
        schema: {
            description: "Logout user and clear authentication",
            tags: ["Authentication"],
            response: {
                200: Type.Object({
                    success: Type.Boolean(),
                    message: Type.String()
                }),
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
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
