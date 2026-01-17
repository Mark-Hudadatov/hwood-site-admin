-- ============================================
-- HWOOD CMS - SEED DATA
-- Run this AFTER supabase-migration.sql
-- ============================================

-- ============================================
-- COMPANY INFO
-- ============================================
UPDATE company_info SET 
  name_en = 'HWOOD',
  name_he = 'HWOOD',
  tagline_en = 'Industrial Carpentry & CNC Production',
  tagline_he = 'נגרות תעשייתית ועיבוד CNC',
  description_en = 'A modern production powerhouse delivering modular cabinet systems, CNC processing, and premium furniture fronts for residential and commercial projects.',
  description_he = 'מפעל ייצור מודרני המספק מערכות ארונות מודולריות, עיבוד CNC וחזיתות רהיטים איכותיות לפרויקטים למגורים ומסחר.',
  phone = '+972-54-922-2804',
  email = 'office@skylum.co.il',
  address_en = 'Ha Masger 20, Netanya, Israel',
  address_he = 'המסגר 20, נתניה, ישראל'
WHERE id = 1;

-- ============================================
-- SERVICES
-- ============================================
INSERT INTO services (id, slug, title_en, title_he, description_en, description_he, image_url, hero_image_url, accent_color, visibility_status, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'modular-cabinet-systems', 
   'Modular & Cabinet Systems', 'מערכות מודולריות וארונות',
   'Scalable, durable, and precisely engineered modular systems for kitchens, bathrooms, wardrobes, and storage spaces.',
   'מערכות מודולריות מדויקות, עמידות וניתנות להרחבה למטבחים, חדרי אמבטיה, ארונות ומרחבי אחסון.',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
   '#D48F28', 'visible', 1),
   
  ('11111111-1111-1111-1111-111111111102', 'cnc-board-processing',
   'CNC Board Processing', 'עיבוד לוחות CNC',
   'Advanced CNC infrastructure for complex shapes, drilling, milling, and high-volume production with consistent accuracy.',
   'תשתית CNC מתקדמת לצורות מורכבות, קידוח, כרסום וייצור בנפח גבוה עם דיוק עקבי.',
   'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
   'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000',
   '#2D5A5A', 'visible', 2),
   
  ('11111111-1111-1111-1111-111111111103', 'furniture-fronts-production',
   'Furniture Fronts Production', 'ייצור חזיתות רהיטים',
   'High-quality MDF, PVC, veneer, and HPL fronts for kitchens, wardrobes, storage furniture, and architectural applications.',
   'חזיתות MDF, PVC, פורניר ו-HPL באיכות גבוהה למטבחים, ארונות, רהיטי אחסון ויישומים אדריכליים.',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
   '#8B4513', 'visible', 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he,
  description_en = EXCLUDED.description_en,
  description_he = EXCLUDED.description_he;

-- ============================================
-- SUBSERVICES
-- ============================================
INSERT INTO subservices (id, service_id, slug, title_en, title_he, description_en, description_he, image_url, hero_image_url, visibility_status, sort_order) VALUES
  -- Modular & Cabinet Systems
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'kitchen-modules',
   'Kitchen Modules', 'מודולים למטבח',
   'Complete modular solutions for kitchen cabinet bodies, from cutting to assembly.',
   'פתרונות מודולריים מלאים לגופי ארונות מטבח, מחיתוך ועד הרכבה.',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
   'visible', 1),
   
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'bathroom-niche-modules',
   'Bathroom & Niche Modules', 'מודולים לאמבטיה ונישות',
   'Specialized solutions for bathroom furniture and built-in niche systems.',
   'פתרונות מיוחדים לריהוט אמבטיה ומערכות נישות מובנות.',
   'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 2),
   
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', 'wardrobe-closet-systems',
   'Wardrobe & Closet Systems', 'מערכות ארונות וחדרי ארונות',
   'Flexible manufacturing systems for walk-in closets and wardrobe interiors.',
   'מערכות ייצור גמישות לחדרי ארונות ופנימי ארונות בגדים.',
   'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 3),
   
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111101', 'drawer-storage-units',
   'Drawer & Storage Units', 'יחידות מגירות ואחסון',
   'Precision-built drawer boxes and pull-out storage solutions.',
   'קופסאות מגירות ופתרונות אחסון נשלפים בייצור מדויק.',
   'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 4),
   
  -- CNC Board Processing
  ('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111102', 'front-milling',
   'Front Milling', 'כרסום חזיתות',
   'High-precision CNC milling for furniture fronts and decorative panels.',
   'כרסום CNC בדיוק גבוה לחזיתות רהיטים ופאנלים דקורטיביים.',
   'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 1),
   
  ('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111102', 'drilling-boring',
   'Drilling & Boring', 'קידוח ומשחיז',
   'Accurate drilling and boring operations for hardware, dowels, and fittings.',
   'פעולות קידוח ומשחיז מדויקות לחומרה, דובלים ואביזרים.',
   'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 2),
   
  ('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111102', 'board-cutting',
   'Board Cutting', 'חיתוך לוחות',
   'Precision cutting services for panels and boards of all sizes.',
   'שירותי חיתוך מדויקים ללוחות ופאנלים בכל הגדלים.',
   'https://images.unsplash.com/photo-1616627577385-5c0c4dab8c3f?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 3),
   
  -- Furniture Fronts Production
  ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111103', 'painted-mdf',
   'Painted MDF', 'MDF צבוע',
   'Premium painted MDF fronts with smooth finishes and custom colors.',
   'חזיתות MDF צבועות באיכות פרימיום עם גימורים חלקים וצבעים מותאמים.',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 1),
   
  ('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111103', 'pvc-thermofoil',
   'PVC / Thermofoil', 'PVC / תרמופויל',
   'Durable PVC and thermofoil wrapped fronts for moisture-resistant applications.',
   'חזיתות עטופות PVC ותרמופויל עמידות ליישומים עמידי לחות.',
   'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 2),
   
  ('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111103', 'veneer-fronts',
   'Veneer Fronts', 'חזיתות פורניר',
   'Natural wood veneer fronts for premium furniture applications.',
   'חזיתות פורניר עץ טבעי ליישומי רהיטים פרימיום.',
   'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 3),
   
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111103', 'hpl-laminate-fronts',
   'HPL Laminate Fronts', 'חזיתות למינט HPL',
   'High-pressure laminate fronts for commercial and high-traffic environments.',
   'חזיתות למינט בלחץ גבוה לסביבות מסחריות ותנועה מרובה.',
   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
   NULL, 'visible', 4)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCT CATEGORIES (Kitchen Modules)
-- ============================================
INSERT INTO product_categories (id, subservice_id, slug, title_en, title_he, description_en, description_he, visibility_status, sort_order) VALUES
  -- Kitchen Modules Categories (from Module Code System)
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'base-units',
   'Base Units (B)', 'יחידות תחתונות (B)',
   'Lower kitchen units (base cabinets), approx. 700 mm height.',
   'יחידות מטבח תחתונות (ארונות בסיס), גובה כ-700 מ"מ.',
   'visible', 1),
   
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'wall-units',
   'Wall Units (W)', 'יחידות קיר (W)',
   'Upper wall-mounted kitchen units (600–900 mm height).',
   'יחידות מטבח עליונות מותקנות על קיר (גובה 600-900 מ"מ).',
   'visible', 2),
   
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'tall-units',
   'Tall Units (H)', 'יחידות גבוהות (H)',
   'Full-height tall cabinets (pantry, oven, fridge).',
   'ארונות גבוהים בגובה מלא (מזווה, תנור, מקרר).',
   'visible', 3),
   
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', 'corner-units',
   'Corner Units (C)', 'יחידות פינה (C)',
   'Corner solutions for base, wall, and tall cabinets.',
   'פתרונות פינה לארונות תחתונים, עליונים וגבוהים.',
   'visible', 4),
   
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222201', 'island-units',
   'Island Units (I)', 'יחידות אי (I)',
   'Free-standing island modules.',
   'מודולי אי עומדים חופשי.',
   'visible', 5),
   
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222201', 'special-units',
   'Special Units (S)', 'יחידות מיוחדות (S)',
   'Decorative, technical, structural elements.',
   'אלמנטים דקורטיביים, טכניים ומבניים.',
   'visible', 6),
   
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222201', 'handle-codes',
   'Handle Codes (HND)', 'קודי ידיות (HND)',
   'Handle profiles and grip solutions.',
   'פרופילי ידיות ופתרונות אחיזה.',
   'visible', 7)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - BASE UNITS (B)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'b-60-3s',
   'B-60-3S', 'B-60-3S',
   'Base unit 600mm, 3 drawers', 'יחידת בסיס 600 מ"מ, 3 מגירות',
   'Premium base cabinet featuring three spacious soft-close drawers. Engineered for maximum storage efficiency with full extension slides and durable construction. Ideal for storing kitchen utensils, cookware, and accessories.',
   'ארון בסיס פרימיום עם שלוש מגירות מרווחות בסגירה שקטה. תוכנן ליעילות אחסון מקסימלית עם מסילות הארכה מלאה ובנייה עמידה. אידיאלי לאחסון כלי מטבח, כלי בישול ואביזרים.',
   '/placeholder-base.jpg',
   '["Triple drawer configuration", "Soft-close mechanism", "Full extension slides", "18mm moisture-resistant panels", "Adjustable legs included"]',
   '["תצורת שלוש מגירות", "מנגנון סגירה שקטה", "מסילות הארכה מלאה", "פאנלים עמידים ללחות 18 מ\"מ", "רגליים מתכווננות כלולות"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'b-80-2d',
   'B-80-2D', 'B-80-2D',
   'Base unit 800mm, 2 doors', 'יחידת בסיס 800 מ"מ, 2 דלתות',
   'Versatile double-door base cabinet with adjustable shelf. Perfect for storing larger items and pots. Features soft-close hinges and durable construction.',
   'ארון בסיס דו-דלתי רב-תכליתי עם מדף מתכוונן. מושלם לאחסון פריטים גדולים וסירים. כולל צירים בסגירה שקטה ובנייה עמידה.',
   '/placeholder-base.jpg',
   '["Double door design", "Adjustable interior shelf", "Soft-close hinges", "18mm panels", "110° door opening"]',
   '["עיצוב דו-דלתי", "מדף פנימי מתכוונן", "צירים בסגירה שקטה", "פאנלים 18 מ\"מ", "פתיחת דלת 110°"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'b-60-sd',
   'B-60-S+D', 'B-60-S+D',
   'Base unit 600mm, 1 drawer + door', 'יחידת בסיס 600 מ"מ, מגירה + דלת',
   'Combination cabinet with top drawer and door below. Ideal balance of drawer accessibility and shelf storage. Features soft-close on both drawer and door.',
   'ארון משולב עם מגירה עליונה ודלת מתחת. איזון אידיאלי בין נגישות מגירה ואחסון מדפים. כולל סגירה שקטה גם במגירה וגם בדלת.',
   '/placeholder-base.jpg',
   '["Drawer + door combination", "Top drawer for utensils", "Lower storage with shelf", "Soft-close all around", "Adjustable legs"]',
   '["שילוב מגירה + דלת", "מגירה עליונה לכלים", "אחסון תחתון עם מדף", "סגירה שקטה בכל מקום", "רגליים מתכווננות"]',
   'visible', 3),
   
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'b-60-sink',
   'B-60-SINK', 'B-60-SINK',
   'Sink base cabinet 600mm', 'ארון בסיס לכיור 600 מ"מ',
   'Specially designed cabinet for sink installation with waterproof base and flexible pipe routing. Features reinforced structure and waste bin ready cutouts.',
   'ארון מתוכנן במיוחד להתקנת כיור עם בסיס עמיד למים וניתוב צנרת גמיש. כולל מבנה מחוזק ופתחים מוכנים לפח אשפה.',
   '/placeholder-base.jpg',
   '["Waterproof base panel", "Flexible pipe routing", "Waste bin ready", "Reinforced structure", "No back panel for plumbing"]',
   '["פאנל בסיס עמיד למים", "ניתוב צנרת גמיש", "מוכן לפח אשפה", "מבנה מחוזק", "ללא פאנל אחורי לאינסטלציה"]',
   'visible', 4)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - WALL UNITS (W)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333302', 'w-60-d',
   'W-60-D', 'W-60-D',
   'Wall unit 600mm, 1 door', 'יחידת קיר 600 מ"מ, דלת אחת',
   'Standard wall cabinet with single door and adjustable shelves. Perfect for everyday kitchen storage needs with easy access.',
   'ארון קיר סטנדרטי עם דלת אחת ומדפים מתכווננים. מושלם לצרכי אחסון יומיומיים במטבח עם גישה נוחה.',
   '/placeholder-wall.jpg',
   '["Single door", "2 adjustable shelves", "Soft-close hinge", "Wall mounting brackets included", "600mm height"]',
   '["דלת אחת", "2 מדפים מתכווננים", "ציר סגירה שקטה", "תושבות קיר כלולות", "גובה 600 מ\"מ"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333302', 'w-80-2d',
   'W-80-2D', 'W-80-2D',
   'Wall unit 800mm, 2 doors', 'יחידת קיר 800 מ"מ, 2 דלתות',
   'Double-door wall cabinet for larger storage capacity. Features adjustable shelves and soft-close hinges on both doors.',
   'ארון קיר דו-דלתי לקיבולת אחסון גדולה יותר. כולל מדפים מתכווננים וצירים בסגירה שקטה בשתי הדלתות.',
   '/placeholder-wall.jpg',
   '["Double doors", "3 adjustable shelves", "Soft-close hinges", "Concealed mounting", "900mm height option"]',
   '["דלתות כפולות", "3 מדפים מתכווננים", "צירים בסגירה שקטה", "תליה נסתרת", "אפשרות גובה 900 מ\"מ"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444413', '33333333-3333-3333-3333-333333333302', 'w-60-up',
   'W-60-UP', 'W-60-UP',
   'Lift-up door wall unit', 'יחידת קיר עם דלת מתרוממת',
   'Modern wall cabinet with lift-up door mechanism. Stays open hands-free for easy access while cooking.',
   'ארון קיר מודרני עם מנגנון דלת מתרוממת. נשאר פתוח ללא ידיים לגישה נוחה בזמן בישול.',
   '/placeholder-wall.jpg',
   '["Lift-up mechanism", "Stays open automatically", "Soft-close return", "Modern design", "Easy access while cooking"]',
   '["מנגנון הרמה", "נשאר פתוח אוטומטית", "חזרה בסגירה שקטה", "עיצוב מודרני", "גישה קלה בזמן בישול"]',
   'visible', 3),
   
  ('44444444-4444-4444-4444-444444444414', '33333333-3333-3333-3333-333333333302', 'w-40-sh',
   'W-40-SH', 'W-40-SH',
   'Open shelf unit 400mm', 'יחידת מדפים פתוחה 400 מ"מ',
   'Open shelving unit for display and quick-access storage. Perfect for spices, cookbooks, and decorative items.',
   'יחידת מדפים פתוחה לתצוגה ואחסון בגישה מהירה. מושלם לתבלינים, ספרי בישול ופריטים דקורטיביים.',
   '/placeholder-wall.jpg',
   '["Open design", "2-3 fixed shelves", "Display ready", "Easy access", "Decorative element"]',
   '["עיצוב פתוח", "2-3 מדפים קבועים", "מוכן לתצוגה", "גישה קלה", "אלמנט דקורטיבי"]',
   'visible', 4)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - TALL UNITS (H)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444421', '33333333-3333-3333-3333-333333333303', 'h-60-fr',
   'H-60-FR', 'H-60-FR',
   'Fridge housing 600mm', 'ארון למקרר 600 מ"מ',
   'Full-height cabinet designed to house built-in refrigerators. Provides seamless integration with your kitchen design.',
   'ארון בגובה מלא מתוכנן לשילוב מקררים בנויים. מספק אינטגרציה חלקה עם עיצוב המטבח שלך.',
   '/placeholder-tall.jpg',
   '["Built-in fridge integration", "Ventilation slots", "Adjustable supports", "Door panel ready", "Full height design"]',
   '["אינטגרציה למקרר בנוי", "פתחי אוורור", "תמיכות מתכווננות", "מוכן לפאנל דלת", "עיצוב בגובה מלא"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444422', '33333333-3333-3333-3333-333333333303', 'h-60-ovn',
   'H-60-OVN', 'H-60-OVN',
   'Oven tower 600mm', 'מגדל תנור 600 מ"מ',
   'Ergonomic oven housing at comfortable working height. Includes storage above and below the oven compartment.',
   'ארון תנור ארגונומי בגובה עבודה נוח. כולל אחסון מעל ומתחת לתא התנור.',
   '/placeholder-tall.jpg',
   '["Ergonomic oven height", "Upper storage cabinet", "Lower drawer/cabinet", "Heat resistant back", "Easy installation"]',
   '["גובה תנור ארגונומי", "ארון אחסון עליון", "מגירה/ארון תחתון", "גב עמיד לחום", "התקנה קלה"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444423', '33333333-3333-3333-3333-333333333303', 'h-40-d',
   'H-40-D', 'H-40-D',
   'Tall cabinet 400mm', 'ארון גבוה 400 מ"מ',
   'Narrow tall cabinet for pantry storage. Multiple adjustable shelves for versatile organization.',
   'ארון גבוה צר לאחסון מזווה. מדפים מתכווננים מרובים לארגון גמיש.',
   '/placeholder-tall.jpg',
   '["Narrow profile", "5+ adjustable shelves", "Pantry storage", "Soft-close door", "Full height access"]',
   '["פרופיל צר", "5+ מדפים מתכווננים", "אחסון מזווה", "דלת סגירה שקטה", "גישה בגובה מלא"]',
   'visible', 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - CORNER UNITS (C)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444431', '33333333-3333-3333-3333-333333333304', 'c-90-d',
   'C-90-D', 'C-90-D',
   'Corner base cabinet 90×90', 'ארון פינתי תחתון 90×90',
   'L-shaped corner cabinet maximizing corner space. Features rotating shelves for easy access to all contents.',
   'ארון פינתי בצורת L המפיק את המרב ממרחב הפינה. כולל מדפים מסתובבים לגישה קלה לכל התכולה.',
   '/placeholder-corner.jpg',
   '["L-shape design", "Rotating carousel shelves", "Maximizes corner space", "Soft-close door", "90° corner fit"]',
   '["עיצוב בצורת L", "מדפי קרוסלה מסתובבים", "ממקסם מרחב פינה", "דלת סגירה שקטה", "התאמה לפינה 90°"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444432', '33333333-3333-3333-3333-333333333304', 'c-w-60',
   'C-W-60', 'C-W-60',
   'Wall corner unit', 'יחידת קיר פינתית',
   'Upper corner cabinet for continuous wall storage. Bi-fold doors for full access to corner space.',
   'ארון פינתי עליון לאחסון קיר רציף. דלתות מתקפלות לגישה מלאה למרחב הפינה.',
   '/placeholder-corner.jpg',
   '["Bi-fold doors", "Corner shelf system", "Full access design", "Wall mounted", "Connects wall runs"]',
   '["דלתות מתקפלות", "מערכת מדפי פינה", "עיצוב גישה מלאה", "תלוי קיר", "מחבר שורות קיר"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444433', '33333333-3333-3333-3333-333333333304', 'c-diag',
   'C-DIAG', 'C-DIAG',
   'Diagonal corner unit', 'יחידת פינה אלכסונית',
   'Diagonal corner cabinet offering unique design solution. Single angled door with full interior access.',
   'ארון פינה אלכסוני המציע פתרון עיצוב ייחודי. דלת זוויתית אחת עם גישה מלאה לפנים.',
   '/placeholder-corner.jpg',
   '["Diagonal design", "Single angled door", "Unique aesthetic", "Full interior access", "Space efficient"]',
   '["עיצוב אלכסוני", "דלת זוויתית אחת", "אסתטיקה ייחודית", "גישה מלאה לפנים", "יעיל במרחב"]',
   'visible', 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - ISLAND UNITS (I)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333305', 'i-120-3s',
   'I-120-3S', 'I-120-3S',
   'Island 120cm, 3 drawers', 'אי 120 ס"מ, 3 מגירות',
   'Freestanding island base with triple drawer configuration. Perfect as a prep station or additional workspace.',
   'בסיס אי עומד חופשי עם תצורת שלוש מגירות. מושלם כתחנת הכנה או משטח עבודה נוסף.',
   '/placeholder-island.jpg',
   '["Freestanding design", "3 large drawers", "Both sides accessible", "Countertop ready", "Finished all sides"]',
   '["עיצוב עומד חופשי", "3 מגירות גדולות", "נגיש משני הצדדים", "מוכן למשטח עבודה", "גמור מכל הצדדים"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333305', 'i-140-2d',
   'I-140-2D', 'I-140-2D',
   'Island 140cm, 2 doors', 'אי 140 ס"מ, 2 דלתות',
   'Spacious island cabinet with double doors. Internal shelving provides versatile storage options.',
   'ארון אי מרווח עם דלתות כפולות. מדפים פנימיים מספקים אפשרויות אחסון גמישות.',
   '/placeholder-island.jpg',
   '["Double door access", "Adjustable shelves", "Both sides finished", "140cm length", "Multiple configurations"]',
   '["גישה דו-דלתית", "מדפים מתכווננים", "גמור משני הצדדים", "אורך 140 ס\"מ", "תצורות מרובות"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333305', 'i-200-mix',
   'I-200-MIX', 'I-200-MIX',
   'Mixed configuration island 200cm', 'אי בתצורה משולבת 200 ס"מ',
   'Large island with mixed storage: drawers, doors, and open shelves. Ultimate flexibility for kitchen workflow.',
   'אי גדול עם אחסון משולב: מגירות, דלתות ומדפים פתוחים. גמישות אולטימטיבית לזרימת עבודה במטבח.',
   '/placeholder-island.jpg',
   '["Mixed storage types", "Drawers + doors + shelves", "200cm length", "Custom configurations", "Appliance integration ready"]',
   '["סוגי אחסון משולבים", "מגירות + דלתות + מדפים", "אורך 200 ס\"מ", "תצורות מותאמות", "מוכן לשילוב מכשירים"]',
   'visible', 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - SPECIAL UNITS (S)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444451', '33333333-3333-3333-3333-333333333306', 's-end-80',
   'S-END-80', 'S-END-80',
   'End decorative panel 800mm', 'פאנל דקורטיבי קצה 800 מ"מ',
   'Finishing panel for exposed cabinet sides. Provides clean, professional appearance at cabinet run ends.',
   'פאנל גימור לצדדי ארונות חשופים. מספק מראה נקי ומקצועי בקצוות שורות ארונות.',
   '/placeholder-special.jpg',
   '["Decorative finish", "Matches cabinet doors", "Easy installation", "800mm height", "Various thicknesses"]',
   '["גימור דקורטיבי", "תואם דלתות ארון", "התקנה קלה", "גובה 800 מ\"מ", "עוביים שונים"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444452', '33333333-3333-3333-3333-333333333306', 's-btl-20',
   'S-BTL-20', 'S-BTL-20',
   'Bottle rack 200mm', 'מתקן בקבוקים 200 מ"מ',
   'Narrow pull-out bottle storage. Perfect for oils, wines, and tall bottles next to cooking area.',
   'אחסון בקבוקים נשלף צר. מושלם לשמנים, יינות ובקבוקים גבוהים ליד אזור הבישול.',
   '/placeholder-special.jpg',
   '["Pull-out design", "Bottle dividers", "200mm width", "Full extension", "Soft-close"]',
   '["עיצוב נשלף", "מחיצות בקבוקים", "רוחב 200 מ\"מ", "הארכה מלאה", "סגירה שקטה"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444453', '33333333-3333-3333-3333-333333333306', 's-fill-10',
   'S-FILL-10', 'S-FILL-10',
   'Filler panel 100mm', 'פאנל מילוי 100 מ"מ',
   'Gap filler panel for custom spacing. Essential for perfect fit installations.',
   'פאנל מילוי לרווחים מותאמים. חיוני להתקנות בהתאמה מושלמת.',
   '/placeholder-special.jpg',
   '["Custom gap filling", "100mm standard", "Cuttable to size", "Matches cabinet finish", "Various depths"]',
   '["מילוי רווחים מותאם", "100 מ\"מ סטנדרטי", "ניתן לחיתוך לגודל", "תואם גימור ארון", "עומקים שונים"]',
   'visible', 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- PRODUCTS - HANDLE CODES (HND)
