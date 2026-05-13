# DESIGN.md

Design tokens and visual system for HWOOD. All values are authoritative — change here first, then in code.
Client-approved visual: **do NOT change without explicit request.**

Design references: biesse.com / rehau.com / cnccabinetry.com / addovisuals.com

---

## Цвета / Colors

### Brand (public site)

| Токен | Hex | Tailwind-класс | Применение |
|-------|-----|----------------|-----------|
| Brand / Accent | `#005f5f` | `bg-brand` / `text-brand` / `bg-teal-500` | Основной CTA, иконки, акценты, sidebar |
| Brand hover | `#004d4d` | `bg-teal-600` | Hover на кнопках |
| Brand dark | `#003d3d` | `bg-teal-700` | Active / pressed |

> `brand` и `accent` — один и тот же цвет. В конфиге задублированы семантически: `brand` — identity-элементы, `accent` — строго CTA.

### Нейтральная шкала / Neutral

| Токен | Hex | Применение |
|-------|-----|-----------|
| `neutral-50` | `#fafafa` | Page background |
| `neutral-100` | `#f5f5f5` | Card background, input bg |
| `neutral-200` | `#e5e5e5` | Borders, dividers |
| `neutral-300` | `#d4d4d4` | Disabled borders |
| `neutral-400` | `#a3a3a3` | Placeholder text |
| `neutral-500` | `#737373` | Secondary text |
| `neutral-600` | `#525252` | Body text |
| `neutral-700` | `#404040` | Headings secondary |
| `neutral-800` | `#262626` | Headings primary |
| `neutral-900` | `#171717` | Near-black, max contrast |

### Системные цвета

| Назначение | Класс |
|-----------|-------|
| Ошибка | `text-red-600` / `bg-red-50` |
| Успех | `text-green-600` / `bg-green-50` |
| Предупреждение | `text-amber-600` / `bg-amber-50` |
| Инфо | `text-blue-600` / `bg-blue-50` |

**NO arbitrary colors outside this token system.**

---

## Типографика / Typography (public site)

Шрифт: **Inter** → `system-ui` → `sans-serif`. Рендеринг: `-webkit-font-smoothing: antialiased`.

### Tailwind-токены (9 уровней)

| Токен | rem / px | Line-height | Letter-spacing | Weight | Назначение |
|-------|----------|-------------|---------------|--------|-----------|
| `text-display-lg` | 5.5rem / 88px | 0.98 | −0.028em | 600 | Hero — max format (large viewport only) |
| `text-display` | 4.5rem / 72px | 1.0 | −0.025em | 600 | Hero headline |
| `text-display-sm` | 3.5rem / 56px | 1.05 | −0.02em | 600 | Hero при малом вьюпорте |
| `text-h1` | 2.25rem / 36px | 1.2 | −0.01em | 600 | Page title — один на страницу |
| `text-h2` | 1.5rem / 24px | 1.3 | −0.01em | 500 | Section titles |
| `text-body-lg` | 1.125rem / 18px | 1.6 | — | 400 | Intro-параграфы |
| `text-body` | 1rem / 16px | 1.6 | — | 400 | Все параграфы |
| `text-meta` | 0.875rem / 14px | 1.5 | — | 500 | Labels, captions |
| `text-meta-sm` | 0.75rem / 12px | 1.5 | +0.02em | 500 | Specs, badges, теги |
| `text-eyebrow` | 0.625rem / 10px | 1.0 | +0.2em | 700 | Section labels, overlines (ALL CAPS) |

> Строгое правило: только эти токены. Не использовать `text-lg`, `text-xl` и т.д.

### Homepage-шкала (B2B industrial, адаптивная)

| Роль | Размер | Weight | Tracking |
|------|--------|--------|---------|
| Feature headline (ContentBlock) | `clamp(1.75rem, 3.5vw, 3.25rem)` | 700 | −0.02em |
| Section heading (Services, Stories) | `clamp(1.5rem, 2.5vw, 2.5rem)` | 600 | −0.02em |
| Section body | `text-sm md:text-base` | 400 | normal |
| Section subtitle | `text-sm` | 400 | normal |
| Hero left panel | `clamp(1.75rem, 4vw, 3.75rem)` | 700 | −0.02em |
| Card headings | `text-lg md:text-xl` | 600 | tight |

**Антипаттерны:**
- `xl:text-5xl` / `xl:text-6xl` — слишком агрессивно для B2B
- `font-light` на body — использовать `font-normal`
- `lg:text-xl` на supporting subtitles — держать `text-sm`
- `font-bold` и `font-semibold` на одном уровне иерархии

---

## Spacing

База — **8px сетка**. Tailwind-дефолт + кастомные расширения:

| Токен | rem / px | Применение |
|-------|----------|-----------|
| `space-18` | 4.5rem / 72px | Внутренние отступы секций |
| `space-22` | 5.5rem / 88px | Gap между крупными блоками |
| `space-30` | 7.5rem / 120px | Вертикальные отступы hero |

