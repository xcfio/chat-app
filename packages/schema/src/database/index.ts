import { drizzle } from "drizzle-orm/postgres-js"
import { conversations } from "./conversations"
import { messages } from "./messages"
import { users } from "./users"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = {
    conversations,
    messages,
    users
} as const
