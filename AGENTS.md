# AGENTS.md

## Project Overview

Presupuesto — personal finance manager built with Next.js 16, Prisma 7, Tailwind CSS v4, and shadcn/ui components.

## Package Manager

**Use `pnpm`** (not npm/yarn): `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm db:generate`, `pnpm db:pull`, `pnpm db:studio`

## Key Architecture

### Route Structure
- `src/app/layout.tsx` — Root layout with `ThemeProvider` and `sonner.Toaster`
- `src/app/(app)/layout.tsx` — Authenticated layout (checks session via `getSession()`, redirects to `/login` if missing). Has sidebar + header.
- `src/app/(auth)/` — Login and registration pages (no layout wrapper)
- `src/app/(app)/` — All authenticated pages: dashboard, categorias, formas-pago, movimientos, presupuestos, reportes, configuracion

### Data Layer Pattern (for each CRUD module)
1. **Service** (`src/services/<module>.ts`): Uses `"use server"` + `import "server-only"`, wraps Prisma calls. All functions receive `id_usuario` from session.
2. **Schema** (`src/schemas/<module>.ts`): Zod validation object + exported type
3. **Server Actions** (`src/app/(app)/<module>/actions.ts`): `"use server"`, calls `getSession()` to get `session.userId`, validates with schema, delegates to service. Functions use `_prev` pattern for create/update.
4. **Components** (`src/components/<module>/`): Table (with `DataTable`), Dialog (with `react-hook-form` + `zodResolver` + `Controller`), DeleteConfirmDialog, Columns definitions
5. **Page** (`src/app/(app)/<module>/page.tsx`): Uses `"use client"`, renders the table component

### Prisma & Database
- **Prisma 7.x** with `@prisma/adapter-neon` for Neon PostgreSQL
- Client generated to `src/generated/prisma/` (NOT `node_modules/@prisma/client`)
- Generator uses `provider = "prisma-client"` (not `prisma-client-js`)
- Schema models use `@db.Uuid`, `@db.VarChar()`, `gen_random_uuid()`, `@db.Timestamptz(6)`
- Tables have unique constraints on `[id_usuario, nombre]` and indexes on `id_usuario`
- No migration files in repo — DB is pulled directly via `pnpm db:pull`

### Auth System
- Custom cookie-based session (`SESSION_COOKIE = "session"`, 7-day expiry)
- `getSession()` from `@/lib/auth.ts` returns `{ userId, expiresAt } | null`
- Server actions ALWAYS call `getSession()` to get `session.userId` for data ownership
- Sign in: `src/app/(auth)/login/actions.ts` calls `authenticateUser` then `createSession`

### UI Patterns
- **DataTable**: `@/components/ui/data-table.tsx` — uses `@tanstack/react-table`. Accepts `columns`, `data`, `searchPlaceholder`, `searchColumn` props
- **Column definitions**: `create<Module>Columns({ onEdit, onDelete })` returns `ColumnDef[]`
- **Forms**: `react-hook-form` + `zodResolver`. Use `Controller` for shadcn `Select` and `Checkbox`. Pattern: `form.reset()` on dialog open
- **Toast**: `sonner` for notifications (`toast.success()`, `toast.error()`)
- **Confirm dialog**: `ConfirmDialog` component in `src/components/common/`

### Module Creation Checklist
When adding a new CRUD module:
1. Add model to `prisma/schema.prisma`
2. Run `pnpm db:generate` to regenerate Prisma client
3. Create `src/services/<module>.ts` (CRUD functions, all scoped to `id_usuario`)
4. Create `src/schemas/<module>.ts` (Zod schema + type)
5. Export from `src/schemas/index.ts` and `src/services/index.ts`
6. Create `src/app/(app)/<module>/actions.ts` (server actions with `_prev` pattern)
7. Create `src/components/<module>/forma-pago-columns.tsx`, `forma-pago-dialog.tsx`, `delete-confirm-dialog.tsx`, `formas-pago-table.tsx`
8. Create `src/app/(app)/<module>/page.tsx`

## Important Constraints
- All server actions use `"use server"` directive at the top of the file
- Services use `import "server-only"` to prevent client-side bundling
- Never import Prisma directly in client components
- The `id_usuario` always comes from `session.userId` in server actions
- `forma_pago`, `categoria`, `cuenta` tables all follow the same pattern with `id_usuario` and unique `[id_usuario, nombre]` constraints
- Navigation items defined in `src/lib/nav.ts` — add new items there when adding routes

## Environment
- `.env` contains `DATABASE_URL` and `SESSION_SECRET` (already committed)
- `src/generated/prisma/` contains generated Prisma client — don't manually edit
- `pnpm` lockfile: `pnpm-lock.yaml`
