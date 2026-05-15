import {
  type ComponentProps,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
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
  component: BooksPage,
});

type Book = Awaited<ReturnType<typeof getBooks>>[number];
type BookMutationInput = BookForm & {
  id?: number;
};

const booksQueryKey = ["books"] as const;

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
  const queryClient = useQueryClient();
  const {
    data: books = [],
    error: booksError,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: booksQueryKey,
    queryFn: () => getBooks(),
  });
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [pendingDeleteBook, setPendingDeleteBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [error, setError] = useState<string | null>(null);

  const saveBookMutation = useMutation({
    mutationFn: async (data: BookMutationInput) => {
      if (data.id) {
        await updateBook({
          data: {
            id: data.id,
            title: data.title,
            author: data.author,
            isbn: data.isbn,
          },
        });

        return "Book updated.";
      }

      await createBook({
        data: {
          title: data.title,
          author: data.author,
          isbn: data.isbn,
        },
      });

      return "Book created.";
    },
    onSuccess: async (message) => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: booksQueryKey });
      toast.success(message);
    },
    onError: (cause) => {
      const message = getErrorMessage(cause);

      setError(message);
      toast.error(message);
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (book: Book) => {
      await deleteBook({ data: { id: book.id } });

      return book;
    },
    onSuccess: async (book) => {
      if (editingBook?.id === book.id) {
        resetForm();
      }

      setPendingDeleteBook(null);
      await queryClient.invalidateQueries({ queryKey: booksQueryKey });
      toast.success("Book deleted.");
    },
    onError: (cause) => {
      const message = getErrorMessage(cause);

      setError(message);
      toast.error(message);
    },
  });

  const isMutating = saveBookMutation.isPending || deleteBookMutation.isPending;

  const columns: ColumnDef<Book>[] = [
    {
      id: "no",
      header: "No",
      enableGlobalFilter: false,
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
    },
    {
      accessorKey: "isbn",
      header: "ISBN",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.isbn}</span>
      ),
    },
    {
      id: "actions",
      enableGlobalFilter: false,
      enableSorting: false,
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editBook(row.original)}
            disabled={isMutating}
            aria-label={`Edit ${row.original.title}`}
          >
            <Pencil className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteRequest(row.original)}
            disabled={isMutating}
            aria-label={`Delete ${row.original.title}`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: books,
    columns,
    state: {
      globalFilter: query,
      pagination,
      sorting,
    },
    onGlobalFilterChange: setQuery,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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

  const handleSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
    };

    setError(null);
    saveBookMutation.mutate({
      id: editingBook?.id,
      ...payload,
    });
  };

  function handleDeleteRequest(book: Book) {
    setPendingDeleteBook(book);
    setError(null);
  }

  function handleDeleteConfirm() {
    if (!pendingDeleteBook) {
      return;
    }

    setError(null);
    deleteBookMutation.mutate(pendingDeleteBook);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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
              {editingBook ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isMutating}
                  onClick={resetForm}
                >
                  <X className="size-4" aria-hidden="true" />
                  Cancel
                </Button>
              ) : null}
            </div>

            <div className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] md:items-end">
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

              <Button type="submit" disabled={isMutating} className="md:self-end">
                {editingBook ? (
                  <Save className="size-4" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                {saveBookMutation.isPending
                  ? "Saving"
                  : editingBook
                    ? "Save"
                    : "Create"}
              </Button>

              {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive md:col-span-4">
                  {error}
                </div>
              ) : null}
            </div>
          </form>
        </section>

        <section className="min-w-0 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Books</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Loading records"
                  : `${table.getFilteredRowModel().rows.length} of ${books.length} ${
                      books.length === 1 ? "record" : "records"
                    }`}
                {isFetching && !isLoading ? " · Refreshing" : null}
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={getTableColumnClassName(header.column.id)}
                      >
                        {header.isPlaceholder ? null : (
                          <TableHeaderContent
                            canSort={header.column.getCanSort()}
                            onSort={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </TableHeaderContent>
                        )}
                      </TableHead>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={table.getAllLeafColumns().length}
                      className="h-32 px-4 text-center text-sm text-muted-foreground"
                    >
                      Loading books...
                    </td>
                  </tr>
                ) : booksError ? (
                  <tr>
                    <td
                      colSpan={table.getAllLeafColumns().length}
                      className="h-32 px-4 text-center text-sm text-destructive"
                    >
                      {getErrorMessage(booksError)}
                    </td>
                  </tr>
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row, rowIndex) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b transition-colors last:border-b-0 hover:bg-muted/40",
                        editingBook?.id === row.original.id && "bg-muted/60",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={getTableColumnClassName(cell.column.id)}
                        >
                          {cell.column.id === "no"
                            ? table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                              rowIndex +
                              1
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                        </TableCell>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={table.getAllLeafColumns().length}
                      className="h-32 px-4 text-center text-sm text-muted-foreground"
                    >
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(table.getPageCount(), 1)}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Rows
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => table.setPageSize(Number(event.target.value))}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={!table.getCanPreviousPage() || isLoading}
                  onClick={() => table.setPageIndex(0)}
                  aria-label="First page"
                >
                  <ChevronsLeft className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={!table.getCanPreviousPage() || isLoading}
                  onClick={() => table.previousPage()}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={!table.getCanNextPage() || isLoading}
                  onClick={() => table.nextPage()}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={!table.getCanNextPage() || isLoading}
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  aria-label="Last page"
                >
                  <ChevronsRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {pendingDeleteBook ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-book-title"
          aria-describedby="delete-book-description"
        >
          <div className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-lg">
            <div className="flex gap-3 px-5 py-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="delete-book-title" className="text-base font-semibold">
                  Delete book
                </h2>
                <p
                  id="delete-book-description"
                  className="mt-1 text-sm text-muted-foreground"
                >
                  This will permanently remove "{pendingDeleteBook.title}".
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <Button
                type="button"
                variant="outline"
                disabled={isMutating}
                onClick={() => setPendingDeleteBook(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isMutating}
                onClick={handleDeleteConfirm}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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

function TableHeaderContent({
  canSort,
  children,
  onSort,
}: {
  canSort: boolean;
  children: ReactNode;
  onSort?: ComponentProps<"button">["onClick"];
}) {
  if (!canSort) {
    return children;
  }

  return (
    <button
      type="button"
      onClick={onSort}
      className="-ml-2 inline-flex h-8 items-center gap-1 rounded-md px-2 text-left font-medium transition hover:bg-muted hover:text-foreground"
    >
      {children}
      <ArrowUpDown className="size-3.5" aria-hidden="true" />
    </button>
  );
}

function getTableColumnClassName(columnId: string) {
  if (columnId === "no") {
    return "w-16";
  }

  if (columnId === "actions") {
    return "w-28 text-right";
  }

  return undefined;
}

function getErrorMessage(cause: unknown) {
  return cause instanceof Error
    ? cause.message
    : "Unable to save the book changes.";
}
