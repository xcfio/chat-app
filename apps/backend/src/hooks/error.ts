import { isFastifyError, CreateError } from "../function"
import { main } from "../"

export default async function error(fastify: Awaited<ReturnType<typeof main>>) {
    fastify.addHook("onError", (_, __, error) => {
        if ((Error.isError(error) && error.message.startsWith("Rate limit exceeded")) || isFastifyError(error)) {
            throw error
        } else {
            console.trace(error)
            throw CreateError(500, "INTERNAL_SERVER_ERROR", "Internal Server Error")
        }
    })
}
