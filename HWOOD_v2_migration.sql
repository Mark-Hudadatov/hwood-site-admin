-- ============================================================
-- HWOOD × SKYLUM — ПОЛНЫЙ SQL СКРИПТ МИГРАЦИИ v2.0
-- Дата: Апрель 2026
-- Среда: Supabase SQL Editor (общий prod/staging)
-- Автор: Подготовлен на основе реального дампа Supabase 29.04.2026
--
-- ВНИМАНИЕ: brand и order_type уже существуют в таблице services.
-- ALTER TABLE НЕ НУЖЕН.
--
-- ПОРЯДОК ВЫПОЛНЕНИЯ:
-- 1. Сервисы (Section 1)
-- 2. Переназначение подсервисов (Section 2)
-- 3. Обновление подсервисов (Section 3)
-- 4. Новые подсервисы (Section 4)
-- ============================================================

BEGIN;

-- ============================================================
-- SECTION 1: СЕРВИСЫ
-- Текущее: 10 сервисов → Целевое: 6 публичных
-- ============================================================

-- ─── 1A. RENAME существующих 5 сервисов (UUID не меняется) ──

UPDATE services SET
  slug             = 'cabinet-storage-modules',
  title_en         = 'Cabinet & Storage Modules',
  title_he         = 'מודולי ארונות ואחסון',
  subtitle_en      = 'Browse & Order',
  subtitle_he      = 'הזמנה מקטלוג',
  description_en   = 'Ready-made modular cabinet systems for kitchens, bathrooms, wardrobes, and storage. Select from catalog, configure parameters, submit order.',
  description_he   = 'מערכות ארונות מודולריות מוכנות למטבחים, אמבטיות, ארונות בגדים ואחסון. בחר מהקטלוג, הגדר פרמטרים, שלח הזמנה.',
  cta_text_en      = 'Browse Catalog',
  cta_text_he      = 'עיין בקטלוג',
  brand            = 'hwood',
  order_type       = 'browse-and-order',
  visibility_status = 'visible',
  sort_order       = 1,
  updated_at       = now()
WHERE id = '11111111-1111-1111-1111-111111111101';
-- structural-cabinet-modules → cabinet-storage-modules

UPDATE services SET
  slug             = 'interior-fronts-surfaces',
  title_en         = 'Interior Fronts & Surfaces',
  title_he         = 'חזיתות ומשטחים פנימיים',
  subtitle_en      = 'Browse & Order',
  subtitle_he      = 'הזמנה מקטלוג',
  description_en   = 'Painted MDF, veneer, PVC and HPL fronts for kitchens, wardrobes and custom interiors. Browse catalog, choose finish and size.',
  description_he   = 'חזיתות MDF צבוע, פורניר, PVC ו-HPL למטבחים, ארונות ופנים מותאם אישית. עיין בקטלוג, בחר גימור וגודל.',
  cta_text_en      = 'Browse Fronts',
  cta_text_he      = 'עיין בחזיתות',
  brand            = 'hwood',
  order_type       = 'browse-and-order',
  visibility_status = 'visible',
  sort_order       = 2,
  updated_at       = now()
WHERE id = '11111111-1111-1111-1111-111111111103';
-- facade-front-elements → interior-fronts-surfaces

UPDATE services SET
  slug             = 'custom-kitchen-projects',
  title_en         = 'Custom Kitchen Projects',
  title_he         = 'פרויקטי מטבח מותאמים',
  subtitle_en      = 'Describe & Request',
  subtitle_he      = 'תאר ובקש',
  description_en   = 'Full custom kitchen production from design to delivery. Describe your project, share references if available — we will contact you to discuss.',
  description_he   = 'ייצור מטבחים מותאמים אישית מעיצוב ועד אספקה. תאר את הפרויקט, שתף רפרנסים אם יש — ניצור איתך קשר לדיון.',
  cta_text_en      = 'Describe Project',
  cta_text_he      = 'תאר פרויקט',
  brand            = 'hwood',
  order_type       = 'describe-and-request',
  visibility_status = 'visible',
  sort_order       = 3,
  updated_at       = now()
WHERE id = '00035da1-f2db-45fa-9776-8d336fd982fa';
-- custom-kitchen-manufacturing → custom-kitchen-projects

