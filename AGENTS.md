# AGENTS.md — Orbit

## Stack

React 19 + TypeScript 6 + Vite 8 (client) · Convex 1.34 (backend/DB, **self-hosted via Docker**) · Better Auth (email/password + Google) · Tailwind CSS v4

## Dev commands

- `npm run dev` — starts Vite dev server (expects Convex backend already running on :3210)
- `npm run build` — runs `tsc -b && vite build` (typecheck + bundle)
- `npm run lint` — `eslint .`
- No test framework installed.

## Convex (self-hosted)

- Start backend: `docker compose up -d` (from repo root). Runs Convex backend + dashboard.
- `.env.local` contains the self-hosted URL and admin key (already set up).
- **Codegen**: After changing `convex/` files, run `npx convex dev` (or it watches in dev mode). Output lands in `convex/_generated/` — do not edit manually.
- `convex/schema.ts` is the single source of truth for all tables. Edit it, then run codegen.

## Project structure

```
convex/       — Backend (schema + functions). All logic in .ts files.
src/          — Frontend (React components + hooks + types).
.docs/        — Full project docs: schema, API, components, gamification, roadmap, user stories.
```

## What this app is

"Orbit" — a personal professional networking / CRM tool. **Single-user**, no multi-tenant. All data belongs to the authenticated user.

## Key conventions

- **No styling effort** — Tailwind only for structural layout (flex, grid, padding). No colors, themes, animations unless functionally necessary.
- **Every page handles loading, empty, and error states** — show "Loading...", "No contacts yet" with a link to create, or "Something went wrong".
- **Convex mutations update contact counters** — `interactions.create` must increment `contact.interactionCount` and set `contact.lastInteractionAt`.
- **Streak + achievement checks** — triggered inside `interactions.create`, not from the frontend.
- **Follow-up notifications** — in-app only (badge + dashboard section), no push/email for now.
- **Avatar uploads** — use Convex file storage (`ctx.storage.store()` / `ctx.storage.getUrl()`). Works identically in self-hosted mode.
- **`verbatimModuleSyntax`** is on — use `import type` for type-only imports.
- **Tailwind v4 setup**: `npm i tailwindcss @tailwindcss/vite`, add `tailwindcss()` to `vite.config.ts`, use `@import "tailwindcss"` in CSS. No config file, no PostCSS.

## Source of truth

All design decisions live in `.docs/`. Consult the relevant file before implementing — each covers a specific area:

| File | Consult when touching… |
|---|---|
| `01-ARCHITECTURE.md` | Stack, folder structure, decisions |
| `02-SCHEMA.md` | Tables, indexes, TypeScript types |
| `03-API.md` | Queries, mutations, signatures |
| `04-COMPONENTS.md` | Component tree, routing, props |
| `05-GAMIFICATION.md` | Streaks, levels, achievements, aura |
| `06-ROADMAP.md` | Build phases with atomic tasks |
| `07-USER-STORIES.md` | 36 prioritized user stories |

## Gotchas

- `convex/auth.ts`, `convex/auth.config.ts`, `convex/http.ts`, `convex/convex.config.ts`, `src/lib/auth-client.ts` — auth boilerplate, do **not** modify.
- Self-hosted Convex uses ports 3210 (API) and 3211 (site proxy). `VITE_CONVEX_URL` and `VITE_CONVEX_SITE_URL` are set in `.env.local`.
- `tsc -b` requires BOTH `tsconfig.app.json` and `tsconfig.node.json` to compile.
