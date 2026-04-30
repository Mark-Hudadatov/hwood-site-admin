/**
 * SERVICE CONTEXT MAP
 * ===================
 * Static content for ServicePage blocks 3, 4, and 7.
 * Keyed by order_type — NOT by slug.
 *
 * Why order_type and not slug:
 *   - order_type is locked (3 values, won't change)
 *   - New services added via admin inherit correct content automatically
 *   - No developer involvement needed when service catalog grows
 *
 * brand drives only the hero CSS class — no content differences.
 *
 * Bilingual: every string has _en and _he variants.
 * Consumed by ServicePage.tsx only — do not import elsewhere.
 */

// =============================================================================
// TYPES
// =============================================================================

export type OrderType =
  | 'browse-and-order'
  | 'send-file-and-process'
  | 'describe-and-request';

export type Brand = 'hwood' | 'skylum';

export interface OrderStep {
  number: string;       // "01" | "02" | "03"
  icon: string;         // lucide icon name — resolved in ServicePage
  title_en: string;
  title_he: string;
  body_en: string;
  body_he: string;
}

export interface FileFormat {
  label: string;        // "DXF" | "XLS / CSV" etc — language-neutral
}

export interface FileFormatsBox {
  show: boolean;
  formats: FileFormat[];
  note_en: string;
  note_he: string;
  pricing_en: string;
  pricing_he: string;
}

export interface HowToOrderEntry {
  eyebrow_en: string;
  eyebrow_he: string;
  title_en: string;
  title_he: string;
  subtitle_en: string;
  subtitle_he: string;
  steps: OrderStep[];
  fileFormatsBox: FileFormatsBox;
}

export interface WhoOrdersEntry {
  eyebrow_en: string;
  eyebrow_he: string;
  title_en: string;
  title_he: string;
  subtitle_en: string;
  subtitle_he: string;
  tags_en: string[];
  tags_he: string[];
}

export interface CtaEntry {
  title_en: string;
  title_he: string;
  subtitle_en: string;
  subtitle_he: string;
  button_en: string;
  button_he: string;
}

// =============================================================================
// HOW TO ORDER MAP  (Block 3)
// =============================================================================

