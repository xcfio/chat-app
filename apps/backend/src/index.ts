import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { ValidationErrorHandler } from "./function"
import Decorate from "./decorate"
import Routes from "./routes"
import Plugin from "./plugin"
import Fastify from "fastify"
import Hooks from "./hooks"

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

    return fastify
}

// prettier-ignore
process.on("uncaughtException", (err: Error, origin: string) => console.log(err, "Uncaught Exception", origin, false))
// prettier-ignore
process.on("unhandledRejection", (reason: Error, origin: string) => console.log(reason, "Unhandled Rejection", origin, false))
// prettier-ignore
process.on("uncaughtExceptionMonitor", (err: Error, origin: string) => console.log(err, "Uncaught Exception", origin, false))

main()
