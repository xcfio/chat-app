import { main } from "../"
import auth from "./auth"

export default async function Decorate(fastify: Awaited<ReturnType<typeof main>>) {
    await auth(fastify)
}
