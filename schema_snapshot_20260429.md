# Supabase Schema Snapshot — HWOOD × SKYLUM
**Дата:** 29 апреля 2026  
**Версия:** v2.0 (post-migration)  
**Supabase проект:** phtstjwdplkdkypvkgjh  

---

## Важно: shared database

Staging и prod используют **одну Supabase базу**.
- Schema changes → немедленно применяются к обоим
- Data changes → только через Supabase SQL Editor напрямую
- Никогда не менять данные через staging admin panel

---

## Таблицы (23 всего)

```
admin_users             — аутентификация admin panel
company_info            — контактные данные компании
config_option_types     — типы конфигурационных опций (Ширина, Цвет...)
config_option_values    — значения опций (60см, Белый...)
contact_submissions     — заявки с формы Contact
feature_library         — библиотека фич продуктов
hero_slides             — слайды главного Hero
homepage_settings       — настройки блоков главной страницы
partners                — логотипы партнёров для marquee
product_categories      — категории продуктов (вкладки на SubservicePage)
product_config_overrides — переопределения конфига на уровне продукта
product_features        — связь продукт → фича
product_specifications  — технические характеристики продуктов
products                — SKU продуктов
quote_submissions       — заявки с форм заказа (все 3 типа)
services                — топ-уровень сервисов (6 активных)
social_links            — ссылки соцсетей
specification_types     — справочник типов характеристик
stories                 — статьи/новости для Portfolio
story_types             — типы историй (Events, Customer Story...)
subservice_config_templates — шаблоны конфига на уровне подсервиса
subservices             — подсервисы (второй уровень иерархии)
```

---

## Ключевые таблицы — структура

### services
```sql
id                uuid         PK, gen_random_uuid()
slug              varchar      NOT NULL, UNIQUE — маршрутизация
title_en          varchar      NOT NULL
title_he          varchar
subtitle_en       varchar
subtitle_he       varchar
description_en    text
description_he    text
cta_text_en       varchar      DEFAULT 'Learn more'
cta_text_he       varchar      DEFAULT 'לפרטים נוספים'
image_url         text
hero_image_url    text
accent_color      varchar
brand             varchar      DEFAULT 'hwood' — 'hwood' | 'skylum'
order_type        varchar      — 'browse-and-order' | 'send-file-and-process' | 'describe-and-request' | 'informational'
visibility_status varchar      DEFAULT 'visible' — 'visible' | 'hidden' | 'coming_soon'
is_visible        bool         DEFAULT true — legacy, обновлять вместе с visibility_status
sort_order        int4         DEFAULT 0
created_at        timestamptz  DEFAULT now()
updated_at        timestamptz  DEFAULT now()
```

### subservices
```sql
id                uuid         PK
service_id        uuid         FK → services.id
slug              varchar      UNIQUE — маршрутизация
title_en          varchar      NOT NULL
title_he          varchar
description_en    text
description_he    text
image_url         text
hero_image_url    text
visibility_status varchar      'visible' | 'hidden' | 'coming_soon'
is_visible        bool         legacy
sort_order        int4
created_at        timestamptz
updated_at        timestamptz
```
*Примечание: brand и order_type НЕ хранятся в subservices — наследуются от services.*

### product_categories
```sql
id                uuid         PK
subservice_id     uuid         FK → subservices.id
slug              varchar
title_en          varchar
title_he          varchar
description_en    text
description_he    text
visibility_status varchar
sort_order        int4
```

### products
```sql
id                uuid         PK
category_id       uuid         FK → product_categories.id
slug              varchar      UNIQUE
title_en          varchar
title_he          varchar
subtitle_en       varchar
subtitle_he       varchar
description_en    text
description_he    text
image_url         text
gallery_images    text[]
video_url         text
features_en       text[]
features_he       text[]
specifications    jsonb
has_3d_view       bool
model_url         text
visibility_status varchar      'visible' | 'hidden' | 'not_in_stock'
is_featured       bool
sort_order        int4
```

