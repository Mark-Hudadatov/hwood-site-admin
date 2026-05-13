# COMPONENTS.md — Component Map

All TSX files in `src/`. Inline components (defined inside a page file) are marked *(inline)*.  
Shared admin components live in `src/admin/components/index.tsx`.  
Premium animation wrappers live in `src/components/premium/`.

---

## Layouts

| Component | File | Role |
|-----------|------|------|
| `MainLayout` | `src/layouts/mainlayout.tsx` | Shell for all public pages — renders `Header`, `<Outlet />`, `Footer`, `WhatsAppButton` |
| `Header` | *inline in mainlayout.tsx* | Nav with logo, order-type dropdown, language switcher, mobile hamburger menu |
| `Footer` | *inline in mainlayout.tsx* | Social links, sitemap, company info |
| `WhatsAppButton` | *inline in mainlayout.tsx* | Fixed bottom-right green FAB |
| `ScrollToTop` | *inline in mainlayout.tsx* | Scrolls to top on every route change |
| `LanguageSwitcher` | *inline in mainlayout.tsx* | EN ↔ HE toggle; reloads page after switch |
| `AdminLayout` | `src/admin/AdminLayout.tsx` | Shell for all admin pages — sidebar + `<Outlet />` |
| `DesktopOnlyGate` | *inline in AdminLayout.tsx* | Blocks mobile access to admin with a message |

---

## Public Pages

### `HomePage` — `src/pages/HomePage.tsx`
Data: `hero_slides`, `services`, `stories`, `company_info`

| Section | Component | Notes |
|---------|-----------|-------|
| Hero | *inline carousel* | Reads `hero_slides`; video or image background; left/right arrow nav |
| Services grid | *inline ServiceCard* | Cards from `services`; coming_soon overlay with `Clock` icon |
| Stories strip | *inline StoryStrip* | Latest 3 stories; links to `/stories/:slug` |
| About CTA | *inline* | Static copy + link to `/about` |

---

### `ServicePage` — `src/pages/ServicePage.tsx`
Route: `/services/:serviceSlug` | Data: `services`, `subservices`

| Section | Component | Notes |
|---------|-----------|-------|
| Service hero | *inline* | Full-width image, title, accent color |
| Subservice list | `SubserviceCard` *(inline)* | Horizontal scroll; `3/4` aspect ratio cards; coming_soon grayscale |

---

### `SubservicePage` — `src/pages/SubservicePage.tsx`
Route: `/subservices/:subserviceSlug` | Data: `subservices`, `product_categories`, `products`

| Section | Component | Notes |
|---------|-----------|-------|
| Breadcrumb | *inline* | Service → Subservice |
| Category tabs | `CategoryTabs` *(inline)* | Horizontal scroll; left/right arrow nav; active tab underline |
| Product grid | `ProductCard` *(inline)* | Square image + title + subtitle; hover scale; links to `/products/:slug` |

---

### `ProductPage` — `src/pages/ProductPage.tsx`
Route: `/products/:productSlug` | Data: `products`, `product_categories`, `subservices`, `services`, `product_specifications`, config tables

| Section | Component | Notes |
|---------|-----------|-------|
| Breadcrumb | *inline* | Full 4-level chain |
| Image / 3D hero | *inline* | Gallery thumbnails at bottom; `Rotate3d` toggle for 3D model |
| Configurator | `ConfiguratorOption` *(inline)* | Per-option: `button_group`, `color_picker`, `dropdown`, `checkbox_group` |
| Description | *inline* | Product `description_en/he` |
| Features list | *inline* | `features_en/he` array with checkmarks |
| Quote CTA | *inline* | Links to `ROUTES.QUOTE_PRODUCT(slug)` |
| Loading skeleton | `LoadingSkeleton` *(inline)* | Pulse skeleton matching the two-column layout |

---

