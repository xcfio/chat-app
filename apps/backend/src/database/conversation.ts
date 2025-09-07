import { uuid, pgTable, timestamp } from "drizzle-orm/pg-core"
import { message } from "./message"
import { user } from "./user"
import { v7 } from "uuid"

export const conversation = pgTable("conversation", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    p1: uuid("p1")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    p2: uuid("p2")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    lastMessageId: uuid("last_message_id").references(() => message.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date())
})