UPDATE services SET
  slug             = 'cnc-services-for-professionals',
  title_en         = 'CNC Services for Professionals',
  title_he         = 'שירותי CNC למקצוענים',
  subtitle_en      = 'Send File & Process',
  subtitle_he      = 'שלח קובץ ועבד',
  description_en   = 'Panel cutting, edge banding, drilling and milling for carpentry workshops and subcontractors. Upload cutting list or describe your job — no file required.',
  description_he   = 'חיתוך לוחות, כיסוי קצוות, קידוח ועיבוד CNC לנגרים ולקבלני משנה. העלה רשימת חיתוך או תאר את העבודה — קובץ לא חובה.',
  cta_text_en      = 'Send Job Request',
  cta_text_he      = 'שלח בקשת עבודה',
  brand            = 'hwood',
  order_type       = 'send-file-and-process',
  visibility_status = 'visible',
  sort_order       = 4,
  updated_at       = now()
WHERE id = 'd5c2bcf3-8b87-4550-a2a3-a7126763294d';
-- production-services-for-carpenters → cnc-services-for-professionals

UPDATE services SET
  slug             = 'materials-panel-supply',
  title_en         = 'Materials & Panel Supply',
  title_he         = 'אספקת חומרים ולוחות',
  subtitle_en      = 'Information',
  subtitle_he      = 'מידע',
  description_en   = 'Overview of HPL, ACP panel materials and accessories available through Skylum. Coming soon as an ordering channel.',
  description_he   = 'סקירה של חומרי לוחות HPL, ACP ואביזרים זמינים דרך Skylum. בקרוב כערוץ הזמנה.',
  cta_text_en      = 'Learn More',
  cta_text_he      = 'מידע נוסף',
  brand            = 'skylum',
  order_type       = 'informational',
  visibility_status = 'coming_soon',
  sort_order       = 6,
  updated_at       = now()
WHERE id = 'c2d04774-9946-451d-a982-1833f4bc5680';
-- hpl-material-supply → materials-panel-supply

-- ─── 1B. INSERT нового сервиса Facade Systems & ACP (Skylum) ─

INSERT INTO services (
  id, slug,
  title_en, title_he,
  subtitle_en, subtitle_he,
  description_en, description_he,
  cta_text_en, cta_text_he,
  brand, order_type,
  visibility_status, sort_order,
  is_visible
) VALUES (
  '00000000-0000-4000-a000-000000000005',
  'facade-systems-acp',
  'Facade Systems & ACP',
  'מערכות חזית ו-ACP',
  'Describe & Request',
  'תאר ובקש',
  'Aluminum composite panels, HPL cladding, and ventilated facade systems for facade companies and general contractors. Describe the object — we will prepare a proposal.',
  'פאנלים קומפוזיט אלומיניום, חיפוי HPL ומערכות חזית מאווררות לחברות חזיתות וגנרל קונטרקטורים. תאר את המבנה — נכין הצעה.',
  'Describe Project',
  'תאר פרויקט',
  'skylum',
  'describe-and-request',
  'visible',
  5,
  true
);

-- ─── 1C. СКРЫТЬ 5 устаревших сервисов ────────────────────────

UPDATE services SET
  visibility_status = 'hidden',
  is_visible        = false,
  updated_at        = now()
WHERE id IN (
  '6ae335ee-5d19-449e-90e5-4bea85aee549', -- aluminum-composite-panel-processing
  'cb101db3-13b7-49cc-8c08-caf249bb1da7', -- hpl-panel-processing-&-wall-cladding
  'facf669b-5bb8-413e-b840-0907aa75074d', -- assembly-preparation (уже hidden)
  '2c2dc98e-597a-4784-ab6a-5c92be4296ba', -- engineering-cnc-prep (уже hidden)
  '11111111-1111-1111-1111-111111111102'  -- component-cnc-processing (уже hidden)
);

-- ============================================================
-- SECTION 2: ПЕРЕНАЗНАЧЕНИЕ ПОДСЕРВИСОВ (service_id)
-- UUID подсервисов не меняется. Меняется только родитель.
-- ============================================================

-- 2A. Подсервисы из component-cnc-processing (скрытый, 11111111-102)
--     → cnc-services-for-professionals (d5c2bcf3)
--     Переезжают: front-milling, drilling-boring, board-cutting, HPL PROCESSING SERVICES
UPDATE subservices SET
  service_id = 'd5c2bcf3-8b87-4550-a2a3-a7126763294d',
  updated_at = now()
