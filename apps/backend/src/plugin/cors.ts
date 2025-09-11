import Cors from "@fastify/cors"
import { main } from "../"

export default async function cors(fastify: Awaited<ReturnType<typeof main>>) {
    await fastify.register(Cors, {
        methods: ["GET", "POST", "PUT"],
        origin: (origin, cb) => cb(null, true)
    })
}
