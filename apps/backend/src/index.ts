import { CreateError, isFastifyError, ValidationErrorHandler } from "./function"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { FastifyReply, FastifyRequest } from "fastify"
import Fastify from "fastify"
import Routes from "./routes"
import Socket from "./socket"
import Plugin from "./plugin"

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
    await Plugin(fastify)

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