WHERE service_id = '11111111-1111-1111-1111-111111111102';

-- 2B. Подсервисы из aluminum-composite-panel-processing (скрытый)
--     → facade-systems-acp (новый)
--     Переезжают: Facade-cassette, Large-format-cut, V-grooving,
--                 Custom-facade-elements, Mounting-prep, Shop-Drawings
UPDATE subservices SET
  service_id = '00000000-0000-4000-a000-000000000005',
  updated_at = now()
WHERE service_id = '6ae335ee-5d19-449e-90e5-4bea85aee549';

-- 2C. HPL Wall Cladding (из hpl-panel-processing) → facade-systems-acp
UPDATE subservices SET
  service_id = '00000000-0000-4000-a000-000000000005',
  updated_at = now()
WHERE id IN (
  'e013709b-9f7a-4d6a-803e-6706cb057cba', -- Interior wall cladding panels
  'f62a59e4-6773-470a-bd25-b6e9558d090b'  -- Exterior HPL facade elements
);

-- 2D. HPL Precision Cutting (из hpl-panel-processing) → cnc-services-for-professionals
UPDATE subservices SET
  service_id = 'd5c2bcf3-8b87-4550-a2a3-a7126763294d',
  updated_at = now()
WHERE id = '6ddb39b0-7b7b-46f5-a71f-ca7afb663b10'; -- Precision cutting of HPL sheets

-- ============================================================
-- SECTION 3: ОБНОВЛЕНИЕ ПОДСЕРВИСОВ
-- ============================================================

-- ── Сервис 1: Cabinet & Storage Modules ──────────────────────

UPDATE subservices SET
  title_en         = 'Kitchen Modules',
  title_he         = 'מודולי מטבח',
  description_en   = '30+ ready-made kitchen cabinet SKUs. Base units, wall units, tall units, corners, islands, and handles.',
  description_he   = '30+ SKU של ארונות מטבח מוכנים. ארונות תחתונים, עליונים, גבוהים, פינות, איים וידיות.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 1,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222201';

UPDATE subservices SET
  title_en         = 'Bathroom & Niche Modules',
  title_he         = 'מודולי אמבטיה ונישות',
  description_en   = 'Modular solutions for bathroom vanities and built-in niche systems.',
  description_he   = 'פתרונות מודולריים לארונות אמבטיה ומערכות נישות מובנות.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 2,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222202';

UPDATE subservices SET
  title_en         = 'Wardrobe & Closet Systems',
  title_he         = 'מערכות ארונות בגדים',
  description_en   = 'Flexible modular systems for walk-in closets and wardrobe interiors.',
  description_he   = 'מערכות מודולריות גמישות לחדרי ארונות ופנים ארונות בגדים.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 3,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222203';

UPDATE subservices SET
  title_en         = 'Drawer & Storage Units',
  title_he         = 'יחידות מגירות ואחסון',
  description_en   = 'Precision-built drawer boxes and pull-out storage units.',
  description_he   = 'קופסאות מגירות ויחידות אחסון נשלפות בייצור מדויק.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 4,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222204';

-- ── Сервис 2: Interior Fronts & Surfaces ─────────────────────
-- Все подсервисы пустые (нет продуктов) → coming_soon

UPDATE subservices SET
  title_en         = 'Painted MDF Fronts',
  title_he         = 'חזיתות MDF צבועות',
  description_en   = 'Premium painted MDF fronts with smooth finishes and custom colors.',
  description_he   = 'חזיתות MDF צבועות באיכות פרימיום עם גימורים חלקים וצבעים מותאמים.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 1,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222208';

UPDATE subservices SET
  title_en         = 'PVC & Thermofoil Fronts',
  title_he         = 'חזיתות PVC ותרמופויל',
  description_en   = 'Durable wrapped fronts for moisture-resistant applications.',
  description_he   = 'חזיתות עטופות עמידות ליישומים עמידי לחות.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 2,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222209';

UPDATE subservices SET
  title_en         = 'Veneer Fronts',
  title_he         = 'חזיתות פורניר',
  description_en   = 'Natural wood veneer fronts for premium furniture applications.',
  description_he   = 'חזיתות פורניר עץ טבעי לרהיטים פרימיום.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 3,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222210';

