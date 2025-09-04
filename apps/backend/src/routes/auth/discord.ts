import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type, Static } from "@sinclair/typebox"
import { randomBytes } from "node:crypto"

const DiscordUserSchema = Type.Object({
    id: Type.String(),
    username: Type.String(),
    discriminator: Type.String(),
    global_name: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    verified: Type.Optional(Type.Boolean()),
    mfa_enabled: Type.Optional(Type.Boolean()),
    banner: Type.Optional(Type.String()),
    accent_color: Type.Optional(Type.Number()),
    locale: Type.Optional(Type.String()),
    flags: Type.Optional(Type.Number()),
    premium_type: Type.Optional(Type.Number()),
    public_flags: Type.Optional(Type.Number())
})

const AuthResponseSchema = Type.Object({
    success: Type.Boolean(),
    message: Type.String(),
    user: Type.Optional(DiscordUserSchema),
    redirectUrl: Type.Optional(Type.String())
})

const OAuthCallbackQuerySchema = Type.Object({
    code: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    error_description: Type.Optional(Type.String()),
    state: Type.Optional(Type.String())
})

export default function AuthDiscord(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/auth/discord",
        schema: {
            description: "Initiate Discord OAuth login",
            tags: ["Authentication"],
            response: {
                302: Type.Object({
                    message: Type.String()
                }),
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
        handler: async (_, reply) => {
            try {
                const state = randomBytes(32).toString("hex")
                reply.setCookie("oauth_state", state, {
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 600,
                    path: "/"
                })

                const discordAuthUrl = [
                    `https://discord.com/api/oauth2/authorize?`,
                    `client_id=${process.env.DISCORD_CLIENT_ID}&`,
                    `redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI || "http://localhost:7200/auth/discord/callback")}&`,
                    `response_type=code&`,
                    `scope=identify email&`,
                    `state=${state}`
                ]

                return reply.redirect(discordAuthUrl.join(""))
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

    fastify.route({
        method: "GET",
        url: "/auth/discord/callback",
        schema: {
            description: "Handle Discord OAuth callback",
            tags: ["Authentication"],
            querystring: OAuthCallbackQuerySchema,
            response: {
                302: Type.Object({
                    message: Type.String()
                }),
                200: AuthResponseSchema,
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
        handler: async (request, reply) => {
            try {
                const { code, error, state } = request.query

                if (error) {
                    console.error("Discord OAuth error:", error)
                    return reply.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`)
                }

                const storedState = request.unsignCookie(request.cookies.oauth_state || "")
                if (!storedState.valid || !state || storedState.value !== state) {
                    reply.clearCookie("oauth_state", { path: "/" })
                    throw CreateError(400, "INVALID_STATE", "Invalid or missing state parameter")
                }
                reply.clearCookie("oauth_state", { path: "/" })

                if (!code) throw CreateError(400, "NO_AUTH_CODE", "Authorization code not provided")

                const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        client_id: process.env.DISCORD_CLIENT_ID,
                        client_secret: process.env.DISCORD_CLIENT_SECRET,
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: process.env.DISCORD_REDIRECT_URI || "http://localhost:7200/auth/discord/callback"
                    })
                })

                if (!tokenResponse.ok) {
                    const errorData = await tokenResponse.json()
                    console.error("Token exchange failed:", errorData)
                    throw CreateError(400, "TOKEN_EXCHANGE_FAILED", "Failed to exchange authorization code")
                }

                const tokenData = (await tokenResponse.json()) as {
                    token_type: string
                    access_token: string
                    expires_in: number
                    refresh_token: string
                    scope: string
                }

                const userResponse = await fetch("https://discord.com/api/users/@me", {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`
                    }
                })

                if (!userResponse.ok) {
                    console.error("Failed to fetch user data from Discord")
                    throw CreateError(400, "USER_FETCH_FAILED", "Failed to fetch user data")
                }

                const user = (await userResponse.json()) as Static<typeof DiscordUserSchema>
                if (!user.email) throw CreateError(400, "NO_EMAIL", "User email not found")

                const values = {
                    type: "discord",
                    token: tokenData.refresh_token,
                    email: user.email,
                    username: user.username,
                    name: user.global_name,
                    avatar: user.avatar
                        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
                        : `https://cdn.discordapp.com/embed/avatars/${BigInt(user.id) % 5n}.png`
                } as const

                const data = await db
                    .insert(table.user)
                    .values(values)
                    .onConflictDoUpdate({ target: table.user.email, set: { token: tokenData.refresh_token } })
                    .returning()

                const jwt = fastify.jwt.sign({
                    ...data,
                    token: tokenData.access_token,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + tokenData.expires_in
                })

                reply.setCookie("auth", jwt, {
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: tokenData.expires_in,
                    path: "/"
                })

                return reply.redirect(process.env.FRONTEND_URL ?? "http://localhost:7700")
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

/*
// Get current authenticated user
fastify.route({
    method: "GET",
    url: "/auth/me",
    schema: {
        description: "Get current authenticated user",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                user: DiscordUserSchema
            }),
            401: AuthErrorSchema
        }
    },
    preHandler: fastify.authenticate, // Middleware to verify JWT
    handler: async (request, reply) => {
        try {
            // User data is available from JWT verification middleware
            const user = (request as any).user

            return reply.send({
                success: true,
                user: {
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                    // Add other user fields as needed
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

// Logout user
fastify.route({
    method: "POST",
    url: "/auth/logout",
    schema: {
        description: "Logout user and clear authentication",
        tags: ["Authentication"],
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                message: Type.String()
            })
        }
    },
    handler: async (request, reply) => {
        try {
            // Clear authentication cookie
            reply.clearCookie("auth", {
                path: "/",
                signed: true
            })

            // TODO: Invalidate refresh token in database
            // if (request.user) {
            //     await invalidateRefreshToken(request.user.userId)
            // }

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

// Refresh JWT token
fastify.route({
    method: "POST",
    url: "/auth/refresh",
    schema: {
        description: "Refresh JWT token using refresh token",
        tags: ["Authentication"],
        body: Type.Object({
            refreshToken: Type.String()
        }),
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                token: Type.String(),
                user: DiscordUserSchema
            }),
            400: AuthErrorSchema,
            401: AuthErrorSchema
        }
    },
    handler: async (request, reply) => {
        try {
            const { refreshToken } = request.body

            // TODO: Verify refresh token from database
            // const storedToken = await getStoredRefreshToken(refreshToken)
            // if (!storedToken || storedToken.expired) {
            //     return reply.code(401).send({
            //         success: false,
            //         error: "Invalid or expired refresh token",
            //         code: "INVALID_REFRESH_TOKEN"
            //     })
            // }

            // Exchange refresh token for new access token
            const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: process.env.DISCORD_CLIENT_ID!,
                    client_secret: process.env.DISCORD_CLIENT_SECRET!,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
            })

            if (!tokenResponse.ok) {
                return reply.code(401).send({
                    success: false,
                    error: "Failed to refresh token",
                    code: "TOKEN_REFRESH_FAILED"
                })
            }

            const tokenData = (await tokenResponse.json()) as any

            // Get updated user information
            const userResponse = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`
                }
            })

            const discordUser: Static<typeof DiscordUserSchema> = (await userResponse.json()) as any

            // Create new JWT token
            const jwtPayload = {
                userId: discordUser.id,
                username: discordUser.username,
                email: discordUser.email,
                avatar: discordUser.avatar,
                provider: "discord",
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
            }

            const newJwtToken = await fastify.jwt.sign(jwtPayload)

            // TODO: Update refresh token in database
            // await updateRefreshToken(discordUser.id, tokenData.refresh_token)

            return reply.send({
                success: true,
                token: newJwtToken,
                user: discordUser
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
*/
