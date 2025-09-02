import { isFastifyError, ValidationErrorHandler } from "./function"

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import RateLimit from "@fastify/rate-limit"
import Cookie from "@fastify/cookie"
import OAuth2, { fastifyOauth2 } from "@fastify/oauth2"
import Cors from "@fastify/cors"
import JTW from "@fastify/jwt"
import Fastify from "fastify"

const main = async () => {
    const isDevelopment = process.env.NODE_ENV === "development"
    const fastify = Fastify({
        trustProxy: true,
        logger: {
            formatters: { level: (level, number) => ({ level: `${level} (${number})` }) },
            file: isDevelopment ? "./log.json" : undefined
        },
        schemaErrorFormatter: ValidationErrorHandler
    }).withTypeProvider<TypeBoxTypeProvider>()

    fastify.get("/status", (_, reply) => reply.code(200).send("OK"))

    await fastify.register(RateLimit, {
        max: 10,
        timeWindow: 60000,
        keyGenerator: (req) => {
            const forwarded = req.headers["x-forwarded-for"]
            return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip
        }
    })

    await fastify.register(Cookie, { secret: process.env.COOKIE_SECRET })
    await fastify.register(JTW, { cookie: { cookieName: "auth", signed: true }, secret: process.env.COOKIE_SECRET })
    await fastify.register(Cors, { methods: ["GET", "POST", "PUT"], origin: (origin, cb) => cb(null, true) })
    await fastify.register(fastifyOauth2, {
        name: "discordOAuth2",
        scope: ["identify", "email"],
        credentials: {
            client: {
                id: "<DISCORD_CLIENT_ID>",
                secret: "<DISCORD_CLIENT_SECRET>"
            },
            auth: fastifyOauth2.DISCORD_CONFIGURATION
        },
        startRedirectPath: "/login/discord",
        callbackUri: "http://localhost:3000/login/discord/callback"
    })

    await fastify.register(fastifyOauth2, {
        name: "githubOAuth2",
        scope: ["user:email"],
        credentials: {
            client: {
                id: "<GITHUB_CLIENT_ID>",
                secret: "<GITHUB_CLIENT_SECRET>"
            },
            auth: fastifyOauth2.GITHUB_CONFIGURATION
        },
        startRedirectPath: "/login/github",
        callbackUri: "http://localhost:3000/login/github/callback"
    })

    await fastify.register(fastifyOauth2, {
        name: "googleOAuth2",
        scope: ["profile", "email"],
        credentials: {
            client: {
                id: "<GOOGLE_CLIENT_ID>",
                secret: "<GOOGLE_CLIENT_SECRET>"
            },
            auth: fastifyOauth2.GOOGLE_CONFIGURATION
        },
        startRedirectPath: "/login/google",
        callbackUri: "http://localhost:3000/login/google/callback"
    })

    fastify.get("/", (_, reply) => reply.redirect("https://github.com/xcfio/chat-app"))
    fastify.addHook("onError", (_, reply, error) => {
        if ((error instanceof Error && error.message.startsWith("Rate limit exceeded")) || isFastifyError(error)) {
            throw error
        } else {
            console.trace(error)
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    await fastify.listen({
        host: "RENDER" in process.env ? `0.0.0.0` : `localhost`,
        port: Number(process.env.PORT ?? 7200)
    })

    console.log(
        `Server listening at http://${"RENDER" in process.env ? `0.0.0.0` : `localhost`}:${Number(
            process.env.PORT ?? 7200
        )}`
    )

    return fastify
}

main()
export default main