UPDATE subservices SET
  title_en         = 'HPL Laminate Fronts',
  title_he         = 'חזיתות למינט HPL',
  description_en   = 'High-pressure laminate fronts for commercial and high-traffic environments.',
  description_he   = 'חזיתות למינט בלחץ גבוה לסביבות מסחריות ותנועה מרובה.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 4,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222211';

-- ── Сервис 3: Custom Kitchen Projects ────────────────────────

UPDATE subservices SET
  slug             = 'kitchen-design-planning',
  title_en         = 'Kitchen Design & Technical Planning',
  title_he         = 'תכנון ועיצוב מטבח',
  description_en   = 'Full technical planning and 3D visualization for custom kitchen projects.',
  description_he   = 'תכנון טכני מלא והדמיה תלת-מימדית לפרויקטי מטבח מותאמים.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 1,
  updated_at        = now()
WHERE id = 'b500965d-5ccc-481e-9c78-d6f31c8061ea';

UPDATE subservices SET
  slug             = 'complete-custom-kitchens',
  title_en         = 'Complete Custom Kitchen',
  title_he         = 'מטבח מותאם אישית מלא',
  description_en   = 'Full cycle: design → production → delivery. For kitchen studios and private clients.',
  description_he   = 'מחזור מלא: עיצוב → ייצור → אספקה. לסטודיות מטבחים ולקוחות פרטיים.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 2,
  updated_at        = now()
WHERE id = '22c9ada3-c259-46e3-86ff-555cb5c02fca';

UPDATE subservices SET
  slug             = 'kitchen-islands',
  title_en         = 'Kitchen Islands',
  title_he         = 'איי מטבח',
  description_en   = 'Custom and standard kitchen island fabrication.',
  description_he   = 'ייצור איי מטבח מותאמים וסטנדרטיים.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 3,
  updated_at        = now()
WHERE id = 'a375d86b-8bdb-49f4-9245-54747079c7d0';

UPDATE subservices SET
  slug             = 'cabinet-carcass-manufacturing',
  title_en         = 'Cabinet Carcass Manufacturing',
  title_he         = 'ייצור קרקסי ארונות',
  description_en   = 'B2B batch production of cabinet carcasses for kitchen factories.',
  description_he   = 'ייצור סדרתי B2B של קרקסי ארונות למפעלי מטבחים.',
  visibility_status = 'coming_soon',
  is_visible        = false,
  sort_order        = 4,
  updated_at        = now()
WHERE id = '53caaf55-e2ad-478c-b920-7fe1804ae867';

-- Скрыть: Custom-sizing-&-configurations (нет в структуре v2.0)
UPDATE subservices SET
  visibility_status = 'hidden',
  is_visible        = false,
  updated_at        = now()
WHERE id = 'df190ade-fb38-4cb9-b82f-2b312b6d1b9f';

-- ── Сервис 4: CNC Services for Professionals ─────────────────

-- board-cutting → Panel Cutting to Size (главный вход)
UPDATE subservices SET
  slug             = 'panel-cutting-to-size',
  title_en         = 'Panel Cutting to Size',
  title_he         = 'חיתוך לפי מידה',
  description_en   = 'Upload cutting list (Excel / DXF) or describe in words. File is optional — description is enough.',
  description_he   = 'העלה רשימת חיתוך (Excel / DXF) או תאר במילים. קובץ הוא אופציה — תיאור מספיק.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 1,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222207';

-- drilling-boring → CNC Drilling & Boring
UPDATE subservices SET
  slug             = 'cnc-drilling-boring',
  title_en         = 'CNC Drilling & Boring',
  title_he         = 'קידוח ופיצול CNC',
  description_en   = 'Drilling for hinges, handles, shelf pins, and hardware fittings.',
  description_he   = 'קידוח לצירים, ידיות, תומכי מדפים ואביזרי חומרה.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 2,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222206';

-- front-milling → CNC Milling & Shaping
UPDATE subservices SET
  slug             = 'cnc-milling-shaping',
  title_en         = 'CNC Milling & Shaping',
  title_he         = 'כרסום ועיצוב CNC',
  description_en   = 'Profile milling, front shaping, and edge routing for furniture panels.',
  description_he   = 'כרסום פרופילים, עיצוב חזיתות וניתוב קצוות לפאנלים.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 3,
  updated_at        = now()
WHERE id = '22222222-2222-2222-2222-222222222205';

