import { CreateError, isFastifyError, ValidationErrorHandler } from "./function"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { FastifyReply, FastifyRequest } from "fastify"
import RateLimit from "@fastify/rate-limit"
import fastifyIO from "fastify-socket.io"
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
        max: 10,
        timeWindow: 60000,
        keyGenerator: (req) => {
            const forwarded = req.headers["x-forwarded-for"]
            return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip
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
    fastify.get("/", async (_, reply) => reply.redirect("https://github.com/xcfio/chat-app"))
    fastify.addHook("onError", (_, reply, error) => {
        if ((error instanceof Error && error.message.startsWith("Rate limit exceeded")) || isFastifyError(error)) {
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
