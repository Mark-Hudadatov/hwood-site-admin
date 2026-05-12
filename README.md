# HWOOD — Website + Admin Panel

Bilingual (EN/HE) B2B lead-capture platform for HWOOD Industrial Carpentry.  
Two apps in one codebase: public site + desktop admin CMS.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run lint       # ESLint, zero-warnings
```

### Environment

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://phtstjwdplkdkypvkgjh.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Admin Access

URL: `http://localhost:5173/admin`  
Email: `admin@hwood.co.il`  
Password: `Hwood2024!`  
Admin is desktop-only (≥ 1024px). Session lasts 7 days.

---

## Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript (strict) + Vite |
| Styling | Tailwind CSS (public) · CSS variables (admin) |
| Routing | React Router v6 |
| Backend | Supabase (Postgres + Storage) |
| i18n | react-i18next + bilingual DB fields (`_en` / `_he`) |
| Components | shadcn/ui + Radix UI + lucide-react |
| Drag-drop | @dnd-kit |
| Deploy | Vercel |

---

## Project Structure

```
/
├── CLAUDE.md              ← AI coding guidelines (read first)
├── README.md
├── docs/                  ← All project documentation
│   ├── PROJECT.md         ← Business context, two-brand model
│   ├── SCHEMA.md          ← Supabase tables reference
│   ├── COMPONENTS.md      ← Component map (pages + admin + shared)
│   ├── DESIGN.md          ← Design tokens, typography, colors
│   ├── ADMIN.md           ← Admin CSS system and patterns
│   ├── ORDERS.md          ← Three order types (locked)
│   ├── SPRINT.md          ← Current sprint status
│   └── sql/               ← Applied SQL (reference only)
│       ├── migration.sql
│       └── seed.sql
├── src/
│   ├── admin/             ← Admin CMS
│   │   ├── AdminLayout.tsx
│   │   ├── adminStore.ts  ← All Supabase CRUD
│   │   ├── components/    ← Shared admin components
│   │   └── pages/         ← Admin pages
│   ├── components/        ← Public shared components
│   │   └── premium/       ← Animation wrappers
│   ├── domain/
│   │   └── types.ts       ← Canonical TypeScript types
│   ├── i18n/              ← react-i18next config
│   ├── layouts/
│   │   └── mainlayout.tsx ← Public site shell
│   ├── pages/             ← Public pages
│   ├── services/
│   │   ├── supabase.ts    ← Supabase client
│   │   └── data/
│   │       ├── dataService.ts  ← All public queries
│   │       └── mockData.ts     ← Fallback data
│   └── router.tsx         ← Routes + ROUTES constants
├── api/
│   └── keep-alive.ts      ← Vercel serverless function
└── public/
```

---

## Data Hierarchy

```
services → subservices → product_categories → products
```

Visibility cascades down. Slugs are permanent — never change them in the DB.  
Full schema: [`docs/SCHEMA.md`](docs/SCHEMA.md)

---

## Architecture Change Order

Always top-down, never skip:

```
Supabase schema → types.ts → dataService.ts → adminStore.ts → component
```

---

## Key Rules

- **Types:** all from `src/domain/types.ts` — never inline
- **Queries:** public in `dataService.ts`, admin in `adminStore.ts` — never from components
- **Routes:** always `ROUTES.*` from `router.tsx` — never hardcode paths
- **Slugs:** changing a slug breaks routing immediately
- **Columns:** DB = `snake_case`, domain = `camelCase`, mapped in `dataService.ts`

---

## Docs

| File | Contents |
|------|---------|
| [`docs/PROJECT.md`](docs/PROJECT.md) | Business context, two-brand model, services v2.0 |
| [`docs/SCHEMA.md`](docs/SCHEMA.md) | All Supabase tables, columns, RLS |
| [`docs/COMPONENTS.md`](docs/COMPONENTS.md) | Full component map, gaps |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Colors, typography, spacing tokens |
| [`docs/ADMIN.md`](docs/ADMIN.md) | Admin CSS system, page patterns, button patterns |
| [`docs/ORDERS.md`](docs/ORDERS.md) | Three order types — locked architecture |
| [`docs/SPRINT.md`](docs/SPRINT.md) | Current sprint, environment status |
| [`CLAUDE.md`](CLAUDE.md) | AI coding rules (mandatory read for Claude) |