-- HPL Precision Cutting (переехал из hpl-panel-processing)
UPDATE subservices SET
  slug             = 'hpl-precision-cutting',
  title_en         = 'HPL Precision Cutting',
  title_he         = 'חיתוך HPL מדויק',
  description_en   = 'Precision cutting and shaping of HPL sheets for facades and interiors.',
  description_he   = 'חיתוך ועיצוב מדויק של לוחות HPL לחזיתות ופנים.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 4,
  updated_at        = now()
WHERE id = '6ddb39b0-7b7b-46f5-a71f-ca7afb663b10';

-- Скрыть устаревший HPL PROCESSING SERVICES (дублирует)
UPDATE subservices SET
  visibility_status = 'hidden',
  is_visible        = false,
  updated_at        = now()
WHERE id = 'b4b45b12-aa21-4400-9a59-79f500f13f94';

-- ── Сервис 5: Facade Systems & ACP (Skylum) ──────────────────

-- Facade cassette fabrication — главный продукт Skylum
UPDATE subservices SET
  slug             = 'facade-cassette-fabrication',
  title_en         = 'Facade Cassette Fabrication',
  title_he         = 'ייצור קסטות חזית',
  description_en   = 'ACP facade cassettes in standard and custom sizes for ventilated facades.',
  description_he   = 'קסטות חזית ACP בגדלים סטנדרטיים ומותאמים לחזיתות מאווררות.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 1,
  updated_at        = now()
WHERE id = '955ffd87-be49-49a0-b3fa-7fb18906538f';

-- V-Grooving & Folding
UPDATE subservices SET
  slug             = 'v-grooving-folding',
  title_en         = 'V-Grooving & Folding',
  title_he         = 'חריצת V וקיפול',
  description_en   = 'V-groove routing and panel folding for facade and architectural elements.',
  description_he   = 'חריצת V וקיפול לוחות לאלמנטי חזית ואדריכלות.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 2,
  updated_at        = now()
WHERE id = '8a07475f-980f-4165-ae65-74b277cc1696';

-- Mounting System Preparation
UPDATE subservices SET
  slug             = 'mounting-system-preparation',
  title_en         = 'Mounting System Preparation',
  title_he         = 'הכנה למערכות הרכבה',
  description_en   = 'Panel preparation for ventilated facade mounting systems (Alucobond, Reynobond).',
  description_he   = 'הכנת לוחות למערכות הרכבת חזית מאווררת (Alucobond, Reynobond).',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 3,
  updated_at        = now()
WHERE id = 'fa734e35-c06f-4186-9c69-8fb0a9dcfb60';

-- HPL Wall Cladding (переехал из hpl-panel-processing)
UPDATE subservices SET
  slug             = 'hpl-wall-cladding',
  title_en         = 'HPL Wall Cladding',
  title_he         = 'חיפוי קירות HPL',
  description_en   = 'Interior and exterior HPL wall cladding systems for facades and commercial spaces.',
  description_he   = 'מערכות חיפוי קירות HPL לפנים ולחוץ לחזיתות ומרחבים מסחריים.',
  visibility_status = 'visible',
  is_visible        = true,
  sort_order        = 4,
  updated_at        = now()
WHERE id = 'e013709b-9f7a-4d6a-803e-6706cb057cba';

-- Скрыть: Large-format-panel-cutting (содержимое → продукты в cassette fabrication)
-- Скрыть: Custom-facade-elements (coming soon, пока нет контента)
-- Скрыть: Shop-Drawings (фаза 2)
-- Скрыть: Exterior HPL (объединён в hpl-wall-cladding)
UPDATE subservices SET
  visibility_status = 'hidden',
  is_visible        = false,
  updated_at        = now()
WHERE id IN (
  '8efd9ca6-8e0f-4a90-8f16-5c3bd04c77f4', -- Large-format-panel-cutting
  'a1d5c910-6eb8-4d22-9397-90a633382f14', -- Custom-facade-elements
  '0ed7656f-90d5-465a-95ec-d5766b57c772', -- Shop-Drawings (phase 2)
  'f62a59e4-6773-470a-bd25-b6e9558d090b'  -- Exterior HPL (объединён)
);

-- ============================================================
-- SECTION 4: НОВЫЕ ПОДСЕРВИСЫ
-- ============================================================

