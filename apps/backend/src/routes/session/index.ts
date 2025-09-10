import { main } from "../../"
import Logout from "./logout"

export default function Session(fastify: Awaited<ReturnType<typeof main>>) {
    Logout(fastify)
}
