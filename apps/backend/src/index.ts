import { isFastifyError, ValidationErrorHandler } from "./function"

import RateLimit from "@fastify/rate-limit"
import Cors from "@fastify/cors"
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
    })

    fastify.get("/status", (_, reply) => reply.code(200).send("OK"))
    await fastify.register(RateLimit, {
        max: 10,
        timeWindow: 60000,
        keyGenerator: (req) => {
            const forwarded = req.headers["x-forwarded-for"]
            return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.ip
        }
    })

    await fastify.register(Cors, {
        methods: ["GET", "POST", "PUT"],
        origin: (origin, cb) => cb(null, true)
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
