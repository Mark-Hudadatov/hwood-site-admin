# PROJECT.md

Context and identity for the HWOOD platform. Read before making product decisions.

---

## What is HWOOD

HWOOD is a multi-direction CNC factory (wood, MDF, aluminum, composites).

**The platform is NOT a marketing site and NOT a WhatsApp replacement.**
It is a hybrid B2B lead capture tool: client arrives via WhatsApp, Google Search, AI-chat, map, or direct — manager gets structured data (WHO + WHAT + WHEN) before the first call.

- **Client:** Igor Harpov / Skylum LTD
- **Developer / lead:** Mark Khudadatov

---

## Two-Brand Model

| Brand | Materials | Services |
|-------|-----------|---------|
| **HWOOD** | Wood, MDF, ЛДСП | Cabinet Modules, Fronts, Custom Kitchen, CNC Services |
| **Skylum** | Aluminum, ACP, HPL | Facade Systems & ACP, Materials & Panel Supply |

Both brands share one codebase and one Supabase database. Brand is identified per-service via the `brand` column (`'hwood'` | `'skylum'`).

---

## Services v2.0 (staging only — prod still has old names)

| # | Service | Brand | Order Type |
|---|---------|-------|-----------|
| 1 | Cabinet & Storage Modules | HWOOD | browse-and-order |
| 2 | Interior Fronts & Surfaces | HWOOD | browse-and-order |
| 3 | Custom Kitchen Projects | HWOOD | describe-and-request |
| 4 | CNC Services for Professionals | HWOOD | send-file-and-process |
| 5 | Facade Systems & ACP | Skylum | describe-and-request |
| 6 | Materials & Panel Supply | Skylum | informational |

> **WARNING:** Prod Supabase still has OLD service names. Staging has v2.0 names. Do not confuse.

---

## Supabase — Shared DB Warning

Staging and prod **share one database.**

- Schema changes (`ALTER TABLE`) apply immediately to both
- Data changes via staging admin panel are visible on prod
- **Rule:** data changes only via Supabase SQL Editor directly — never via staging admin panel
- Schema changes only when ready for prod impact

---

## Tech Stack (locked)

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript (strict) |
| Build | Vite + TailwindCSS (custom config) |
| Routing | React Router v6 (slug-based) |
| Backend | Supabase (Postgres + Auth + Storage) |
| i18n | react-i18next (UI) + custom dataService (content) |
| Components | shadcn/ui + Radix UI (on top of existing Tailwind) |
| Drag-drop | @dnd-kit |
| Icons | lucide-react only |
| Deploy | Vercel |

---

## Domain Hierarchy

```
Service → Subservice → ProductCategory → Product
```

All canonical types in `src/domain/types.ts`. **Never invent inline types.**

### Type system layers

| Layer | Location | Convention |
|-------|---------|-----------|
| Domain types | `src/domain/types.ts` | Public-facing, camelCase |
| Admin types | `src/admin/adminStore.ts` | CRUD ops, snake_case mirrors DB |

---

## Route Map

| Path | Page |
|------|------|
| `/` | HomePage |
| `/services/:serviceSlug` | ServicePage |
| `/subservices/:subserviceSlug` | SubservicePage |
| `/products/:productSlug` | ProductPage |
| `/quote` / `/quote/:slug` | QuotePage |
| `/about`, `/contact`, `/portfolio` | Static pages |
| `/stories/:storySlug` | StoryPage |
| `/admin/*` | Admin panel (separate layout) |

Always use `ROUTES.*` from `src/router.tsx` — never hardcode paths.

