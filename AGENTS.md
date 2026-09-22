# AGENTS.md

## Project Overview

Presupuesto — personal finance manager (Spanish UI) built with Next.js 16 App Router, Prisma 7 + Neon PostgreSQL, Tailwind CSS v4, shadcn/ui, Zod 4.

`README.md` is stale create-next-app boilerplate (suggests npm/yarn) — ignore its commands; trust `package.json`.

## Commands

**Use `pnpm`** (pinned to `pnpm@10.32.1`):

- `pnpm dev` — dev server
- `pnpm lint` — ESLint · `pnpm format:check` / `pnpm format` — Prettier
- `npx tsc --noEmit` — typecheck (there is **no** `typecheck` script)
- `pnpm build` — runs `prisma generate && next build`
- `pnpm db:generate` / `pnpm db:pull` / `pnpm db:studio`

There is **no test suite and no CI** (`.github/` doesn't exist). Verify changes with: `pnpm lint` → `npx tsc --noEmit` → `pnpm build`.

Single package — `pnpm-workspace.yaml` only lists `onlyBuiltDependencies`, it is not a monorepo.

## Environment & Database

- `.env` is **not committed** (gitignored) — copy from `.env.example`. Requires `DATABASE_URL` (Neon) and `SESSION_SECRET`; a missing `SESSION_SECRET` throws at runtime inside `src/lib/auth.ts`.
- `src/generated/prisma/` is generated **and gitignored** — run `pnpm db:generate` on a fresh clone before typechecking (`pnpm build` runs it automatically).
- Prisma 7 config lives in `prisma7.config.ts` (loads dotenv). Generator `provider = "prisma-client"` → import the client from `@/generated/prisma/client`, **never** `@prisma/client`.
- **No migration files in the repo** — `prisma/schema.prisma` mirrors the live DB via `pnpm db:pull`. To apply schema edits, run `pnpm exec prisma db push` (no repo script exists), then `pnpm db:pull` to re-sync. Coordinate with the user before editing the schema, since a later `db:pull` overwrites local-only changes.
- Prisma client is a singleton in `src/lib/prisma.ts` using `@prisma/adapter-neon`. Services use `import "server-only"` — never import Prisma in client components.

## Auth (protected in two places)

- Custom HMAC-signed cookie session (`session`, 7-day expiry) in `src/lib/auth.ts` — no auth library. `getSession()` returns `{ userId, expiresAt } | null`; `verifyToken(token)` is for reading the cookie off a request.
- New authenticated routes must be added to the **`protectedRoutes` array in `src/proxy.ts`** (Next 16's replacement for middleware) — otherwise the route is publicly reachable even though `src/app/(app)/layout.tsx` also checks `getSession()`.
- Sign in/out: `src/app/(auth)/login/actions.ts` (`authenticateUser` → `createSession`). Auth pages live in `src/app/(auth)/` with no layout wrapper.

## Data Layer Pattern (per CRUD module)

1. **Service** (`src/services/<module>.ts`): `"use server"` + `import "server-only"`, wraps Prisma. Every query is scoped by `id_usuario`.
2. **Schema** (`src/schemas/<module>.ts`): Zod object + exported `...Input` type; re-export from `src/schemas/index.ts` and `src/services/index.ts`.
3. **Server actions** (`src/app/(app)/<module>/actions.ts`): `"use server"`; `getSession()` → Zod validate → service → `revalidatePath`. Mutations use the `_prev` signature `(_prev: State, data)` for `useActionState`; catch Prisma `"Unique constraint"` errors and return a friendly message.
4. **Components** (`src/components/<module>/`): `<module>-columns.tsx`, `<module>-dialog.tsx`, `delete-confirm-dialog.tsx`, `<plural>-table.tsx`.
5. **Page** (`src/app/(app)/<module>/page.tsx`): `"use client"`, renders the table; register the sidebar entry in `src/lib/nav.ts`.

**Copy the `formas-pago` module as the reference implementation** — it exercises the whole pattern (route folder `formas-pago` ↔ service/schema `forma_pago` ↔ components folder `forma-pago`; naming is intentionally not uniform across layers).

Current state: implemented modules are `dashboard`, `movimientos`, `categorias`, `formas-pago`, `configuracion` + auth. `presupuestos` and `reportes` routes exist but render `ModulePlaceholder` stubs.

### Serialization gotcha

Server-action return values cross the RSC boundary — convert Prisma types first: `Date` → `.toISOString()` (date inputs as `"YYYY-MM-DD"` via `.split("T")[0]`) and `Decimal` → `Number(...)`. See `src/app/(app)/movimientos/actions.ts`.

## UI Patterns

- **DataTable**: `@/components/ui/data-table.tsx` (`@tanstack/react-table`) — props `columns`, `data`, `searchPlaceholder`, `searchColumn`.
- **Columns**: `create<Module>Columns({ onEdit, onDelete })` returns `ColumnDef[]`.
- **Forms**: `react-hook-form` + `zodResolver`; use `Controller` for shadcn `Select`/`Checkbox`; `form.reset()` when the dialog opens.
- **Toasts**: `sonner` (`toast.success`/`toast.error`) · **Confirm**: `ConfirmDialog` in `src/components/common/`.
- shadcn CLI config: `components.json` (style `new-york`, aliases `@/components`, `@/lib/utils`, `@/components/ui`).

## Conventions & Constraints

- All UI copy and user-facing messages are **Spanish** — keep them Spanish.
- Prettier: double quotes, semicolons, printWidth 100, Tailwind class ordering via `prettier-plugin-tailwindcss` — run `pnpm format` before committing.
- `id_usuario` always comes from `session.userId` in server actions — never trust client input for record ownership.
- `categoria`, `cuenta`, `forma_pago` tables have unique `[id_usuario, nombre]` constraints and an index on `id_usuario`.
- Adding a route = update `src/lib/nav.ts` **and** `protectedRoutes` in `src/proxy.ts`.
- `CLAUDE.md` is a one-line import of this file (`@AGENTS.md`) — edit this file only.
