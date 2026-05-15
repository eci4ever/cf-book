import {
  type ComponentProps,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useMemo,
  useState,
  useTransition,
} from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { BookOpen, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "#/feature/book/book.function";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book/")({
  loader: () => getBooks(),
  component: BooksPage,
});

type Book = Awaited<ReturnType<typeof getBooks>>[number];

type BookForm = {
  title: string;
  author: string;
  isbn: string;
};

const emptyForm: BookForm = {
  title: "",
  author: "",
  isbn: "",
};

function BooksPage() {
  const router = useRouter();
  const books = Route.useLoaderData();
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return books;
    }

    return books.filter((book) => {
      return [book.title, book.author, book.isbn].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [books, query]);

  function updateForm(field: keyof BookForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingBook(null);
    setError(null);
  }

  function editBook(book: Book) {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    });
    setError(null);
  }

  function runMutation(mutation: () => Promise<void>, successMessage: string) {
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          await mutation();
          await router.invalidate();
          toast.success(successMessage);
        } catch (cause) {
          const message =
            cause instanceof Error
              ? cause.message
              : "Unable to save the book changes.";

          setError(message);
          toast.error(message);
        }
      })();
    });
  }

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
    };

    const isEditing = Boolean(editingBook);

    runMutation(
      async () => {
        if (editingBook) {
          await updateBook({
            data: {
              id: editingBook.id,
              ...payload,
            },
          });
        } else {
          await createBook({ data: payload });
        }

        resetForm();
      },
      isEditing ? "Book updated." : "Book created.",
    );
  };

  function handleDelete(book: Book) {
    runMutation(
      async () => {
        await deleteBook({ data: { id: book.id } });

        if (editingBook?.id === book.id) {
          resetForm();
        }
      },
      "Book deleted.",
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <BookOpen className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h1 className="text-base font-semibold">
                    {editingBook ? "Edit book" : "Add book"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {editingBook ? `#${editingBook.id}` : "New record"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5">
              <Field
                id="title"
                label="Title"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                placeholder="Book title"
              />
              <Field
                id="author"
                label="Author"
                value={form.author}
                onChange={(value) => updateForm("author", value)}
                placeholder="Author name"
              />
              <Field
                id="isbn"
                label="ISBN"
                value={form.isbn}
                onChange={(value) => updateForm("isbn", value)}
                placeholder="978-0000000000"
              />

              {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="mt-auto flex items-center gap-2 border-t px-5 py-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {editingBook ? (
                  <Save className="size-4" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {editingBook ? "Save" : "Create"}
              </Button>
              {editingBook ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={resetForm}
                >
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="min-w-0 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Books</h2>
              <p className="text-sm text-muted-foreground">
                {books.length} {books.length === 1 ? "record" : "records"}
              </p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Search books</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Search books"
                type="search"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-180 caption-bottom text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="w-28 text-right">Actions</TableHead>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className={cn(
                        "border-b transition-colors last:border-b-0 hover:bg-muted/40",
                        editingBook?.id === book.id && "bg-muted/60",
                      )}
                    >
                      <TableCell className="font-mono text-muted-foreground">
                        {book.id}
                      </TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {book.isbn}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => editBook(book)}
                            disabled={isPending}
                            aria-label={`Edit ${book.title}`}
                          >
                            <Pencil className="size-4" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(book)}
                            disabled={isPending}
                            aria-label={`Delete ${book.title}`}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-32 px-4 text-center text-sm text-muted-foreground"
                    >
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("h-10 px-4 text-left align-middle font-medium", className)}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
