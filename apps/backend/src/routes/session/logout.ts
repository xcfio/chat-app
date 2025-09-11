import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { Type } from "@sinclair/typebox"
import { main } from "../../"

export default function SessionLogout(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/logout",
        schema: {
            description: "Logout user and clear authentication",
            tags: ["Session"],
            response: {
                200: Type.Object(
                    {
                        success: Type.Boolean({ description: "Indicates if logout was successful" }),
                        message: Type.String({ description: "Logout confirmation message" })
                    },
                    {
                        description: "Response schema for successful logout operation"
                    }
                ),
                401: ErrorResponse("Unauthorized - authentication required"),
                500: ErrorResponse("Server error during logout")
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
