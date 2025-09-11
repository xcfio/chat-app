import fastifyIO from "fastify-socket.io"
import { main } from "../"

export default async function socket(fastify: Awaited<ReturnType<typeof main>>) {
    await fastify.register(fastifyIO)
}
