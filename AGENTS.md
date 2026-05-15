# AGENTS.md — Project Instructions

This project uses:

- **TanStack Start** as the full-stack framework
- **React** for UI
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Cloudflare D1** as the database
- **Drizzle ORM** for database queries
- **Better Auth** for authentication
- **TanStack Query** for mutations
- **pnpm** as the only package manager

These instructions are for Codex or any AI coding agent working in this repo.

---

## 1. Important Rules

Before changing code:

1. Read this `AGENTS.md`.
2. Look at the related files first.
3. Explain the plan in simple words.
4. Keep changes small.
5. Do not edit unrelated files.

Do not add new packages unless I approve.

Do not use `npm`, `yarn`, or `bun`.

Always use `pnpm`.

---

## 2. Package Manager

This project uses **pnpm only**.

Use commands like:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm cf-typegen
pnpm build
pnpm run generate
pnpm run db:migrate:local
pnpm run db:migrate:remote
```

Never use:

```bash
npm install
npm run dev
yarn
bun
```

If a script is needed, check `package.json` first.

---

## 3. TanStack Start Rules

Use the existing TanStack Start structure in this repo.

Keep server code on the server.

Keep browser/UI code in React components.

Do not put database code inside client components.

Use server functions or existing server-side patterns for actions that need database access.

Before making a change, check whether the code should run:

- on the server
- in the browser
- or during route loading

---

## 4. React UI Rules

Use React components for the UI.

Keep components simple.

Prefer:

- small components
- clear props
- simple state
- loading states
- error states
- success messages when useful

Avoid:

- very large components
- complicated logic inside JSX
- unnecessary `useEffect`
- mixing database logic with UI code

---

## 5. Tailwind CSS Rules

Use Tailwind CSS for styling.

Follow the style already used in the project.

Prefer simple Tailwind classes.

Avoid custom CSS unless needed.

Do not hard-code colors if the project already has theme colors or shadcn styles.

---

## 6. shadcn/ui Rules

Use existing shadcn/ui components when possible.

Look for components in places like:

- `components/ui`
- `src/components/ui`

Do not overwrite existing shadcn components unless I ask.

Follow the existing import style.

For forms, buttons, cards, dialogs, tables, inputs, and alerts, prefer existing shadcn/ui components.

---

## 7. Database Rules: D1 + Drizzle

The database is **Cloudflare D1**.

Use **Drizzle ORM** for database access.

Important:

- Database code must run on the server only.
- Do not access D1 from React client components.
- Do not expose database bindings or secrets to the browser.
- Do not use raw SQL unless there is a clear reason.
- Do not change database schema or migrations without explaining first.

For database writes:

1. Validate the input.
2. Check user permission if needed.
3. Use Drizzle.
4. Return only safe data to the client.

---

## 8. TanStack Query Mutation Rules

Use **TanStack Query `useMutation`** for client actions that create, update, delete, or submit data.

Example use cases:

- create item
- update item
- delete item
- submit form
- save settings

Mutation should call a server function or existing server-side action.

Do not put Drizzle or D1 code inside `mutationFn`.

Basic pattern:

```tsx
const mutation = useMutation({
  mutationFn: async (input: FormInput) => {
    return await saveSomething({ data: input })
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['items'] })
  },
})
```

When adding mutation, handle:

- loading state
- error state
- success state if useful
- query invalidation after success

---

## 9. Simple Data Flow

For writing data, follow this flow:

```txt
React UI
  -> TanStack Query useMutation
    -> TanStack Start server function
      -> validate input
        -> Drizzle ORM
          -> Cloudflare D1
```

Do not skip directly from React UI to D1.

---

## 10. Validation and Errors

Always validate data on the server before saving to database.

Client-side validation is helpful, but it is not enough.

Error messages should be clear and safe.

Do not show:

- secrets
- stack traces
- SQL errors
- internal database details

---

## 11. Auth and Permissions

This project will use **Better Auth** for authentication.

Use Better Auth patterns for sign up, login, logout, sessions, and current-user checks.

Do not create a custom authentication system unless I ask.

For user-specific data:

- Check the current user on the server.
- Do not trust user IDs sent from the browser.
- Make sure the user can access or edit the data.
- For update/delete, confirm the record belongs to the user or tenant.

---

## 12. Environment Files

Be careful with these files:

- `.env`
- `.env.local`
- `.dev.vars`
- `wrangler.toml`
- migration files
- deployment config

Do not edit them unless the task clearly needs it.

Never commit secrets.

---

## 13. Testing and Checking

Before saying the task is complete, run the relevant pnpm commands.

Check `package.json` first.

Common commands:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Do not say a command passed unless it was actually run.

If a command fails:

1. Show which command failed.
2. Explain the error simply.
3. Fix it if the error was caused by your changes.
4. If it is unrelated, say so clearly.

---

## 14. Ask Before High-Risk Changes

Ask first before changing:

- database schema
- migrations
- authentication logic
- authorization logic
- Cloudflare D1 binding config
- `wrangler.jsonc`
- environment files
- package dependencies
- deployment config
- large refactors
- deleting files or code

---

## 15. Final Reply Format

At the end of a task, reply like this:

```md
## Summary
- What changed

## Files Changed
- file path — why it changed

## Checks Run
- pnpm lint — passed/failed/not run
- pnpm typecheck — passed/failed/not run
- pnpm build — passed/failed/not run

## Notes
- Anything important, risky, or not completed
```

Be honest.

Do not hide failures.

Do not say everything is complete if checks were not run.

---

## 16. Default Codex Prompt

Use this when starting Codex:

```txt
Read AGENTS.md first.

Task:
[describe what I want]

Please:
- explain the plan before editing
- keep changes small
- use pnpm only
- use React, Tailwind, and existing shadcn/ui components for UI
- use TanStack Query useMutation for client-side create/update/delete actions
- keep D1 and Drizzle code on the server only
- validate input on the server
- do not add packages without approval
- run relevant pnpm checks before final summary
```
