import { env } from "cloudflare:workers";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { createDb } from "@/db";
import { booksTable } from "@/db/schema";

const db = createDb(env.DB);

export const bookIdSchema = z
  .number()
  .int("A valid book ID is required.")
  .positive("A valid book ID is required.");

export const bookInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  author: z.string().trim().min(1, "Author is required."),
  isbn: z.string().trim().min(1, "ISBN is required."),
});

export const updateBookInputSchema = bookInputSchema.extend({
  id: bookIdSchema,
});

export const deleteBookInputSchema = z.object({
  id: bookIdSchema,
});

export async function listBooks() {
  return db.select().from(booksTable).orderBy(asc(booksTable.id));
}

export async function insertBook(data: z.infer<typeof bookInputSchema>) {
  const [book] = await db.insert(booksTable).values(data).returning();

  return book;
}

export async function editBook(data: z.infer<typeof updateBookInputSchema>) {
  await db
    .update(booksTable)
    .set({
      title: data.title,
      author: data.author,
      isbn: data.isbn,
    })
    .where(eq(booksTable.id, data.id));

  return { id: data.id };
}

export async function removeBook(data: z.infer<typeof deleteBookInputSchema>) {
  await db.delete(booksTable).where(eq(booksTable.id, data.id));

  return { id: data.id };
}
