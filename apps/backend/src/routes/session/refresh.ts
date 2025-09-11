import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse, JWTPayload } from "../../type"
import { GitHubUserSchema } from "../oauth/github"
import { GoogleUserSchema } from "../oauth/google"
import { Static, Type } from "@sinclair/typebox"
import { db, table } from "../../database"
import { main } from "../../"
import { eq } from "drizzle-orm"

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

const RefreshResponseSchema = Type.Object({
    success: Type.Boolean(),
    user: UserResponseSchema,
    token: Type.Optional(Type.String())
})

const AuthErrorSchema = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String()
})

export default function SessionRefresh(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "POST",
        url: "/auth/refresh",
        schema: {
            description: "Refresh user data from OAuth provider",
            tags: ["Session"],
            response: {
                200: RefreshResponseSchema,
                "4xx": ErrorResponse,
                "5xx": ErrorResponse
            }
        },
        preHandler: fastify.authenticate,
        handler: async (request, reply) => {
            try {
                const currentUser = (request as any).user as JWTPayload

                if (!currentUser.token) {
                    throw CreateError(400, "NO_ACCESS_TOKEN", "No access token available for refresh")
                }

                let updatedUserData: any
                let newAccessToken = currentUser.token
                let tokenExpiration = currentUser.exp

                switch (currentUser.type) {
                    case "github": {
                        const userResponse = await fetch("https://api.github.com/user", {
                            headers: {
                                Authorization: `Bearer ${currentUser.token}`,
                                "User-Agent": "ChatApp/1.0"
                            }
                        })

                        if (!userResponse.ok) {
                            throw CreateError(401, "TOKEN_EXPIRED", "GitHub access token may be expired or revoked")
                        }

                        const githubUser = (await userResponse.json()) as Static<typeof GitHubUserSchema>

                        let userEmail = githubUser.email
                        if (!userEmail) {
                            const emailResponse = await fetch("https://api.github.com/user/emails", {
                                headers: {
                                    Authorization: `Bearer ${currentUser.token}`,
                                    "User-Agent": "ChatApp/1.0"
                                }
                            })

                            if (emailResponse.ok) {
                                const emails = (await emailResponse.json()) as Array<{
                                    email: string
                                    primary: boolean
                                    verified: boolean
                                }>

                                const primaryEmail = emails.find((e: any) => e.primary && e.verified)
                                userEmail = primaryEmail?.email
                            }
                        }

                        updatedUserData = {
                            username: githubUser.login,
                            name: githubUser.name || githubUser.login,
                            avatar: githubUser.avatar_url || `https://github.com/identicons/${githubUser.login}.png`,
                            email: userEmail || currentUser.email
                        }
                        break
                    }

                    case "google": {
                        const now = Math.floor(Date.now() / 1000)
                        if (currentUser.exp <= now + 300) {
                            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                body: new URLSearchParams({
                                    client_id: process.env.GOOGLE_CLIENT_ID,
                                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                                    refresh_token: currentUser.token,
                                    grant_type: "refresh_token"
                                })
                            })

                            if (tokenResponse.ok) {
                                const tokenData = (await tokenResponse.json()) as {
                                    access_token: string
                                    refresh_token?: string
                                    expires_in: number
                                    token_type: string
                                    scope: string
                                    id_token: string
                                }
                                newAccessToken = tokenData.access_token
                                tokenExpiration = Math.floor(Date.now() / 1000) + tokenData.expires_in
                            } else {
                                const errorData = await tokenResponse.json()
                                console.error("Google token refresh failed:", errorData)
                                throw CreateError(401, "TOKEN_REFRESH_FAILED", "Failed to refresh Google access token")
                            }
                        }

                        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                            headers: {
                                Authorization: `Bearer ${newAccessToken}`
                            }
                        })

                        if (!userResponse.ok) {
                            throw CreateError(401, "TOKEN_EXPIRED", "Google access token may be expired or revoked")
                        }

                        const googleUser = (await userResponse.json()) as Static<typeof GoogleUserSchema>

                        if (!googleUser.verified_email) {
                            throw CreateError(400, "EMAIL_NOT_VERIFIED", "User email is not verified")
                        }

                        updatedUserData = {
                            username: googleUser.email.split("@")[0],
                            name: googleUser.name,
                            avatar:
                                googleUser.picture ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(googleUser.name)}&background=4285f4&color=fff`,
                            email: googleUser.email
                        }
                        break
                    }

                    default: {
                        throw CreateError(400, "UNSUPPORTED_PROVIDER", "Unsupported OAuth provider")
                    }
                }

                const updatedUser = await db
                    .update(table.user)
                    .set({
                        ...updatedUserData,
                        token: newAccessToken,
                        updatedAt: new Date()
                    })
                    .where(eq(table.user.id, currentUser.id))
                    .returning()

                if (!updatedUser.length) {
                    throw CreateError(404, "USER_NOT_FOUND", "User not found")
                }

                const jwtPayload: JWTPayload = {
                    type: "google",
                    id: updatedUser[0].id,
                    email: updatedUser[0].email,
                    username: updatedUser[0].username,
                    name: updatedUser[0].name,
                    avatar: updatedUser[0].avatar,
                    token: newAccessToken,
                    iat: Math.floor(Date.now() / 1000),
                    exp: tokenExpiration
                }

                const newJwtToken = fastify.jwt.sign(jwtPayload)
                const cookieMaxAge = Math.max(0, tokenExpiration - Math.floor(Date.now() / 1000))

                reply.setCookie("auth", newJwtToken, {
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: cookieMaxAge,
                    path: "/"
                })

                return reply.send({
                    success: true,
                    user: {
                        id: updatedUser[0].id,
                        type: updatedUser[0].type,
                        email: updatedUser[0].email,
                        username: updatedUser[0].username,
                        name: updatedUser[0].name ?? undefined,
                        avatar: updatedUser[0].avatar ?? undefined,
                        lastSeen: updatedUser[0].lastSeen?.toISOString(),
                        createdAt: updatedUser[0].createdAt?.toISOString() || new Date().toISOString()
                    },
                    token: newJwtToken
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
