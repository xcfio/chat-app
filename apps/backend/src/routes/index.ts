import { main } from "../"
import Auth from "./auth"

export default function Routes(fastify: Awaited<ReturnType<typeof main>>) {
    Auth(fastify)
}
