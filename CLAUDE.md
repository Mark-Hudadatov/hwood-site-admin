# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See also: [PROJECT.md](docs/PROJECT.md) · [DESIGN.md](docs/DESIGN.md) · [ADMIN.md](docs/ADMIN.md) · [ORDERS.md](docs/ORDERS.md) · [SPRINT.md](docs/SPRINT.md) · [SCHEMA.md](docs/SCHEMA.md) · [COMPONENTS.md](docs/COMPONENTS.md)

---

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check + build for production (output: dist/)
npm run lint      # ESLint with zero warnings tolerance
npm run preview   # Serve the production build locally
```

Always run `npm run build` at the end of any code-producing session to validate.

## Environment

Requires `.env.local`:
```
VITE_SUPABASE_URL=https://phtstjwdplkdkypvkgjh.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Architecture

**Stack:** React 18 + TypeScript (strict) + Vite + Tailwind CSS + Supabase + react-router-dom v6 + shadcn/ui + Radix UI + @dnd-kit + lucide-react

**Two distinct apps share one codebase:**

1. **Public site** (`/`) — bilingual (EN/HE) at `src/pages/` + `src/layouts/mainlayout.tsx`. Data via `src/services/data/dataService.ts` (Supabase-first, `mockData.ts` fallback).
2. **Admin panel** (`/admin`) — desktop-only CMS at `src/admin/`. All Supabase CRUD in `src/admin/adminStore.ts`. Auth via `admin_users` table, session in `localStorage` (7 days).

**Data hierarchy:** Services → Subservices → Categories → Products. Visibility cascades downward. `sort_order` managed via `@dnd-kit`.

**Bilingualism:** Every content field has `_en` / `_he` variants. `getLocalizedField()` in `src/services/supabase.ts` resolves with `_en` fallback. UI strings use `i18next` (`src/i18n/index.ts`). RTL toggled via `document.documentElement.dir`.

**Image uploads:** Supabase Storage bucket `images`. Auto-compressed to 85% JPEG, max 1920×1080.

**Deployment:** Vercel. `vercel.json` for SPA routing. `api/keep-alive.ts` is a serverless function.

---

## Mandatory Architecture Change Order

When changing anything structural, always go **top to bottom**. Never skip steps. Never go bottom-up.

```
Supabase schema
  → src/domain/types.ts
    → src/services/data/dataService.ts
      → src/admin/adminStore.ts  (if admin-facing)
        → component / page
```

---

## Before Generating Any Code

1. Ask for the current version of the file if it already exists
2. Explicitly state what might break from this change
3. List dependent files that need to be checked
4. Confirm which environment (staging / prod)

---

## Rules

### TypeScript
- All types from `src/domain/types.ts` (public) or `src/admin/adminStore.ts` (admin) — never invent inline types
- No `any` unless mapping raw Supabase response (add a comment explaining why)
- Props interfaces defined above the component

### Supabase naming contract
- DB columns: `snake_case` (`title_en`, `image_url`, `sort_order`, `brand`, `order_type`)
- Domain types: `camelCase` (`titleEn`, `imageUrl`, `sortOrder`, `brand`, `orderType`)
- Mapping always in `dataService.ts` — never in components

### Supabase queries
- All public queries in `dataService.ts`, all admin queries in `adminStore.ts`
- Never query Supabase directly from a component or page
- Always handle error + empty state
- Visibility filter: `.in('visibility_status', ['visible', ...])`

### Components
- Use `ROUTES.*` from `src/router.tsx` — never hardcode paths
- Icons: `lucide-react` only
- Colors: Tailwind token system only (public site) / CSS vars (admin — see docs/ADMIN.md)
- Always include loading and error states
- `shadcn/ui` components for: Card, Button, Badge, Dialog, Sheet, Tabs, NavigationMenu, Breadcrumb

### Bilingual
- Every user-facing string needs both `_en` and `_he` variants
- Pattern: `lang === 'he' && data.field_he ? data.field_he : data.field_en`
- UI strings via `i18next` keys — never hardcoded
- Components must not break in RTL

### Renaming services / products
- Changing `title_en` / `title_he` — safe, no routing impact
- **NEVER change `slug`** — breaks routing immediately
- Use SQL: `UPDATE services SET title_en = '...' WHERE slug = '...';`
- Never rename via admin panel when shared Supabase is in use

### Forms / submissions
- Forms write to `contact_submissions` or `quote_submissions`
- Validate before submit
- Files always optional with explicit UI hint
- Min fields: Browse = 3, Send File = 4, Describe = 3–5

---

## Zscaler File Delivery

Mark's corporate network (Zscaler VPN at BDO) blocks `.tsx` / `.ts` / `.jsx` downloads.

- Deliver code files as `.txt` with target extension in filename: `ProductPage.txt` → rename to `ProductPage.tsx`
- One file = one commit
- Multiple files: give explicit numbered order
- Non-code deliverables: offer `.zip`

---

## Handoff Output Standard

Every code handoff must include:

| Field | Content |
|-------|---------|
| What this does | One sentence |
| Where it lives | File path + target extension |
| Dependencies | Imports and sources |
| Supabase tables touched | List |
| What might break | Explicit list |
| Open questions | Needs client decision |
