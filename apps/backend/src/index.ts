import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { ValidationErrorHandler, xcf } from "./function"
import { AuthenticatedSocket } from "schema"
import Decorate from "./decorate"
import Routes from "./routes"
import Plugin from "./plugin"
import Socket from "./socket"
import Fastify from "fastify"
import Hooks from "./hooks"
import * as _ from "./type"

export let io: AuthenticatedSocket
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

    await Plugin(fastify)
    Decorate(fastify)
    Routes(fastify)
    Hooks(fastify)

    await fastify.listen({ host: "0.0.0.0", port: 7200 })
    console.log(`Server listening at http://localhost:7200`)

    // @ts-ignore
    fastify.io.on("connection", Socket(fastify))
    io = fastify.io

    return fastify
}

process.on("uncaughtException", (err: Error, origin: string) => xcf(err, "Uncaught Exception", origin, false))
process.on("unhandledRejection", (reason: Error, origin: string) => xcf(reason, "Unhandled Rejection", origin, false))
process.on("uncaughtExceptionMonitor", (err: Error, origin: string) => xcf(err, "Uncaught Exception", origin, false))
main()
