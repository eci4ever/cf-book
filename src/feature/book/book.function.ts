import { createServerFn } from "@tanstack/react-start";

import {
  bookInputSchema,
  deleteBookInputSchema,
  editBook,
  insertBook,
  listBooks,
  removeBook,
  updateBookInputSchema,
} from "@/feature/book/book.server";

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return listBooks();
});

export const createBook = createServerFn({ method: "POST" })
  .inputValidator(bookInputSchema)
  .handler(async ({ data }) => {
    return insertBook(data);
  });

export const updateBook = createServerFn({ method: "POST" })
  .inputValidator(updateBookInputSchema)
  .handler(async ({ data }) => {
    return editBook(data);
  });

export const deleteBook = createServerFn({ method: "POST" })
  .inputValidator(deleteBookInputSchema)
  .handler(async ({ data }) => {
    return removeBook(data);
  });