---

## Актуальное состояние данных (29.04.2026)

### Services — 6 публичных

| sort | slug | brand | order_type | status |
|---|---|---|---|---|
| 1 | cabinet-storage-modules | hwood | browse-and-order | visible |
| 2 | interior-fronts-surfaces | hwood | browse-and-order | visible |
| 3 | custom-kitchen-projects | hwood | describe-and-request | visible |
| 4 | cnc-services-for-professionals | hwood | send-file-and-process | visible |
| 5 | facade-systems-acp | skylum | describe-and-request | visible |
| 6 | materials-panel-supply | skylum | informational | coming_soon |

### Subservices — 22 активных (visible + coming_soon)

| service | subservice slug | status |
|---|---|---|
| cabinet-storage-modules | kitchen-modules | visible |
| cabinet-storage-modules | bathroom-niche-modules | coming_soon |
| cabinet-storage-modules | wardrobe-closet-systems | coming_soon |
| cabinet-storage-modules | drawer-storage-units | coming_soon |
| interior-fronts-surfaces | painted-mdf | coming_soon |
| interior-fronts-surfaces | pvc-thermofoil | coming_soon |
| interior-fronts-surfaces | veneer-fronts | coming_soon |
| interior-fronts-surfaces | hpl-laminate-fronts | coming_soon |
| custom-kitchen-projects | kitchen-design-planning | visible |
| custom-kitchen-projects | complete-custom-kitchens | coming_soon |
| custom-kitchen-projects | kitchen-islands | coming_soon |
| custom-kitchen-projects | cabinet-carcass-manufacturing | coming_soon |
| cnc-services-for-professionals | panel-cutting-to-size | visible |
| cnc-services-for-professionals | cnc-drilling-boring | visible |
| cnc-services-for-professionals | cnc-milling-shaping | visible |
| cnc-services-for-professionals | hpl-precision-cutting | visible |
| cnc-services-for-professionals | edge-banding-service | visible |
| facade-systems-acp | facade-cassette-fabrication | visible |
| facade-systems-acp | v-grooving-folding | visible |
| facade-systems-acp | mounting-system-preparation | visible |
| facade-systems-acp | hpl-wall-cladding | visible |
| materials-panel-supply | hpl-sheet-supply | coming_soon |
| materials-panel-supply | acp-sheet-supply | coming_soon |

### Products — 37 (все в kitchen-modules)

Категории (все под subservice kitchen-modules):
- Base Units (B): 15 продуктов, 2 hidden
- Wall Units (W): 4 продукта
- Tall Units (H): 3 продукта
- Corner Units (C): 3 продукта
- Island Units (I): 3 продукта
- Special Units (S): 3 продукта
- Handle Codes (HND): 4 продукта
- kitchen-design-planning: 2 продукта (Kitchen Planning, 3D Visualization)

Hidden продукты (ждут решения клиента):
- B-80-D2-S1-153 (slug: b-80-d2-s1-153)
- B80-D2-S2 (slug: b80-d2-s2)

---

## Конфигуратор продуктов

Конфигурационные данные хранятся в Supabase:
- `config_option_types` — типы опций (Ширина, Высота, Материал, Цвет...)
- `config_option_values` — значения (60см, 80см, МДФ, Белый...)
- `subservice_config_templates` — какие опции включены для подсервиса
- `product_config_overrides` — переопределения на уровне продукта

**Правило:** конфигурация ОТСУТСТВУЕТ в seed файлах репозитория. Данные только в Supabase.

---

## Иерархия данных

```
Service (6)
  └── Subservice (22+ активных)
        └── ProductCategory (11 под kitchen-modules)
              └── Product (37)
                    └── ProductConfiguration (в Supabase)
```

order_type задаётся на уровне Service и наследуется вниз по иерархии.
Subservice, Category и Product НЕ хранят order_type самостоятельно.
