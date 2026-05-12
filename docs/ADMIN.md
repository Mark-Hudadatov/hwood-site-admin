# ADMIN.md

Admin panel architecture, CSS system, and code patterns. Read before touching any `/admin/*` file.

---

## CSS System

Admin uses **CSS variables injected by `AdminLayout.tsx`** (constant `ADMIN_VARS` via a `<style>` tag).

**Critical rule:** New admin pages use `style={{}}` with CSS vars — NOT Tailwind color/typography/shadow classes.

Existing CRUD pages (Services, Products, etc.) were built with Tailwind and are patched by a CSS override block inside `ADMIN_VARS`. New pages must not require this patch.

See variable values in [DESIGN.md — Admin CSS Variables](DESIGN.md#admin-css-variables-1).

---

## Admin Styling Rules

| Rule | Detail |
|------|--------|
| Colors | `var(--fg-1)`, `var(--brand)`, etc. — never Tailwind color classes |
| Shadows | None — `shadow-sm`, `shadow-md` banned in new code |
| Border radius | `borderRadius: 8` |
| Card border | `1px solid var(--border-1)` |

---

## Page Wrapper Pattern

```tsx
<div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--fg-1)', margin: 0, letterSpacing: '-0.01em' }}>
        Title
      </h2>
      <p style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 3 }}>Subtitle</p>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      {/* action buttons */}
    </div>
  </div>
  {/* content */}
</div>
```

---

## Button Patterns

```tsx
// Primary
style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6, border: 'none',
  background: 'var(--brand)', color: '#fff',
  fontSize: 12, fontWeight: 600, cursor: 'pointer'
}}

// Secondary
style={{
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '7px 14px', borderRadius: 6,
  border: '1px solid var(--border-1)', background: '#fff',
  color: 'var(--fg-1)', fontSize: 12, fontWeight: 500, cursor: 'pointer'
}}
```

---

## Homepage Settings (Supabase)

Table: `homepage_settings`. Rows keyed by `section` string, `settings` is `jsonb`.

| Section key | Content |
|-------------|---------|
| `hero` | Left panel: `video_url`, titles, subtitle, `hero_height` |
| `hero_rail` | Right panel: heading, 3 order-type cards (name/desc/lead_time), `whatsapp_number`, footer_text |
| `services_section` | Section title, subtitle, `show_descriptions` |
| `stories_section` | Section title, button text/link |
| `about_section` | Title, description, button, colors |
| `partners_section` | Section title, description, 3 boxes |
| `layout` | Brand colors |

Save pattern: per-section upsert `{ section: id, settings: data }` with `onConflict: 'section'`.

---

## Hero Right Rail (Version A — Refined Stack)

- 3 order-type cards: teal (browse), blue (file), amber (describe)
- Each card navigates to `/quote?type=browse|file|describe`
- Card icons, colors, tag chips — **hardcoded design constants**, not editable
- Card text (name, description, lead time) — loads from Supabase `hero_rail` section
- WhatsApp number: `972549222804` (from `mainlayout.tsx`, mirrored in `hero_rail` settings)
- "Client login" link: disabled placeholder, non-clickable

---

## Admin Homepage Editor (Page Builder)

- Single scrolling column — no left/right tab split
- Sticky nav at top with `IntersectionObserver` for active section highlight
- Section order mirrors real page: Hero → Rail → Services → Partners → Stories → About → Layout
- Right panel (300px): browser chrome wireframe (placeholder for future live preview)
- Each section = `SectionCard` with header + save button

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `services` | Top-level services |
| `subservices` | Service subcategories |
| `product_categories` | Product groupings |
| `products` | Individual products |
| `stories` | News / articles |
| `hero_slides` | Homepage hero carousel |
| `company_info` | Company details (singleton, id=1) |
| `social_links` | Social media URLs |
| `story_types` | Customizable story categories |
| `specification_types` | Product spec master list |
| `homepage_settings` | Per-section jsonb config |
| `contact_submissions` | Contact form entries |
| `quote_submissions` | Quote request entries |
| `admin_users` | Email/password auth |
