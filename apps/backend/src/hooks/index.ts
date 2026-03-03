import { main } from "../"
import error from "./error"

export default async function Hooks(fastify: Awaited<ReturnType<typeof main>>) {
    await error(fastify)
}