### `QuotePage` — `src/pages/QuotePage.tsx`
Route: `/quote` · `/quote/:productSlug` | Data: writes to `quote_submissions`

| Section | Component | Notes |
|---------|-----------|-------|
| Product context | *inline* | Pre-fills product name when routed from a product page |
| Quote form | *inline* | Writes to `quote_submissions`; file upload field (optional) |
| Success state | *inline* | Replaces form after submit |

---

### `ContactPage` — `src/pages/ContactPage.tsx`
Route: `/contact` | Data: `company_info`; writes to `contact_submissions`

| Section | Component | Notes |
|---------|-----------|-------|
| Contact form | *inline* | name, email, phone, company, message |
| Company info block | *inline* | Phone, email, address from `company_info` |

---

### `AboutPage` — `src/pages/AboutPage.tsx`
Route: `/about` | Data: `company_info`

| Section | Component | Notes |
|---------|-----------|-------|
| Stats grid | `StatCard` *(inline)* | Icon + value + label (4 items: sqm, team, years, projects) |
| Company description | *inline* | Reads `company_info.description_en/he` |

---

### `PortfolioPage` — `src/pages/PortfolioPage.tsx`
Route: `/portfolio` | Data: `stories`

| Section | Component | Notes |
|---------|-----------|-------|
| Filter bar | *inline* | Filter by story type |
| Story grid | `StoryCard` *(inline)* | Date, type badge, excerpt; coming_soon overlay; links to `ROUTES.STORY(slug)` |

---

### `StoryPage` — `src/pages/StoryPage.tsx`
Route: `/stories/:storySlug` | Data: `stories`

| Section | Component | Notes |
|---------|-----------|-------|
| Article header | *inline* | Title, date, type badge, hero image |
| Markdown body | `renderMarkdown` *(inline fn)* | Converts `content_en/he` to HTML — h1/h2/h3, bold, italic, lists |
| Related stories | *inline* | Up to 3 other stories from same type |

---

## Admin Pages

### `AdminLogin` — `src/admin/pages/AdminLogin.tsx`
No layout wrapper. Reads/writes `admin_users`. Stores session in `localStorage` (7 days).

---

### `AdminDashboard` — `src/admin/pages/AdminDashboard.tsx`
| Component | Notes |
|-----------|-------|
| `StatCard` *(inline)* | Count cards for all main tables; unread badge on submissions |

---

### `AdminServices` — `src/admin/pages/AdminServices.tsx`
CRUD for `services`. DnD sort via `@dnd-kit`.

| Shared components used |
|------------------------|
| `BilingualInput`, `VisibilitySelect`, `ImageUpload`, `Modal`, `ConfirmDialog` |

---

### `AdminSubservices` — `src/admin/pages/AdminSubservices.tsx`
CRUD for `subservices`. Parent service selector.

| Shared components used |
|------------------------|
| `BilingualInput`, `VisibilitySelect`, `ImageUpload`, `Modal`, `ConfirmDialog` |

---

### `AdminCategories` — `src/admin/pages/AdminCategories.tsx`
CRUD for `product_categories`. Parent subservice selector. DnD sort.

| Shared components used |
|------------------------|
| `BilingualInput`, `VisibilitySelect`, `Modal`, `ConfirmDialog` |

---

### `AdminProducts` — `src/admin/pages/AdminProducts.tsx`
Full CRUD for `products`. Most complex admin page.

| Component | Notes |
|-----------|-------|
| `SortableProductItem` *(inline)* | DnD sortable row using `useSortable` |
| Search / filter bar | *inline* | Filter by category + text search |

| Shared components used |
|------------------------|
| `BilingualInput`, `VisibilitySelect`, `ImageUpload`, `FeaturesEditor`, `SpecificationsEditor`, `Modal`, `ConfirmDialog` |

---

### `AdminStories` — `src/admin/pages/AdminStories.tsx`
CRUD for `stories` + `story_types`.

