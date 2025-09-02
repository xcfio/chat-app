import { drizzle } from "drizzle-orm/postgres-js"
import { message } from "./message"
import { member } from "./members"
import { user } from "./user"
import { room } from "./room"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = { member, message, room, user } as const
