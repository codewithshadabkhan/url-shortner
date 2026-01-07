import { pgTable, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model.js";

export const urlsTables = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  shortCode: varchar("code", { length: 25 }).notNull().unique(),
  tragateURL: text("traget_url").notNull(),
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