-- ============================================
INSERT INTO products (id, category_id, slug, title_en, title_he, subtitle_en, subtitle_he, description_en, description_he, image_url, features_en, features_he, visibility_status, sort_order) VALUES
  ('44444444-4444-4444-4444-444444444461', '33333333-3333-3333-3333-333333333307', 'hnd-u',
   'HND-U', 'HND-U',
   'U-shaped hidden handle', 'ידית נסתרת בצורת U',
   'Integrated U-profile handle routed into door edge. Creates seamless handleless appearance.',
   'ידית פרופיל U משולבת מכורסמת לקצה הדלת. יוצרת מראה חלק ללא ידיות.',
   '/placeholder-handle.jpg',
   '["Hidden U-profile", "Routed into door", "Handleless look", "Aluminum finish", "Top or side mount"]',
   '["פרופיל U נסתר", "מכורסם לדלת", "מראה ללא ידיות", "גימור אלומיניום", "הרכבה עליונה או צדדית"]',
   'visible', 1),
   
  ('44444444-4444-4444-4444-444444444462', '33333333-3333-3333-3333-333333333307', 'hnd-j',
   'HND-J', 'HND-J',
   'J-shaped hidden handle', 'ידית נסתרת בצורת J',
   'J-profile integrated handle for modern aesthetics. Finger grip along door top edge.',
   'ידית משולבת פרופיל J לאסתטיקה מודרנית. אחיזת אצבעות לאורך קצה הדלת העליון.',
   '/placeholder-handle.jpg',
   '["J-profile design", "Top edge grip", "Modern look", "Anodized aluminum", "Continuous line"]',
   '["עיצוב פרופיל J", "אחיזה בקצה עליון", "מראה מודרני", "אלומיניום מאונדז", "קו רציף"]',
   'visible', 2),
   
  ('44444444-4444-4444-4444-444444444463', '33333333-3333-3333-3333-333333333307', 'hnd-t',
   'HND-T', 'HND-T',
   '45° bevel hidden grip', 'אחיזה נסתרת בשיפוע 45°',
   'Chamfered edge creates finger grip without visible handle. Ultimate minimalist design.',
   'קצה משופע יוצר אחיזת אצבעות ללא ידית נראית. עיצוב מינימליסטי אולטימטיבי.',
   '/placeholder-handle.jpg',
   '["45° chamfer edge", "No visible handle", "Minimalist design", "CNC precision cut", "Continuous surface"]',
   '["קצה שיפוע 45°", "ללא ידית נראית", "עיצוב מינימליסטי", "חיתוך CNC מדויק", "משטח רציף"]',
   'visible', 3),
   
  ('44444444-4444-4444-4444-444444444464', '33333333-3333-3333-3333-333333333307', 'hnd-g',
   'HND-G', 'HND-G',
   'Gola aluminum profile', 'פרופיל גולה אלומיניום',
   'Horizontal gola profile running between cabinets. Creates striking horizontal line in kitchen design.',
   'פרופיל גולה אופקי רץ בין ארונות. יוצר קו אופקי בולט בעיצוב המטבח.',
   '/placeholder-handle.jpg',
   '["Horizontal profile", "Runs between cabinets", "LED ready", "Multiple finishes", "Integrated finger pull"]',
   '["פרופיל אופקי", "רץ בין ארונות", "מוכן ל-LED", "גימורים מרובים", "משיכת אצבע משולבת"]',
   'visible', 4)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- HERO SLIDES
