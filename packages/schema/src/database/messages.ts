import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-orm/typebox"
import { uuid, pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { conversations } from "./conversations"
import { users } from "./users"
import { v7 } from "uuid"

export const status = pgEnum("status", ["sent", "delivered", "read", "edited", "deleted"])
export const messages = pgTable("messages", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    content: text("content").notNull(),
    sender: uuid("sender")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    receiver: uuid("receiver")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    conversation: uuid("conversation")
        .notNull()
        .references(() => conversations.id, { onDelete: "cascade" }),
    status: status("status").notNull().default("sent"),
    createdAt: timestamp("created_at", { withTimezone: false })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: timestamp("updated_at", { withTimezone: false })
        .notNull()
        .$onUpdateFn(() => new Date())
})

export const MessageInsert = createInsertSchema(messages)
export const MessageSelect = createSelectSchema(messages)
export const MessageUpdate = createUpdateSchema(messages)
