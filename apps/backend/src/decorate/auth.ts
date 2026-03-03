import { CreateError, isFastifyError } from "../function"
import { FastifyRequest, FastifyReply } from "fastify"
import { Payload } from "schema"
import { main } from "../"
import Value from "typebox/value"

export default async function auth(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.decorate("auth", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const user = (await request.jwtVerify()) as Payload

            if (!Value.Check(Payload, user)) {
                reply.clearCookie("auth", { path: "/", signed: true, sameSite: "strict" })
                throw CreateError(401, "INVALID_TOKEN_PAYLOAD", "Invalid authentication token structure")
            }

            request.user = user
        } catch (error) {
            if (isFastifyError(error)) {
                if (
                    error.code === "FST_JWT_NO_AUTHORIZATION_IN_COOKIE" ||
                    error.code === "FST_JWT_NO_AUTHORIZATION_IN_HEADER"
                ) {
                    throw CreateError(401, "NO_TOKEN", "Authentication token not provided")
                }

                if (error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
                    throw CreateError(401, "TOKEN_EXPIRED", "Authentication token has expired")
                }

                if (error.code === "FST_JWT_AUTHORIZATION_TOKEN_INVALID") {
                    throw CreateError(401, "INVALID_TOKEN", "Invalid authentication token")
                }

                reply.clearCookie("auth", { path: "/", signed: true, sameSite: "strict" })
                throw CreateError(401, "AUTHENTICATION_FAILED", "Authentication failed")
            } else {
                console.trace(error)
                throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
            }
        }
    })
}