-- ============================================
INSERT INTO hero_slides (id, title_en, title_he, subtitle_en, subtitle_he, image_url, video_url, cta_text_en, cta_text_he, cta_link, is_visible, sort_order) VALUES
  ('55555555-5555-5555-5555-555555555501',
   'Modular Cabinet Systems for Any Project',
   'מערכות ארונות מודולריות לכל פרויקט',
   'Industrial-strength cabinets engineered for kitchens, wardrobes, bathrooms, and storage rooms.',
   'ארונות בחוזק תעשייתי מתוכננים למטבחים, ארונות בגדים, חדרי אמבטיה וחדרי אחסון.',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=2000',
   NULL,
   'Explore Modules', 'חקור מודולים',
   '/services/modular-cabinet-systems',
   true, 1),
   
  ('55555555-5555-5555-5555-555555555502',
   'Advanced CNC Processing for Complex Designs',
   'עיבוד CNC מתקדם לעיצובים מורכבים',
   'Accurate cutting, drilling, milling, and shaping — from one-off parts to high-volume production.',
   'חיתוך, קידוח, כרסום ועיצוב מדויקים — מחלקים בודדים ועד ייצור בנפח גבוה.',
   'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000',
   NULL,
   'View CNC Services', 'צפה בשירותי CNC',
   '/services/cnc-board-processing',
   true, 2),
   
  ('55555555-5555-5555-5555-555555555503',
   'Premium Furniture Fronts & Architectural Panels',
   'חזיתות רהיטים ופאנלים אדריכליים פרימיום',
   'MDF, PVC, veneer, and HPL fronts produced with precision finishing and full quality control.',
   'חזיתות MDF, PVC, פורניר ו-HPL המיוצרות עם גימור מדויק ובקרת איכות מלאה.',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000',
   NULL,
   'See Front Options', 'ראה אפשרויות חזית',
   '/services/furniture-fronts-production',
   true, 3)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- STORIES
