import { CreateError, isFastifyError } from "../../function"
import { ErrorResponse } from "../../type"
import { db, table } from "../../database"
import { main } from "../../"
import { Type, Static } from "@sinclair/typebox"
import { randomBytes } from "node:crypto"

const GitHubUserSchema = Type.Object({
    id: Type.Number(),
    login: Type.String(),
    name: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    avatar_url: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String()),
    company: Type.Optional(Type.String()),
    location: Type.Optional(Type.String()),
    blog: Type.Optional(Type.String()),
    html_url: Type.String(),
    public_repos: Type.Optional(Type.Number()),
    public_gists: Type.Optional(Type.Number()),
    followers: Type.Optional(Type.Number()),
    following: Type.Optional(Type.Number()),
    created_at: Type.Optional(Type.String()),
    updated_at: Type.Optional(Type.String())
})

const AuthResponseSchema = Type.Object({
    success: Type.Boolean(),
    message: Type.String(),
    user: Type.Optional(GitHubUserSchema),
    redirectUrl: Type.Optional(Type.String())
})

const OAuthCallbackQuerySchema = Type.Object({
    code: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    error_description: Type.Optional(Type.String()),
    state: Type.Optional(Type.String())
})

export default function AuthGitHub(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.route({
        method: "GET",
        url: "/auth/github",
        schema: {
            description: "Initiate GitHub OAuth login",
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

                const githubAuthUrl = [
                    `https://github.com/login/oauth/authorize?`,
                    `client_id=${process.env.GITHUB_CLIENT_ID}&`,
                    `redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI || "http://localhost:7200/auth/github/callback")}&`,
                    `scope=user:email&`,
                    `state=${state}&`,
                    `allow_signup=true`
                ]

                reply.setCookie("github_oauth_state", state, {
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 600,
                    path: "/"
                })

                return reply.redirect(githubAuthUrl.join(""))
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
        url: "/auth/github/callback",
        schema: {
            description: "Handle GitHub OAuth callback",
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
                    console.error("GitHub OAuth error:", error)
                    reply.clearCookie("github_oauth_state", { path: "/" })
                    return reply.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`)
                }

                if (!code) {
                    reply.clearCookie("github_oauth_state", { path: "/" })
                    throw CreateError(400, "NO_AUTH_CODE", "Authorization code not provided")
                }

                const storedState = request.unsignCookie(request.cookies.github_oauth_state || "")
                if (!storedState.valid || storedState.value !== state) {
                    reply.clearCookie("github_oauth_state", { path: "/" })
                    throw CreateError(400, "INVALID_STATE", "Invalid state parameter")
                }

                // Clear the state cookie
                reply.clearCookie("github_oauth_state", { path: "/" })

                const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        client_id: process.env.GITHUB_CLIENT_ID!,
                        client_secret: process.env.GITHUB_CLIENT_SECRET!,
                        code: code
                    })
                })

                if (!tokenResponse.ok) {
                    const errorData = await tokenResponse.json()
                    console.error("Token exchange failed:", errorData)
                    throw CreateError(400, "TOKEN_EXCHANGE_FAILED", "Failed to exchange authorization code")
                }

                const tokenData = (await tokenResponse.json()) as {
                    access_token: string
                    token_type: string
                    scope: string
                    error?: string
                    error_description?: string
                }

                if (tokenData.error) {
                    console.error("GitHub token error:", tokenData.error_description)
                    throw CreateError(400, "TOKEN_ERROR", tokenData.error_description || "Token exchange failed")
                }

                // Fetch user data from GitHub
                const userResponse = await fetch("https://api.github.com/user", {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                        "User-Agent": "YourApp/1.0"
                    }
                })

                if (!userResponse.ok) {
                    console.error("Failed to fetch user data from GitHub")
                    throw CreateError(400, "USER_FETCH_FAILED", "Failed to fetch user data")
                }

                const user = (await userResponse.json()) as Static<typeof GitHubUserSchema>

                // Fetch user's primary email if not public
                let userEmail = user.email
                if (!userEmail) {
                    const emailResponse = await fetch("https://api.github.com/user/emails", {
                        headers: {
                            Authorization: `Bearer ${tokenData.access_token}`,
                            "User-Agent": "YourApp/1.0"
                        }
                    })

                    if (emailResponse.ok) {
                        const emails = (await emailResponse.json()) as Array<{
                            email: string
                            primary: boolean
                            verified: boolean
                        }>

                        const primaryEmail = emails.find((e) => e.primary && e.verified)
                        userEmail = primaryEmail?.email
                    }
                }

                if (!userEmail) {
                    throw CreateError(400, "NO_EMAIL", "User email not found or not verified")
                }

                const values = {
                    type: "github",
                    token: tokenData.access_token,
                    email: userEmail,
                    username: user.login,
                    name: user.name || user.login,
                    avatar: user.avatar_url || `https://github.com/identicons/${user.login}.png`
                } as const

                const data = await db
                    .insert(table.user)
                    .values(values)
                    .onConflictDoUpdate({
                        target: table.user.email,
                        set: {
                            token: tokenData.access_token,
                            username: user.login,
                            name: user.name || user.login,
                            avatar: user.avatar_url || `https://github.com/identicons/${user.login}.png`
                        }
                    })
                    .returning()

                const jwt = fastify.jwt.sign({
                    ...data[0],
                    token: tokenData.access_token,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
                })

                reply.setCookie("auth", jwt, {
                    signed: true,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60, // 7 days
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
                user: GitHubUserSchema
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
                    login: user.username,
                    name: user.name,
                    email: user.email,
                    avatar_url: user.avatar,
                    html_url: `https://github.com/${user.username}`
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

            // TODO: Revoke GitHub access token
            // if (request.user && request.user.token) {
            //     await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`, {
            //         method: "DELETE",
            //         headers: {
            //             "Authorization": `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString('base64')}`,
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({
            //             access_token: request.user.token
            //         })
            //     })
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

// Refresh user data from GitHub
fastify.route({
    method: "POST",
    url: "/auth/refresh",
    schema: {
        description: "Refresh user data from GitHub",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                user: GitHubUserSchema
            }),
            401: AuthErrorSchema,
            400: AuthErrorSchema
        }
    },
    preHandler: fastify.authenticate,
    handler: async (request, reply) => {
        try {
            const currentUser = (request as any).user

            if (!currentUser.token) {
                throw CreateError(400, "NO_ACCESS_TOKEN", "No access token available for refresh")
            }

            // Fetch updated user information from GitHub
            const userResponse = await fetch("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                    "User-Agent": "YourApp/1.0"
                }
            })

            if (!userResponse.ok) {
                throw CreateError(401, "TOKEN_EXPIRED", "GitHub access token may be expired or revoked")
            }

            const githubUser: Static<typeof GitHubUserSchema> = (await userResponse.json()) as any

            // Update user data in database
            const updatedUser = await db
                .update(table.user)
                .set({
                    username: githubUser.login,
                    name: githubUser.name || githubUser.login,
                    avatar: githubUser.avatar_url || `https://github.com/identicons/${githubUser.login}.png`
                })
                .where(eq(table.user.id, currentUser.id))
                .returning()

            // Create new JWT token with updated data
            const jwtPayload = {
                ...updatedUser[0],
                token: currentUser.token,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
            }

            const newJwtToken = fastify.jwt.sign(jwtPayload)

            // Update auth cookie
            reply.setCookie("auth", newJwtToken, {
                signed: true,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60,
                path: "/"
            })

            return reply.send({
                success: true,
                user: githubUser
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
