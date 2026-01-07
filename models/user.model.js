import { pgTable, varchar, uuid, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 25 }).notNull(),
  lastName: varchar("last_name", { length: 25 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