export const HOW_TO_ORDER_MAP: Record<OrderType, HowToOrderEntry> = {

  'browse-and-order': {
    eyebrow_en: 'Workflow',
    eyebrow_he: 'תהליך',
    title_en: 'How to order',
    title_he: 'איך להזמין',
    subtitle_en: 'Browse the catalog, configure, and submit. No file required.',
    subtitle_he: 'עיינו בקטלוג, הגדירו פרמטרים ושלחו בקשה. אין צורך בקובץ.',
    steps: [
      {
        number: '01',
        icon: 'Grid2X2',
        title_en: 'Browse the catalog',
        title_he: 'עיינו בקטלוג',
        body_en: 'Select a module or front from the product list. Filter by size, material, and finish.',
        body_he: 'בחרו מודול או חזית מרשימת המוצרים. סננו לפי גודל, חומר וגימור.',
      },
      {
        number: '02',
        icon: 'SlidersHorizontal',
        title_en: 'Set dimensions',
        title_he: 'הגדירו מידות',
        body_en: 'Enter your quantities and any optional parameters. Standard sizes ship faster.',
        body_he: 'הזינו כמויות ופרמטרים אופציונליים. מידות סטנדרטיות מסופקות מהר יותר.',
      },
      {
        number: '03',
        icon: 'Send',
        title_en: 'Submit the request',
        title_he: 'שלחו בקשה',
        body_en: 'Leave contact details. A manager calls to confirm timeline and pricing.',
        body_he: 'השאירו פרטי קשר. מנהל יתקשר לאשר לוח זמנים ומחיר.',
      },
    ],
    fileFormatsBox: { show: false, formats: [], note_en: '', note_he: '', pricing_en: '', pricing_he: '' },
  },

  'send-file-and-process': {
    eyebrow_en: 'Workflow',
    eyebrow_he: 'תהליך',
    title_en: 'How to order',
    title_he: 'איך להזמין',
    subtitle_en: 'Three steps from your file to a ready job. Works whether you send a DXF, a spreadsheet, or a written description.',
    subtitle_he: 'שלושה שלבים מהקובץ שלכם לעבודה מוכנה. עובד עם DXF, גיליון אלקטרוני או תיאור בכתב.',
    steps: [
      {
        number: '01',
        icon: 'FileUp',
        title_en: 'Upload file or describe',
        title_he: 'העלו קובץ או תארו',
        body_en: 'Drop a DXF, spreadsheet, or type your job in the request form.',
        body_he: 'גררו DXF, גיליון אלקטרוני, או הקלידו את הדרישות בטופס הבקשה.',
      },
      {
        number: '02',
        icon: 'Layers',
        title_en: 'Specify material and volume',
        title_he: 'ציינו חומר וכמות',
        body_en: 'MDF, plywood, HPL, thickness, quantity, deadline.',
        body_he: 'MDF, עץ לבוד, HPL, עובי, כמות, דדליין.',
      },
      {
        number: '03',
        icon: 'UserCheck',
        title_en: 'Manager contacts you',
        title_he: 'מנהל יוצר קשר',
        body_en: 'Production engineer confirms scope, timing, and quote within one business day.',
        body_he: 'מהנדס ייצור מאשר היקף, לוח זמנים והצעת מחיר תוך יום עסקים אחד.',
      },
    ],
    fileFormatsBox: {
      show: true,
      formats: [
        { label: 'DXF' },
        { label: 'XLS / CSV' },
        { label: 'PDF' },
        { label: 'Text description' },
      ],
      note_en: 'No file? No problem — describe your job in words.',
      note_he: 'אין קובץ? אין בעיה — תארו את העבודה במילים.',
      pricing_en: 'Quoted per project · sheet count, material, and processing time.',
      pricing_he: 'מחיר לפי פרויקט · כמות לוחות, חומר וזמן עיבוד.',
    },
  },

  'describe-and-request': {
    eyebrow_en: 'Workflow',
    eyebrow_he: 'תהליך',
    title_en: 'How to start a project',
    title_he: 'איך להתחיל פרויקט',
    subtitle_en: 'No drawings required. Describe your project and we take it from there.',
    subtitle_he: 'אין צורך בשרטוטים. תארו את הפרויקט ואנחנו נמשיך משם.',
    steps: [
      {
        number: '01',
        icon: 'PenLine',
        title_en: 'Describe the project',
        title_he: 'תארו את הפרויקט',
        body_en: 'Object type, approximate size, material preference, and your role.',
        body_he: 'סוג האובייקט, גודל משוער, העדפת חומר ותפקידכם.',
      },
      {
        number: '02',
        icon: 'Paperclip',
        title_en: 'Attach drawings if ready',
        title_he: 'צרפו שרטוטים אם יש',
        body_en: 'Have a floor plan or sketch? Attach it — it speeds things up. Not required.',
        body_he: 'יש תוכנית קומה או סקיצה? צרפו — זה מאיץ את התהליך. לא חובה.',
      },
      {
        number: '03',
        icon: 'Phone',
        title_en: 'We call to align scope',
        title_he: 'אנחנו מתקשרים לתיאום',
        body_en: 'A project manager reaches out to clarify the brief and outline next steps.',
        body_he: 'מנהל פרויקט יוצר קשר להבהרת הבריף ושלבים הבאים.',
      },
    ],
    fileFormatsBox: { show: false, formats: [], note_en: '', note_he: '', pricing_en: '', pricing_he: '' },
  },
};

// =============================================================================
// WHO ORDERS MAP  (Block 4)
// =============================================================================

