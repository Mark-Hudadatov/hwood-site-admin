/**
 * QUOTE PAGE — 3 Form Variants
 * =============================
 * v2.0 — April 2026
 * Routes to correct form based on service.orderType:
 *   browse-and-order      → BrowseOrderForm
 *   send-file-and-process → SendFileForm
 *   describe-and-request  → DescribeRequestForm
 *
 * URL patterns:
 *   /quote?service=cabinet-storage-modules&product=b-60-d1
 *   /quote?service=cnc-services-for-professionals&subservice=panel-cutting-to-size
 *   /quote?service=custom-kitchen-projects
 *   /quote?service=facade-systems-acp
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle, Send, FileText, MessageSquare } from 'lucide-react';
import { Service, ServiceOrderType, BrowseOrderSubmission, SendFileSubmission, DescribeRequestSubmission } from '../domain/types';
import { getServiceBySlug, getProductBySlug, submitOrderForm, uploadOrderFile } from '../services/data/dataService';
import { ROUTES } from '../router';

const getCurrentLang = (): 'en' | 'he' => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('i18nextLng')?.startsWith('he') ? 'he' : 'en';
};

// ============================================================================
// ORDER TYPE BADGE
// ============================================================================

const ORDER_TYPE_CONFIG: Record<ServiceOrderType, { label: string; labelHe: string; color: string; icon: React.ElementType }> = {
  'browse-and-order':      { label: 'Browse & Order',      labelHe: 'הזמנה מקטלוג',    color: 'bg-teal-100 text-teal-800',   icon: FileText },
  'send-file-and-process': { label: 'Send File & Process', labelHe: 'שלח קובץ ועבד',    color: 'bg-amber-100 text-amber-800', icon: Upload },
  'describe-and-request':  { label: 'Describe & Request',  labelHe: 'תאר ובקש',         color: 'bg-purple-100 text-purple-800', icon: MessageSquare },
  'informational':         { label: 'Information',         labelHe: 'מידע',             color: 'bg-gray-100 text-gray-700',   icon: FileText },
};

// ============================================================================
// FILE UPLOAD WIDGET (shared)
// ============================================================================

interface FileUploadProps {
  onFileUrl: (url: string | null) => void;
  label: string;
  hint: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUrl, label, hint }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large. Maximum 20MB.');
      return;
    }
    setError(null);
    setUploading(true);
    const url = await uploadOrderFile(file);
    setUploading(false);
    if (url) {
      setFileName(file.name);
      onFileUrl(url);
    } else {
      setError('Upload failed. Please try again.');
    }
  };

  const clear = () => {
    setFileName(null);
    onFileUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {fileName ? (
        <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span className="text-sm text-teal-800 flex-1 truncate">{fileName}</span>
          <button type="button" onClick={clear} className="text-teal-500 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.dxf,.dwg,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.zip"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-neutral-500">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">{hint}</p>
              <p className="text-xs text-neutral-400 mt-1">PDF, DXF, DWG, Excel, PNG, ZIP — max 20MB</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

// ============================================================================
// THANK YOU PAGE
// ============================================================================

const ThankYouPage: React.FC<{ orderType?: ServiceOrderType; serviceSlug?: string }> = ({ orderType, serviceSlug }) => {
  const lang = getCurrentLang();

  const messages = {
    'browse-and-order': {
      title: lang === 'he' ? 'הצעת מחיר התקבלה!' : 'Quote Request Received!',
      body: lang === 'he'
        ? 'נחזור אליך תוך יום עסקים אחד עם פרטים והצעת מחיר.'
        : 'We will get back to you within 1 business day with details and a quote.',
    },
    'send-file-and-process': {
      title: lang === 'he' ? 'הבקשה התקבלה!' : 'Job Request Received!',
      body: lang === 'he'
        ? 'המנהל יצור איתך קשר לאישור פרטי העבודה לפני ייצור.'
        : 'Our manager will contact you to confirm job details before production.',
    },
    'describe-and-request': {
      title: lang === 'he' ? 'הבריף התקבל!' : 'Project Brief Received!',
      body: lang === 'he'
        ? 'נסקור את הפרויקט וניצור איתך קשר תוך 1-2 ימי עסקים.'
        : 'We will review your project and contact you within 1-2 business days.',
    },
    'informational': {
      title: lang === 'he' ? 'הפנייה התקבלה!' : 'Request Received!',
      body: lang === 'he' ? 'נחזור אליך בהקדם.' : 'We will get back to you soon.',
    },
  };

  const msg = messages[orderType || 'browse-and-order'];

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-neutral-50">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900 mb-4">{msg.title}</h1>
        <p className="text-neutral-600 mb-8">{msg.body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={ROUTES.HOME} className="bg-brand text-white px-8 py-3 rounded-xl font-medium hover:bg-brand/90 transition-colors">
            {lang === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
          </Link>
          {serviceSlug && (
            <Link to={ROUTES.SERVICE(serviceSlug)} className="border-2 border-brand text-brand px-8 py-3 rounded-xl font-medium hover:bg-brand/5 transition-colors">
              {lang === 'he' ? 'חזרה לשירות' : 'Back to Service'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FORM 1: BROWSE & ORDER
// ============================================================================

const BrowseOrderForm: React.FC<{
  service: Service;
  productSlug?: string;
  productTitle?: string;
  onSuccess: () => void;
}> = ({ service, productSlug, productTitle, onSuccess }) => {
  const lang = getCurrentLang();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', company: '', quantity: '', comment: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    setError(null);

    const submission: BrowseOrderSubmission = {
      orderType: 'browse-and-order',
      serviceSlug: service.slug,
      name: form.name,
      phone: form.phone,
      company: form.company || undefined,
      productId: productSlug || undefined,
      productTitle: productTitle || undefined,
      quantity: form.quantity || undefined,
      comment: form.comment || undefined,
    };

    const result = await submitOrderForm(submission);
    setSubmitting(false);
    if (result.success) onSuccess();
    else setError(lang === 'he' ? 'שגיאה בשליחה. נסה שנית.' : 'Submission failed. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {productTitle && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-sm text-teal-700">{lang === 'he' ? 'מוצר נבחר:' : 'Selected product:'}</p>
          <p className="font-semibold text-teal-900">{productTitle}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'שם *' : 'Name *'}
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'טלפון *' : 'Phone *'}
          </label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+972-XX-XXX-XXXX"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'חברה' : 'Company'}
          </label>
          <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'כמות' : 'Quantity'}
          </label>
          <input type="text" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: 10 יחידות' : 'e.g. 10 units'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {lang === 'he' ? 'הערות' : 'Comments'}
        </label>
        <textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none" />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={submitting}
        className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        {submitting ? (lang === 'he' ? 'שולח...' : 'Sending...') : (lang === 'he' ? 'שלח בקשת הצעת מחיר' : 'Request Quote')}
      </button>
    </form>
  );
};

// ============================================================================
// FORM 2: SEND FILE & PROCESS
// ============================================================================

const SendFileForm: React.FC<{
  service: Service;
  subserviceSlug?: string;
  onSuccess: () => void;
}> = ({ service, subserviceSlug, onSuccess }) => {
  const lang = getCurrentLang();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', company: '',
    operationType: subserviceSlug || '',
    material: '', thickness: '', volume: '', deadline: '', description: '',
  });

  const operationOptions = [
    { value: 'panel-cutting-to-size', en: 'Panel Cutting to Size', he: 'חיתוך לפי מידה' },
    { value: 'cnc-drilling-boring',   en: 'CNC Drilling & Boring', he: 'קידוח ופיצול CNC' },
    { value: 'cnc-milling-shaping',   en: 'CNC Milling & Shaping', he: 'כרסום ועיצוב CNC' },
    { value: 'hpl-precision-cutting', en: 'HPL Precision Cutting', he: 'חיתוך HPL מדויק' },
    { value: 'edge-banding-service',  en: 'Edge Banding Service',  he: 'שירות כיסוי קצוות' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.description) return;
    setSubmitting(true);
    setError(null);

    const submission: SendFileSubmission = {
      orderType: 'send-file-and-process',
      serviceSlug: service.slug,
      name: form.name,
      phone: form.phone,
      company: form.company || undefined,
      subserviceSlug: form.operationType || undefined,
      operationType: form.operationType || undefined,
      material: form.material || undefined,
      thickness: form.thickness || undefined,
      volume: form.volume || undefined,
      deadline: form.deadline || undefined,
      description: form.description,
      fileUrl: fileUrl || undefined,
    };

    const result = await submitOrderForm(submission);
    setSubmitting(false);
    if (result.success) onSuccess();
    else setError(lang === 'he' ? 'שגיאה בשליחה. נסה שנית.' : 'Submission failed. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'שם *' : 'Name *'}
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'טלפון *' : 'Phone *'}
          </label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+972-XX-XXX-XXXX"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'חברה' : 'Company'}
          </label>
          <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'סוג עבודה *' : 'Operation Type *'}
          </label>
          <select required value={form.operationType} onChange={(e) => setForm({ ...form, operationType: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none">
            <option value="">{lang === 'he' ? 'בחר סוג עבודה' : 'Select operation type'}</option>
            {operationOptions.map((op) => (
              <option key={op.value} value={op.value}>{lang === 'he' ? op.he : op.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'חומר' : 'Material'}
          </label>
          <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: MDF 18mm' : 'e.g. MDF 18mm'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'כמות' : 'Volume'}
          </label>
          <input type="text" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: 50 חלקים' : 'e.g. 50 parts'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'מועד רצוי' : 'Deadline'}
          </label>
          <input type="text" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: 2 שבועות' : 'e.g. 2 weeks'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {lang === 'he' ? 'תיאור העבודה *' : 'Job Description *'}
        </label>
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={lang === 'he'
            ? 'תאר את העבודה הנדרשת. אם אין לך קובץ — תיאור מפורט מספיק.'
            : 'Describe the job. If you have no file — a detailed description is enough.'}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none" />
      </div>

      <FileUpload
        onFileUrl={setFileUrl}
        label={lang === 'he' ? 'העלה קובץ (DXF, Excel, PDF)' : 'Upload File (DXF, Excel, PDF)'}
        hint={lang === 'he'
          ? 'קובץ הוא אופציה — תיאור מילולי מספיק'
          : 'File is optional — text description is enough'}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={submitting}
        className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <Send className="w-4 h-4" />
        {submitting ? (lang === 'he' ? 'שולח...' : 'Sending...') : (lang === 'he' ? 'שלח בקשת עבודה' : 'Send Job Request')}
      </button>
    </form>
  );
};

// ============================================================================
// FORM 3: DESCRIBE & REQUEST
// ============================================================================

const DescribeRequestForm: React.FC<{
  service: Service;
  onSuccess: () => void;
}> = ({ service, onSuccess }) => {
  const lang = getCurrentLang();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', company: '',
    clientRole: '' as 'designer' | 'contractor' | 'developer' | 'private' | '',
    objectType: '', material: '', approximateVolume: '', description: '',
  });

  const roleOptions = [
    { value: 'designer',   en: 'Architect / Interior Designer', he: 'אדריכל / מעצב פנים' },
    { value: 'contractor', en: 'General Contractor',            he: 'קבלן ראשי' },
    { value: 'developer',  en: 'Developer / Real Estate',       he: 'יזם / נדלן' },
    { value: 'private',    en: 'Private Client',                he: 'לקוח פרטי' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.description || !form.clientRole) return;
    setSubmitting(true);
    setError(null);

    const submission: DescribeRequestSubmission = {
      orderType: 'describe-and-request',
      serviceSlug: service.slug,
      name: form.name,
      phone: form.phone,
      company: form.company || undefined,
      clientRole: form.clientRole as 'designer' | 'contractor' | 'developer' | 'private',
      objectType: form.objectType || undefined,
      material: form.material || undefined,
      approximateVolume: form.approximateVolume || undefined,
      description: form.description,
      fileUrl: fileUrl || undefined,
    };

    const result = await submitOrderForm(submission);
    setSubmitting(false);
    if (result.success) onSuccess();
    else setError(lang === 'he' ? 'שגיאה בשליחה. נסה שנית.' : 'Submission failed. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'שם *' : 'Name *'}
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'טלפון *' : 'Phone *'}
          </label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+972-XX-XXX-XXXX"
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'חברה' : 'Company'}
          </label>
          <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'תפקידך *' : 'Your Role *'}
          </label>
          <select required value={form.clientRole} onChange={(e) => setForm({ ...form, clientRole: e.target.value as any })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none">
            <option value="">{lang === 'he' ? 'בחר תפקיד' : 'Select your role'}</option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>{lang === 'he' ? r.he : r.en}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'סוג האובייקט' : 'Object Type'}
          </label>
          <input type="text" value={form.objectType} onChange={(e) => setForm({ ...form, objectType: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: בניין מגורים' : 'e.g. Residential building'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'חומר מועדף' : 'Preferred Material'}
          </label>
          <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: ACP, HPL' : 'e.g. ACP, HPL'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {lang === 'he' ? 'היקף משוער' : 'Approximate Volume'}
          </label>
          <input type="text" value={form.approximateVolume} onChange={(e) => setForm({ ...form, approximateVolume: e.target.value })}
            placeholder={lang === 'he' ? 'לדוגמה: 500 מ"ר' : 'e.g. 500 sqm'}
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {lang === 'he' ? 'תאר את הפרויקט *' : 'Describe Your Project *'}
        </label>
        <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder={lang === 'he'
            ? 'תאר את הפרויקט — מה אתה מחפש, שלב התכנון, כל מה שיעזור לנו להבין את הצורך.'
            : 'Describe the project — what you need, planning stage, anything that helps us understand your requirements.'}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none" />
      </div>

      <FileUpload
        onFileUrl={setFileUrl}
        label={lang === 'he' ? 'העלה קבצים (רפרנסים, שרטוטים, תמונות)' : 'Upload Files (references, drawings, photos)'}
        hint={lang === 'he'
          ? 'יש לך שרטוטים או רפרנסים? צרף — זה יאיץ את התהליך'
          : 'Have drawings or references? Attach them — it speeds up the process'}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={submitting}
        className="w-full bg-brand text-white py-4 rounded-xl font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        <MessageSquare className="w-4 h-4" />
        {submitting ? (lang === 'he' ? 'שולח...' : 'Sending...') : (lang === 'he' ? 'שלח בריף פרויקט' : 'Submit Project Brief')}
      </button>
    </form>
  );
};

// ============================================================================
// QUOTE PAGE HEADER
// ============================================================================

const QuotePageHeader: React.FC<{ service: Service | null }> = ({ service }) => {
  const lang = getCurrentLang();
  const navigate = useNavigate();

  const orderType = service?.orderType || 'browse-and-order';
  const config = ORDER_TYPE_CONFIG[orderType];
  const Icon = config.icon;

  return (
    <div className="bg-brand text-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {lang === 'he' ? 'חזרה' : 'Back'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            <Icon className="w-3 h-3" />
            {lang === 'he' ? config.labelHe : config.label}
          </span>
          {service && (
            <span className="text-white/60 text-sm">{service.title}</span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mb-3">
          {orderType === 'browse-and-order'      && (lang === 'he' ? 'בקשת הצעת מחיר' : 'Request a Quote')}
          {orderType === 'send-file-and-process' && (lang === 'he' ? 'שלח בקשת עבודה' : 'Send Job Request')}
          {orderType === 'describe-and-request'  && (lang === 'he' ? 'תאר את הפרויקט' : 'Describe Your Project')}
        </h1>
        <p className="text-white/80 max-w-xl">
          {orderType === 'browse-and-order'      && (lang === 'he' ? 'מלא את הפרטים ונחזור אליך עם הצעת מחיר תוך יום עסקים.' : 'Fill in the details and we will get back to you with a quote within 1 business day.')}
          {orderType === 'send-file-and-process' && (lang === 'he' ? 'תאר את העבודה או העלה קובץ. קובץ הוא אופציה — תיאור מספיק.' : 'Describe the job or upload a file. File is optional — a description is enough.')}
          {orderType === 'describe-and-request'  && (lang === 'he' ? 'ספר לנו על הפרויקט. אין צורך בשרטוטים — מספיק תיאור ראשוני.' : 'Tell us about the project. No drawings needed — an initial description is enough.')}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN QUOTE PAGE
// ============================================================================

export const QuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceSlug    = searchParams.get('service') || '';
  const productSlug    = searchParams.get('product') || '';
  const productTitle   = searchParams.get('productTitle') || '';
  const subserviceSlug = searchParams.get('subservice') || '';

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (serviceSlug) {
        const svc = await getServiceBySlug(serviceSlug);
        setService(svc);
      }
      setLoading(false);
    };
    load();
  }, [serviceSlug]);

  if (submitted) {
    return <ThankYouPage orderType={service?.orderType} serviceSlug={serviceSlug} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderForm = () => {
    if (!service) {
      // Нет сервиса → показать список сервисов для выбора (fallback)
      return (
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-6">
            {getCurrentLang() === 'he' ? 'בחר שירות להתחלת בקשה' : 'Select a service to start a request'}
          </p>
          <Link to="/#services" className="bg-brand text-white px-8 py-3 rounded-xl font-medium hover:bg-brand/90">
            {getCurrentLang() === 'he' ? 'לצפייה בשירותים' : 'View Services'}
          </Link>
        </div>
      );
    }

    switch (service.orderType) {
      case 'browse-and-order':
        return (
          <BrowseOrderForm
            service={service}
            productSlug={productSlug || undefined}
            productTitle={productTitle || undefined}
            onSuccess={() => setSubmitted(true)}
          />
        );
      case 'send-file-and-process':
        return (
          <SendFileForm
            service={service}
            subserviceSlug={subserviceSlug || undefined}
            onSuccess={() => setSubmitted(true)}
          />
        );
      case 'describe-and-request':
        return (
          <DescribeRequestForm
            service={service}
            onSuccess={() => setSubmitted(true)}
          />
        );
      default:
        return (
          <div className="text-center py-12 text-neutral-500">
            {getCurrentLang() === 'he' ? 'שירות זה הוא דף מידע בלבד.' : 'This service is informational only.'}
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen">
      <QuotePageHeader service={service} />
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {renderForm()}
      </div>
    </div>
  );
};
