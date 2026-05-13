# SPRINT.md

Current sprint status. Update manually when scope changes.
Last updated: May 2026 — v2.3

---

## Environment Status

| Item | Status |
|------|--------|
| Staging branch | Active — Vercel preview URL |
| Supabase | Shared prod/staging — schema updated (`brand` + `order_type` columns added) |
| Service names v2.0 | Staging only — NOT yet on prod |

---

## Shipped — v2.4 (May 2026)

- [x] Full Gutenberg/Elementor-style page builder (`AdminPageBuilder`, `AdminPageList`)
- [x] Block library with 13 public block types + `BlockRenderer` for public rendering
- [x] Builder sub-components: `BlockLibraryPanel`, `CanvasBlock`, `FieldRenderer`, `RepeaterField`, `SettingsPanel`, `blockRegistry`
- [x] `BlockCommonStyle` wrapper (bg, text color, padding, max-width, align, visibility)
- [x] EN/HE toggle in builder toolbar
- [x] `DynamicPage` public route (`/p/:slug`)
- [x] `AdminDesignTokens` page — edits global design token singleton
- [x] `pages` and `design_tokens` Supabase tables + CRUD in `adminStore.ts` and `dataService.ts`
- [x] Circular import fixes across `router.tsx` and admin pages
- [x] New admin nav items: Pages, Design Tokens
- [x] `Container` shared horizontal-padding wrapper — standardized across all 12 block components and all public pages

---

## What's Locked (do not change without explicit approval)

- Tech stack
- 3 order types with final names
- shadcn/ui as component base
- Slug values in Supabase — **never change**

