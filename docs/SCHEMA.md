# SCHEMA.md — Supabase Tables

Supabase project: `phtstjwdplkdkypvkgjh.supabase.co`

All public queries live in `src/services/data/dataService.ts`.  
All admin queries live in `src/admin/adminStore.ts`.  
Mapping between `snake_case` columns ↔ `camelCase` domain types always happens in `dataService.ts`.

---

## Data Hierarchy

```
services
  └── subservices
        └── product_categories
              └── products
                    └── product_specifications
```

---

## Core Content Tables

### `services`
Top-level offerings (e.g., "Modular Cabinet Systems").

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | `gen_random_uuid()` |
| `slug` | VARCHAR(100) UNIQUE | URL key — **never change** |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `description_en` | TEXT | |
| `description_he` | TEXT | |
| `image_url` | TEXT | Card / thumbnail |
| `hero_image_url` | TEXT | Full-width hero |
| `accent_color` | VARCHAR(20) | Brand hex, e.g. `#D48F28` |
| `visibility_status` | VARCHAR(20) | `visible` · `hidden` · `coming_soon` |
| `sort_order` | INTEGER | Drag-and-drop via `@dnd-kit` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | Auto-updated trigger |

RLS: public reads `visible` + `coming_soon`; authenticated has full access.

---

### `subservices`
Specific process within a service (e.g., "Kitchen Modules").

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `service_id` | UUID FK → `services.id` | |
| `slug` | VARCHAR(100) UNIQUE | **never change** |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `description_en` | TEXT | |
| `description_he` | TEXT | |
| `image_url` | TEXT | |
| `hero_image_url` | TEXT | |
| `visibility_status` | VARCHAR(20) | `visible` · `hidden` · `coming_soon` |
| `sort_order` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

### `product_categories`
Grouping of products within a subservice (e.g., "Base Units (B)").

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `subservice_id` | UUID FK → `subservices.id` | |
| `slug` | VARCHAR(100) UNIQUE | **never change** |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `description_en` | TEXT | |
| `description_he` | TEXT | |
| `visibility_status` | VARCHAR(20) | `visible` · `hidden` · `coming_soon` |
| `sort_order` | INTEGER | |

---

### `products`
Individual SKU / module (e.g., "B-60-3S").

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `category_id` | UUID FK → `product_categories.id` | |
| `slug` | VARCHAR(100) UNIQUE | **never change** |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `subtitle_en` | VARCHAR | Short tagline |
| `subtitle_he` | VARCHAR | |
| `description_en` | TEXT | |
| `description_he` | TEXT | |
| `image_url` | TEXT | |
| `features_en` | JSONB | `["feature 1", ...]` |
| `features_he` | JSONB | |
| `visibility_status` | VARCHAR(20) | `visible` · `hidden` · `not_in_stock` |
| `sort_order` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

RLS: public reads `visible` + `not_in_stock`; authenticated has full access.

---

