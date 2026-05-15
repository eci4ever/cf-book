import { sql } from "drizzle-orm/sql/sql";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const booksTable = sqliteTable("books_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  author: text().notNull(),
  isbn: text().notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`,
  ),
});
