import { AuthenticatedUser, ErrorResponse, Payload, RegisterUser } from "schema"
import { CreateError, HmacPassword, toTypeBox, xcf } from "../../function"
import { db, table } from "../../database"
import { eq, or } from "drizzle-orm"
import { main } from "../../"

export default function Register(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/register",
        schema: {
            description: "Register a new user account with OTP verification",
            tags: ["Authentication"],
            body: RegisterUser,
            response: {
                201: AuthenticatedUser,
                400: ErrorResponse(400, "Bad Request - Invalid input data"),
                409: ErrorResponse(409, "Conflict - Email or username already exists"),
                429: ErrorResponse(429, "Too many requests - rate limit exceeded"),
                500: ErrorResponse(500, "Internal server error")
            }
        },
        handler: async (request, reply) => {
            const { email, username, password } = request.body
            try {
                const [exist] = await db
                    .select({ email: table.users.email, username: table.users.username })
                    .from(table.users)
                    .where(or(eq(table.users.email, email), eq(table.users.username, username)))

                if (exist) {
                    if (exist.email === email) {
                        throw CreateError(409, "EMAIL_ALREADY_EXISTS", "This email is already registered")
                    }
                    if (exist.username === username) {
                        throw CreateError(409, "USERNAME_ALREADY_EXISTS", "This username is already taken")
                    }
                }

                const [user] = await db
                    .insert(table.users)
                    .values({ ...request.body, password: HmacPassword(password) })
                    .returning()

                if (!user) {
                    throw CreateError(500, "USER_CREATION_FAILED", "Failed to create user account")
                }

                const exp = 86400 // 24 * 60 * 60
                const payload: Payload = {
                    id: user.id,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + exp
                }

                const jwt = fastify.jwt.sign(payload)
                reply.setCookie("auth", jwt, {
                    signed: true,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: exp,
                    path: "/"
                })

                return reply.status(201).send(toTypeBox(user))
            } catch (error) {
                await xcf(error)
            }
        }
    })
}
