import Cors from "@fastify/cors"
import { main } from "../"

export default async function cors(fastify: Awaited<ReturnType<typeof main>>) {
    await fastify.register(Cors, {
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH"],
        origin: (origin, cb) => cb(null, true)
    })
}
