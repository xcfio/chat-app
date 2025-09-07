import { CreateError, isFastifyError, ValidationErrorHandler } from "./function"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { FastifyReply, FastifyRequest } from "fastify"
import { bugs, license } from "../package.json"
import RateLimit from "@fastify/rate-limit"
import SwaggerUI from "@fastify/swagger-ui"
import fastifyIO from "fastify-socket.io"
import Swagger from "@fastify/swagger"
import Cookie from "@fastify/cookie"
import Cors from "@fastify/cors"
import JTW from "@fastify/jwt"
import Fastify from "fastify"
import Routes from "./routes"
import Socket from "./socket"

export async function main() {
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
        max: 20,
        timeWindow: 60000,
        keyGenerator: (req) => {
            const forwarded = req.headers["x-forwarded-for"]
            return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip
        }
    })

    await fastify.register(Swagger, {
        openapi: {
            openapi: "3.1.0",
            info: {
                title: "Chat App API",
                description:
                    "RESTful API for real-time chat application with user authentication and message management",
                version: "1.0.0",
                license: {
                    name: license,
                    url: "https://opensource.org/licenses/MIT"
                },
                contact: {
                    email: bugs.url,
                    name: "Discord",
                    url: "https://discord.com/invite/FaCCaFM74Q"
                },
                termsOfService: "/terms"
            },
            tags: [
                { name: "Auth", description: "Authentication endpoints" },
                { name: "Users", description: "User management" },
                { name: "Messages", description: "Chat message operations" },
                { name: "Rooms", description: "Chat room management" }
            ]
        }
    })

    await fastify.register(SwaggerUI, {
        routePrefix: "/",
        staticCSP: true,
        transformSpecificationClone: true,
        uiConfig: {
            defaultModelRendering: "example",
            docExpansion: "list",
            displayRequestDuration: true,
            showCommonExtensions: false,
            displayOperationId: false,
            tryItOutEnabled: false,
            showExtensions: false,
            deepLinking: false,
            filter: true,
            defaultModelsExpandDepth: 1,
            defaultModelExpandDepth: 1,
            supportedSubmitMethods: []
        },
        theme: {
            title: "Chat App API Documentation",
            css: [
                {
                    filename: "custom.css",
                    content: `
                    .swagger-ui .top-bar { display: none; }
                    .swagger-ui .info { margin: 20px 0; }
                    .swagger-ui .info .title { color: #3b4151; }
                `
                }
            ]
        },
        logo: {
            type: "image/svg+xml",
            href: "https://github.com/xcfio/chat-app",
            target: "_blank",
            content: await (
                await fetch(
                    "https://raw.githubusercontent.com/xcfio/chat-app/refs/heads/main/apps/frontend/public/favicon.svg"
                )
            ).text()
        }
    })

    await fastify.register(fastifyIO)
    await fastify.register(Cookie, { secret: process.env.COOKIE_SECRET })
    await fastify.register(JTW, { cookie: { cookieName: "auth", signed: true }, secret: process.env.COOKIE_SECRET })
    await fastify.register(Cors, { methods: ["GET", "POST", "PUT"], origin: (origin, cb) => cb(null, true) })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
        } catch (error) {
            throw CreateError(401, "NOT_AUTHENTICATED", "Authentication required")
        }
    })

    Routes(fastify)
    fastify.get("/terms", () => "ToS?? Forget about it")
    fastify.addHook("onError", (_, reply, error) => {
        if ((Error.isError(error) && error.message.startsWith("Rate limit exceeded")) || isFastifyError(error)) {
            throw error
        } else {
            console.trace(error)
            return reply.code(500).send({ error: "Internal Server Error" })
        }
    })

    await fastify.listen({ host: `localhost`, port: 7200 })
    console.log(`Server listening at http://localhost:7200`)

    fastify.io.on("connection", Socket)
    return fastify
}

main()