-- ============================================
INSERT INTO stories (id, slug, title_en, title_he, date, type, image_url, excerpt_en, excerpt_he, is_visible) VALUES
  ('66666666-6666-6666-6666-666666666601', 'new-cnc-center-installation',
   'New CNC Center Installation Complete',
   'השלמת התקנת מרכז CNC חדש',
   '2025-01-15', 'EVENTS',
   'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
   'HWOOD completes installation of state-of-the-art CNC machinery, expanding production capabilities.',
   'HWOOD משלימה התקנת מכונות CNC חדישות, מרחיבה יכולות ייצור.',
   true),
   
  ('66666666-6666-6666-6666-666666666602', 'tel-aviv-penthouse-kitchen',
   'Luxury Kitchen Project: Tel Aviv Penthouse',
   'פרויקט מטבח יוקרתי: פנטהאוז תל אביב',
   '2025-01-08', 'CUSTOMER STORY',
   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800',
   'Showcase of our premium kitchen installation in a Tel Aviv penthouse featuring custom modules.',
   'תצוגת התקנת המטבח הפרימיום שלנו בפנטהאוז בתל אביב עם מודולים מותאמים אישית.',
   true),
   
  ('66666666-6666-6666-6666-666666666603', 'production-capacity-expansion',
   'HWOOD Expands Production Capacity',
   'HWOOD מרחיבה את קיבולת הייצור',
   '2024-12-20', 'EVENTS',
   'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&q=80&w=800',
   'New production line increases our capacity to serve more customers with faster turnaround.',
   'קו ייצור חדש מגדיל את היכולת שלנו לשרת יותר לקוחות עם זמן אספקה מהיר יותר.',
   true)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_he = EXCLUDED.title_he;

-- ============================================
-- UPDATE story type_id references
-- ============================================
UPDATE stories SET type_id = (SELECT id FROM story_types WHERE slug = 'events') WHERE type = 'EVENTS';
UPDATE stories SET type_id = (SELECT id FROM story_types WHERE slug = 'customer-story') WHERE type = 'CUSTOMER STORY';

-- ============================================
-- DONE - Seed data complete
-- ============================================
