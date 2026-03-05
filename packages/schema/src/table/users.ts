import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-orm/typebox"
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
        name: text("name").notNull(),
        username: text("username").unique().notNull(),
        gender: Gender("gender").notNull(),
        avatar: text("avatar"),
        password: char("password", { length: 128 }).notNull(),
        ban: text("ban"),
        createdAt: timestamp("created_at", { withTimezone: false })
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: timestamp("updated_at", { withTimezone: false })
            .notNull()
            .$onUpdateFn(() => new Date())
    },
    (table) => [
        check("password_length_check", sql`length(${table.password}) = 128`),
        check("username_format_check", sql`${table.username} ~ '^[a-zA-Z][a-zA-Z0-9-]{3,11}$'`),
        check("email_format_check", sql`${table.email} ~ '^[^@]+@[^@]+\.[^@]+$'`)
    ]
)

export const UserInsert = createInsertSchema(users)
export const UserSelect = createSelectSchema(users)
export const UserUpdate = createUpdateSchema(users)