### `product_specifications`
Key-value spec rows per product (links to `specification_types`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `product_id` | UUID FK → `products.id` ON DELETE CASCADE | |
| `spec_type_id` | UUID FK → `specification_types.id` ON DELETE CASCADE | |
| `value` | VARCHAR(200) | |
| `is_visible` | BOOLEAN | Default `true` |
| `sort_order` | INTEGER | |

UNIQUE constraint on `(product_id, spec_type_id)`.

---

### `specification_types`
Master list of spec labels (e.g., "Width", "Material").

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | |
| `unit` | VARCHAR(20) | `cm`, `kg`, or NULL |
| `sort_order` | INTEGER | |
| `is_active` | BOOLEAN | Default `true` |
| `created_at` | TIMESTAMPTZ | |

Default rows: Width, Height, Depth, Weight, Material, Color, Finish.

---

## Site Content Tables

### `hero_slides`
Homepage hero carousel.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `subtitle_en` | TEXT | |
| `subtitle_he` | TEXT | |
| `image_url` | TEXT | |
| `video_url` | TEXT | Optional background video |
| `cta_text_en` | VARCHAR | Button label |
| `cta_text_he` | VARCHAR | |
| `cta_link` | VARCHAR | Internal path, e.g. `/services/cnc-board-processing` |
| `is_visible` | BOOLEAN | |
| `sort_order` | INTEGER | |

---

### `stories`
News / events / customer stories.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `slug` | VARCHAR(100) UNIQUE | |
| `title_en` | VARCHAR | |
| `title_he` | VARCHAR | |
| `date` | DATE | |
| `type` | VARCHAR | Legacy: `EVENTS`, `CUSTOMER STORY` |
| `type_id` | UUID FK → `story_types.id` | New FK, preferred |
| `image_url` | TEXT | |
| `excerpt_en` | VARCHAR(500) | Card teaser |
| `excerpt_he` | VARCHAR(500) | |
| `content_en` | TEXT | Full article body |
| `content_he` | TEXT | |
| `is_visible` | BOOLEAN | |

---

### `story_types`
Admin-managed story categories (replaces the hardcoded `type` column).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | Display name |
| `slug` | VARCHAR(100) UNIQUE | |
| `sort_order` | INTEGER | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

Default rows: `events`, `customer-story`, `case-study`.

---

### `partners`
Partner logos shown on site.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(100) | |
| `logo_url` | TEXT | |
| `website_url` | TEXT | |
| `sort_order` | INTEGER | |
| `is_visible` | BOOLEAN | Default `true` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

---

### `company_info`
Singleton row (id = 1) with company contact details.

| Column | Type | Notes |
|--------|------|-------|
| `id` | INTEGER PK | Always 1 |
| `name_en` | VARCHAR | |
| `name_he` | VARCHAR | |
| `tagline_en` | VARCHAR | |
| `tagline_he` | VARCHAR | |
| `description_en` | TEXT | |
| `description_he` | TEXT | |
| `phone` | VARCHAR | |
| `email` | VARCHAR | |
| `address_en` | VARCHAR | |
| `address_he` | VARCHAR | |

---

### `social_links`
Social platform URLs (one row per platform).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `platform` | VARCHAR(50) UNIQUE | `facebook` · `linkedin` · `instagram` · `tiktok` · `whatsapp` · `telegram` |
| `url` | TEXT | NULL = not configured |
| `is_visible` | BOOLEAN | |
| `sort_order` | INTEGER | |

---

## Form Submissions

### `contact_submissions`
General contact form (`/contact`).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(200) | |
| `email` | VARCHAR(200) | |
| `phone` | VARCHAR(50) | |
| `subject` | VARCHAR(300) | |
| `message` | TEXT | |
| `is_read` | BOOLEAN | Default `false` |
| `created_at` | TIMESTAMPTZ | |

RLS: anon can INSERT; authenticated has full access.

---

### `quote_submissions`
Quote request form.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(200) | |
| `email` | VARCHAR(200) | |
| `phone` | VARCHAR(50) | |
| `company` | VARCHAR(200) | |
| `project_type` | VARCHAR(100) | |
| `budget_range` | VARCHAR(100) | |
| `timeline` | VARCHAR(100) | |
| `message` | TEXT | |
| `product_interest` | JSONB | Array of product references |
| `is_read` | BOOLEAN | Default `false` |
| `created_at` | TIMESTAMPTZ | |

RLS: anon can INSERT; authenticated has full access.

---

## Admin

### `admin_users`
Simple single-admin auth table (not Supabase Auth — stored in `localStorage`, 7-day session).

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `email` | VARCHAR(200) UNIQUE | |
| `password_hash` | VARCHAR(200) | Plaintext in dev — replace in prod |
| `name` | VARCHAR(200) | |
| `created_at` | TIMESTAMPTZ | |
| `last_login` | TIMESTAMPTZ | |

---

## Storage

**Bucket:** `images`  
Used for all uploaded media. Auto-compressed to 85% JPEG, max 1920×1080 before upload.  
Image records tracked via `images` table (queried in `adminStore.ts`).

---

## RLS Summary

| Table | Anon read | Anon write | Auth |
|-------|-----------|------------|------|
| `services` | `visible` + `coming_soon` | — | Full |
| `subservices` | `visible` + `coming_soon` | — | Full |
| `product_categories` | `visible` + `coming_soon` | — | Full |
| `products` | `visible` + `not_in_stock` | — | Full |
| `product_specifications` | `is_visible = true` | — | Full |
| `specification_types` | `is_active = true` | — | Full |
| `story_types` | All | — | Full |
| `hero_slides` | All | — | Full |
| `stories` | All | — | Full |
| `partners` | `is_visible = true` | — | Full |
| `social_links` | `is_visible = true` | — | Full |
| `company_info` | All | — | Full |
| `contact_submissions` | — | INSERT | Full |
| `quote_submissions` | — | INSERT | Full |
| `admin_users` | — | — | SELECT only |
