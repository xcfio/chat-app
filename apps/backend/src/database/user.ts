import { uuid, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { v7 } from "uuid"

export const user = pgTable("user", {
    id: uuid("id")
        .unique()
        .primaryKey()
        .$defaultFn(() => v7()),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatar: text("avatar"),

    oauthProvider: text("oauth_provider").notNull().$type<"discord" | "github" | "google">(),
    oauthId: text("oauth_id").notNull(),

    lastSeen: timestamp("last_seen").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdateFn(() => new Date())
})