| Shared components used |
|------------------------|
| `BilingualInput`, `VisibilitySelect`, `ImageUpload`, `Modal`, `ConfirmDialog` |

---

### `AdminMainPage` — `src/admin/pages/AdminMainPage.tsx`
Edits `hero_slides`. Also referenced as `AdminHeroSlides.tsx` (same file).

| Shared components used |
|------------------------|
| `BilingualInput`, `ImageUpload`, `Modal`, `ConfirmDialog` |

---

### `AdminPartners` — `src/admin/pages/AdminPartners.tsx`
CRUD for `partners`. DnD sort. Logo upload.

| Shared components used |
|------------------------|
| `ImageUpload`, `Modal`, `ConfirmDialog` |

---

### `AdminCompanyInfo` — `src/admin/pages/AdminCompanyInfo.tsx`
Edits singleton row in `company_info`.

| Shared components used |
|------------------------|
| `BilingualInput` |

---

### `AdminSubmissions` — `src/admin/pages/AdminSubmissions.tsx`
Read-only view of `contact_submissions` + `quote_submissions`. Marks items as read.

---

## Shared Admin Components
File: `src/admin/components/index.tsx`

| Component | Props summary | Purpose |
|-----------|---------------|---------|
| `BilingualInput` | `label`, `valueEn/He`, `onChangeEn/He`, `type` | EN/HE tabbed text input or textarea |
| `VisibilitySelect` | `value`, `onChange`, `options` | Dropdown for `visible / hidden / coming_soon / not_in_stock` |
| `ImageUpload` | `value`, `onChange` | Drag-and-drop upload to Supabase Storage `images` bucket; auto-compresses |
| `FeaturesEditor` | `valuesEn/He`, `onChange` | Add/remove/reorder string items for `features_en/he` JSONB |
| `SpecificationsEditor` | `productId`, `specs`, `onChange` | Manages `product_specifications` rows with `spec_type_id` lookup |
| `Modal` | `open`, `onClose`, `title`, `children` | Generic centered modal with backdrop |
| `ConfirmDialog` | `open`, `onConfirm`, `onCancel`, `message` | Destructive action confirmation (used before every delete) |

---

## Shared Public Components
Directory: `src/components/`

| Component | File | Purpose |
|-----------|------|---------|
| `LanguageSwitcher` | `components/LanguageSwitcher.tsx` | Standalone version (not used — inline copy in mainlayout.tsx is active) |
| `BlurImage` | `components/premium/BlurImage.tsx` | Progressive image with blur-up placeholder |
| `LoadingScreen` | `components/premium/LoadingScreen.tsx` | Full-screen spinner shown on first load |
| `PageTransition` | `components/premium/PageTransition.tsx` | Fade/slide wrapper on route change |
| `ScrollReveal` | `components/premium/ScrollReveal.tsx` | Intersection Observer reveal on scroll |
| `StaggerReveal` | `components/premium/index.tsx` | Wraps children for staggered reveal animation |
| `TouchFeedback` | `components/premium/TouchFeedback.tsx` | Scale-down feedback on touch/click |

---

## Gaps & Notes

| Item | Status | Notes |
|------|--------|-------|
| `LanguageSwitcher` (standalone) | Duplicate | `src/components/LanguageSwitcher.tsx` is unused; the mainlayout.tsx inline version is active |
| `AdminHeroSlides.tsx` | File exists | Same page as `AdminMainPage` — one of them is likely unused |
| `AdminConfigLibrary.tsx` | Exists, no route | Config option library page exists but is not wired in `router.tsx` |
| Product 3D viewer | Partial | `modelUrl` field and `has3DView` flag exist on `Product` type; viewer component not implemented |
| Markdown editor (admin) | Missing | Stories have `content_en/he` TEXT fields but the admin form has no rich/markdown editor — plain `<textarea>` only |
| `partners` on public site | Missing | `partners` table and `AdminPartners` exist; no public-facing display component or section yet |