| Контекст | Значение |
|---------|---------|
| Padding карточки | `p-6` (24px) |
| Gap между карточками | `gap-6` (24px) |
| Padding секции (Y) | `py-16` → `py-24` |
| Padding секции (X) | `px-6 md:px-12 lg:px-20 xl:px-32 2xl:px-40` — via shared `Container` component |
| Border radius кнопки | `rounded-lg` (8px) |
| Border radius карточки | `rounded-xl` / `rounded-2xl` |

---

## Интерактивные состояния

| Состояние | Поведение |
|----------|----------|
| Focus | `outline: 2px solid #005f5f; outline-offset: 2px` через `:focus-visible` |
| Text selection | `background: #005f5f; color: white` |
| Hover (brand button) | `#005f5f` → `#004d4d` |
| Transition | `transition-colors` (150ms ease) |

---

## Анимации

| Класс | Описание | Длительность | Источник |
|-------|----------|-------------|---------|
| `.animate-marquee` | Партнёры — прокрутка влево | 30s linear infinite | tailwind.config.js |
| `.animate-slow-zoom` | Hero Ken Burns zoom | 20s ease-out | tailwind.config.js |
| `.animate-fade-in` | Opacity 0→1 | 0.5s ease-out | tailwind.config.js |
| `.animate-fade-in-up` | Fade + slide up 24px | 0.7s ease-out | tailwind.config.js |
| `.animate-fade-in-right` | Fade + slide from left 30px | 0.8s ease-out | globals.css |
| `.animate-pulse-glow` | CTA pulse ring | 2s infinite | tailwind.config.js |
| `.animate-check-pop` | Success icon spring | 0.5s cubic spring | tailwind.config.js |
| `.animate-scroll-down` | Scroll indicator | 2s infinite | tailwind.config.js |
| `.animate-spin` | Spinner | 1s linear infinite | Tailwind native |
| `.animate-loading-bar` | Progress bar | 1.2s ease-in-out | globals.css |
| `.animate-ripple` | Touch feedback ripple | 0.6s ease-out | globals.css |
| `.skeleton` | Shimmer skeleton | 1.5s infinite | globals.css |

`.animate-marquee:hover` / `.hover\:pause:hover` → `animation-play-state: paused`

RTL: `.animate-marquee` воспроизводится в обратную сторону при `[dir="rtl"]`.
`prefers-reduced-motion`: все анимации сбрасываются до 0.01ms.

---

## Утилиты

### Tailwind-native (используй класс напрямую)

| Класс | Назначение |
|-------|-----------|
| `.no-scrollbar` / `.scrollbar-hide` | Скрыть scrollbar (cross-browser) |
| `.line-clamp-{1,2,3}` | Обрезка текста (Tailwind v3.3+) |
| `.snap-x` / `.snap-start` | Горизонтальный snap-scroll |
| `.touch-manipulation` | Оптимизация касаний |
| `.tracking-tight` | Letter-spacing −0.025em |
| `.backdrop-blur-sm/md` | Backdrop blur (Tailwind native) |

### Кастомные классы (globals.css)

| Класс | Назначение |
|-------|-----------|
| `.text-gradient` | Teal→mint gradient text (для premium заголовков) |
| `.glass` | Frosted glass — светлый (rgba белый + blur 10px) |
| `.glass-dark` | Frosted glass — тёмный (rgba чёрный + blur 10px) |
| `.btn-hover-fill` | Subtle fill overlay on button hover (opacity 0→0.1) |
| `.card-hover-lift` | translateY(−8px) + shadow lift on hover (0.3s) |
| `.link-underline` | Animated underline expand from left (0.3s) |
| `.ease-out-expo` | `cubic-bezier(0.19, 1, 0.22, 1)` — плавный вылет |
| `.ease-in-out-expo` | `cubic-bezier(0.87, 0, 0.13, 1)` — экспоненциальный |

---

## Admin CSS Variables

Admin-панель использует CSS-переменные, а **не** Tailwind-классы. Инжектируются через `AdminLayout.tsx` (константа `ADMIN_VARS`).

| Переменная | Значение | Применение |
|-----------|---------|-----------|
| `--fg-1` | `#0a0a0a` | Primary text |
| `--fg-2` | `#525252` | Secondary text |
| `--fg-3` | `#a3a3a3` | Muted / labels |
| `--bg-1` | `#ffffff` | Page background |
| `--bg-2` | `#fafaf8` | Sidebar, card bg |
| `--bg-3` | `#f1efea` | Active state bg |
| `--border-1` | `#e5e5e5` | All borders |
| `--brand` | `#005f5f` | Teal accent |
| `--brand-light` | `#e5f5f5` | Brand tint |
| `--brand-text` | `#0a4d4d` | Brand dark text |

> Admin sidebar фон — `bg-[#005f5f]`. Мин. ширина доступа — 1024px (блокируется `DesktopOnlyGate`).
> Подробные паттерны разметки admin-страниц — в [ADMIN.md](ADMIN.md).
