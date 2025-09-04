import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

export const user = pgTable("user", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    type: text("type").notNull().$type<"discord" | "github" | "google">(),
    token: text("token").notNull(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    name: text("name"),
    avatar: text("avatar"),
    lastSeen: timestamp("last_seen").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date())
})
