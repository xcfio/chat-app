import { uuid, pgTable, text, timestamp, pgEnum, char, check } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { v7 } from "uuid"

export const Gender = pgEnum("gender", ["male", "female", "other"])
export const users = pgTable(
    "users",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => v7()),
        email: text("email").notNull().unique(),
        username: text("username").unique().notNull(),
        name: text("name").notNull(),
        gender: Gender("gender").notNull(),
        avatar: text("avatar"),
        password: char("password", { length: 64 }).notNull(),
        ban: text("ban"),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: timestamp("updated_at", { withTimezone: false })
            .notNull()
            .$onUpdateFn(() => new Date())
    },
    (table) => [check("password_length_check", sql`length(${table.password}) = 128`)]
)