export const WHO_ORDERS_MAP: Record<OrderType, WhoOrdersEntry> = {

  'browse-and-order': {
    eyebrow_en: 'Audience',
    eyebrow_he: 'קהל יעד',
    title_en: 'Who orders this',
    title_he: 'מי מזמין זאת',
    subtitle_en: 'Professionals who need production-ready modules, not custom one-offs.',
    subtitle_he: 'אנשי מקצוע הזקוקים למודולים מוכנים לייצור, לא להזמנות חד-פעמיות.',
    tags_en: [
      'Kitchen factories',
      'Carpentry workshops',
      'Interior contractors',
      'Fit-out companies',
      'Furniture resellers',
    ],
    tags_he: [
      'מפעלי מטבחים',
      'סדנאות נגרות',
      'קבלני פנים',
      'חברות התאמה',
      'מפיצי רהיטים',
    ],
  },

  'send-file-and-process': {
    eyebrow_en: 'Audience',
    eyebrow_he: 'קהל יעד',
    title_en: 'Who orders this',
    title_he: 'מי מזמין זאת',
    subtitle_en: 'Businesses running real production, not one-off consumer jobs.',
    subtitle_he: 'עסקים המנהלים ייצור אמיתי, לא עבודות צרכניות חד-פעמיות.',
    tags_en: [
      'Carpentry workshops',
      'Furniture factories',
      'Kitchen producers',
      'General contractors',
      'Interior fit-out companies',
    ],
    tags_he: [
      'סדנאות נגרות',
      'מפעלי רהיטים',
      'יצרני מטבחים',
      'קבלנים כלליים',
      'חברות עיצוב פנים',
    ],
  },

  'describe-and-request': {
    eyebrow_en: 'Audience',
    eyebrow_he: 'קהל יעד',
    title_en: 'Who orders this',
    title_he: 'מי מזמין זאת',
    subtitle_en: 'Project-driven clients who come with an idea, not a finished drawing.',
    subtitle_he: 'לקוחות מונעי פרויקטים שמגיעים עם רעיון, לא עם שרטוט מוגמר.',
    tags_en: [
      'Architects',
      'Interior designers',
      'General contractors',
      'Kitchen studios',
      'Facade companies',
    ],
    tags_he: [
      'אדריכלים',
      'מעצבי פנים',
      'קבלנים כלליים',
      'סטודיוס מטבח',
      'חברות חזיתות',
    ],
  },
};

// =============================================================================
// CTA MAP  (Block 7)
// =============================================================================

export const CTA_MAP: Record<OrderType, CtaEntry> = {

  'browse-and-order': {
    title_en: 'Ready to browse the catalog?',
    title_he: 'מוכנים לעיין בקטלוג?',
    subtitle_en: 'Select modules, set dimensions, and submit your request in minutes.',
    subtitle_he: 'בחרו מודולים, הגדירו מידות ושלחו בקשה תוך דקות.',
    button_en: 'Browse catalog',
    button_he: 'עיינו בקטלוג',
  },

  'send-file-and-process': {
    title_en: 'Have a file ready?',
    title_he: 'יש לכם קובץ מוכן?',
    subtitle_en: 'Send your cutting list or DXF and get a quote within one business day.',
    subtitle_he: 'שלחו רשימת חיתוך או DXF וקבלו הצעת מחיר תוך יום עסקים אחד.',
    button_en: 'Send request',
    button_he: 'שלחו בקשה',
  },

  'describe-and-request': {
    title_en: 'Have a project in mind?',
    title_he: 'יש לכם פרויקט בראש?',
    subtitle_en: 'Describe your project and a manager will reach out to align scope.',
    subtitle_he: 'תארו את הפרויקט ומנהל יצור קשר לתיאום ההיקף.',
    button_en: 'Start a project',
    button_he: 'התחילו פרויקט',
  },
};

// =============================================================================
// BRAND HERO CLASS MAP
// =============================================================================

export const BRAND_HERO_CLASS: Record<Brand, string> = {
  hwood:  'sv-hero-hwood',
  skylum: 'sv-hero-skylum',
};

// =============================================================================
// HELPERS
// =============================================================================

/** Resolve order_type string from Supabase to typed OrderType.
 *  Falls back to 'describe-and-request' if value is unknown/missing.
 */
export const resolveOrderType = (raw: string | null | undefined): OrderType => {
  const valid: OrderType[] = ['browse-and-order', 'send-file-and-process', 'describe-and-request'];
  return valid.includes(raw as OrderType) ? (raw as OrderType) : 'describe-and-request';
};

/** Resolve brand string from Supabase to typed Brand. Falls back to 'hwood'. */
export const resolveBrand = (raw: string | null | undefined): Brand => {
  return raw === 'skylum' ? 'skylum' : 'hwood';
};
