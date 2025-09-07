import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./user"
import { v7 } from "uuid"

export const message = pgTable("message", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    content: text("content").notNull(),
    senderId: uuid("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    editedAt: timestamp("edited_at", { withTimezone: false }),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow().notNull()
})
