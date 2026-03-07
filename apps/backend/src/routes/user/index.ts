import { main } from "../../"
import GetUserByID from "./get-user-by-id"
import GetUsers from "./get-users"

export default function User(fastify: Awaited<ReturnType<typeof main>>) {
    GetUsers(fastify)
    GetUserByID(fastify)
}