-- ── Сервис 4 CNC: Edge Banding Service (нового нет в DB) ─────
INSERT INTO subservices (
  slug, service_id,
  title_en, title_he,
  description_en, description_he,
  visibility_status, is_visible, sort_order
) VALUES (
  'edge-banding-service',
  'd5c2bcf3-8b87-4550-a2a3-a7126763294d',
  'Edge Banding Service',
  'שירות כיסוי קצוות',
  'Straight and post-forming edge banding. Often ordered together with panel cutting.',
  'כיסוי קצוות ישר ופוסט-פורמינג. לרוב מוזמן יחד עם חיתוך לוחות.',
  'visible',
  true,
  5
);

-- ── Сервис 6 Materials: HPL Sheet Supply ─────────────────────
INSERT INTO subservices (
  slug, service_id,
  title_en, title_he,
  description_en, description_he,
  visibility_status, is_visible, sort_order
) VALUES (
  'hpl-sheet-supply',
  'c2d04774-9946-451d-a982-1833f4bc5680',
  'HPL Sheet Supply',
  'אספקת לוחות HPL',
  'HPL sheets in standard formats. Available collections and thicknesses — coming soon.',
  'לוחות HPL בפורמטים סטנדרטיים. קולקציות ועוביים זמינים — בקרוב.',
  'coming_soon',
  false,
  1
);

-- ── Сервис 6 Materials: ACP Sheet Supply ─────────────────────
INSERT INTO subservices (
  slug, service_id,
  title_en, title_he,
  description_en, description_he,
  visibility_status, is_visible, sort_order
) VALUES (
  'acp-sheet-supply',
  'c2d04774-9946-451d-a982-1833f4bc5680',
  'ACP Sheet Supply',
  'אספקת לוחות ACP',
  'Aluminum composite panels in various thicknesses and finishes — coming soon.',
  'פאנלים קומפוזיט אלומיניום בעוביים וגימורים שונים — בקרוב.',
  'coming_soon',
  false,
  2
);

-- ============================================================
-- SECTION 5: ПРОДУКТЫ — только скрытые SKU по каталогу
-- Все активные продукты остаются без изменений.
-- ============================================================

-- B-80-D2-S1-153 и B80-D2-S2 — уже hidden в DB.
-- Решение по ним (удалить/восстановить) — за Игорем.
-- Пока оставляем как есть (hidden).

-- ============================================================
-- ПРОВЕРОЧНЫЕ ЗАПРОСЫ (выполнить после COMMIT для верификации)
-- ============================================================
-- SELECT slug, title_en, brand, order_type, visibility_status, sort_order
-- FROM services ORDER BY sort_order;
--
-- SELECT s.slug as service, sub.slug, sub.title_en, sub.visibility_status
-- FROM subservices sub
-- JOIN services s ON s.id = sub.service_id
-- WHERE s.visibility_status IN ('visible','coming_soon')
-- ORDER BY s.sort_order, sub.sort_order;

COMMIT;

-- ============================================================
-- ОЖИДАЕМЫЙ РЕЗУЛЬТАТ ПОСЛЕ МИГРАЦИИ
-- ============================================================
-- СЕРВИСЫ (публичные):
-- 1 | cabinet-storage-modules         | HWOOD  | browse-and-order    | visible
-- 2 | interior-fronts-surfaces        | HWOOD  | browse-and-order    | visible
-- 3 | custom-kitchen-projects         | HWOOD  | describe-and-request| visible
-- 4 | cnc-services-for-professionals  | HWOOD  | send-file-and-process| visible
-- 5 | facade-systems-acp              | SKYLUM | describe-and-request| visible
-- 6 | materials-panel-supply          | SKYLUM | informational       | coming_soon
--
-- ПОДСЕРВИСЫ (видимые):
-- Service 1 (cabinet): kitchen-modules (visible), +3 coming_soon
-- Service 2 (fronts):  4 подсервиса coming_soon
-- Service 3 (kitchen): kitchen-design-planning (visible), +3 coming_soon
-- Service 4 (cnc):     panel-cutting, drilling, milling, hpl-cutting, edge-banding (visible)
-- Service 5 (facade):  cassette, v-grooving, mounting, hpl-cladding (visible)
-- Service 6 (materials): 2 подсервиса coming_soon
--
-- ПРОДУКТЫ: 37 без изменений (2 скрытых остаются до решения Игоря)
