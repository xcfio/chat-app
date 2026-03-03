import { drizzle } from "drizzle-orm/postgres-js"
import { users } from "./users"
import postgres from "postgres"

export const db = drizzle({ client: postgres(process.env.DATABASE_URI) })
export const table = {
    users
} as const

export * from "./type"
