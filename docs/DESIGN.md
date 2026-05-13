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

### Tailwind-токены (5 уровней + расширения)

| Токен | rem / px | Line-height | Letter-spacing | Weight | Назначение |
|-------|----------|-------------|---------------|--------|-----------|
| `text-display` | 3.5rem / 56px | 1.1 | −0.02em | 600 | Hero headline |
| `text-display-sm` | 2.75rem / 44px | 1.15 | −0.02em | 600 | Hero при малом вьюпорте |
| `text-h1` | 2.25rem / 36px | 1.2 | −0.01em | 600 | Page title — один на страницу |
| `text-h2` | 1.5rem / 24px | 1.3 | −0.01em | 500 | Section titles |
| `text-body-lg` | 1.125rem / 18px | 1.6 | — | 400 | Intro-параграфы |
| `text-body` | 1rem / 16px | 1.6 | — | 400 | Все параграфы |
| `text-meta` | 0.875rem / 14px | 1.5 | — | 500 | Labels, captions |
| `text-meta-sm` | 0.75rem / 12px | 1.5 | +0.02em | 500 | Specs, badges, теги |

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
| Padding секции (X) | `px-4` → `px-6` |
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

| Класс | Описание | Длительность |
|-------|----------|-------------|
| `.animate-marquee` | Партнёры — прокрутка влево | 40s linear |
| `.animate-spin` | Spinner | 1s linear |
| `.skeleton` | Shimmer-загрузка | 1.5s |

RTL: `.animate-marquee` воспроизводится в обратную сторону при `[dir="rtl"]`.
`prefers-reduced-motion`: все анимации сбрасываются до 0.01ms.

---

## Утилиты

| Класс | Назначение |
|-------|-----------|
| `.no-scrollbar` | Скрыть scrollbar |
| `.line-clamp-{1,2,3}` | Обрезка текста |
| `.snap-x` / `.snap-start` | Горизонтальный snap-scroll |
| `.touch-manipulation` | Оптимизация касаний |

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
