/**
 * QUOTE PAGE v2.0 - HWOOD
 * ========================
 * Routes to 3 different forms based on service.orderType.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Upload, X } from 'lucide-react';
import {
  getServiceBySlug,
  getServices,
  submitOrderForm,
  uploadOrderFile,
} from '../services/data/dataService';
import { Service } from '../domain/types';
import { ROUTES } from '../router';

// ============================================================================
// SHARED HELPERS
// ============================================================================

const inputCls =
  'w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none';

const labelCls = 'block text-sm font-medium text-neutral-700 mb-2';

interface FilePickerProps {
  file: File | null;
  onChange: (f: File | null) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className={labelCls}>Attach File (optional)</label>
      {file ? (
        <div className="flex items-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl bg-neutral-50">
          <span className="flex-1 text-sm text-neutral-700 truncate">{file.name}</span>
          <button type="button" onClick={() => onChange(null)}>
            <X className="w-4 h-4 text-neutral-400 hover:text-red-500" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed border-neutral-300 rounded-xl hover:border-brand transition-colors"
        >
          <Upload className="w-8 h-8 text-neutral-400" />
          <span className="text-sm text-neutral-500">
            Click to upload — DXF, Excel, PDF, JPG, PNG
          </span>
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept=".dxf,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
};

// ============================================================================
// SUCCESS STATE
// ============================================================================

const SuccessState: React.FC<{ serviceSlug: string }> = ({ serviceSlug }) => (
  <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50">
    <div className="max-w-lg mx-auto px-6 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-medium text-neutral-900 mb-4">Request Received!</h1>
      <p className="text-neutral-600 mb-8">
        Thank you for reaching out. Our team will review your request and get back to you within
        1–2 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={ROUTES.HOME} className="bg-brand text-white px-8 py-3 rounded-xl font-medium hover:bg-brand/90 transition-colors">
          Back to Home
        </Link>
        <Link to={ROUTES.SERVICE(serviceSlug)} className="border-2 border-brand text-brand px-8 py-3 rounded-xl font-medium hover:bg-brand/5 transition-colors">
          Back to Service
        </Link>
      </div>
    </div>
  </div>
);

// ============================================================================
// FORM 1 — BROWSE & ORDER
// ============================================================================

interface BrowseOrderFormProps {
  service: Service;
  productTitle: string;
  onSuccess: () => void;
}

const BrowseOrderForm: React.FC<BrowseOrderFormProps> = ({ service, productTitle, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await submitOrderForm({
      orderType: 'browse-and-order',
      serviceSlug: service.slug,
      name,
      phone,
      company: company || undefined,
      productTitle: productTitle || undefined,
      quantity: quantity || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {productTitle && (
        <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-white/70">Ordering:</span>
          <span className="font-medium text-white">{productTitle}</span>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Name <span className="text-red-500">*</span></label>
            <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+972-XX-XXX-XXXX" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Company (optional)</label>
          <input value={company} onChange={e => setCompany(e.target.value)} className={inputCls} placeholder="Your company" />
        </div>
        <div>
          <label className={labelCls}>Quantity / Notes (optional)</label>
          <input value={quantity} onChange={e => setQuantity(e.target.value)} className={inputCls} placeholder="e.g., 10 units, 3 rooms" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors disabled:opacity-50">
          {submitting ? 'Sending…' : 'Submit Order Request'}
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// FORM 2 — SEND FILE & PROCESS
// ============================================================================

interface SendFileFormProps {
  service: Service;
  onSuccess: () => void;
}

const SendFileForm: React.FC<SendFileFormProps> = ({ service, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [operationType, setOperationType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    let fileUrl: string | undefined;
    if (file) {
      const url = await uploadOrderFile(file);
      if (url) fileUrl = url;
    }
    const result = await submitOrderForm({
      orderType: 'send-file-and-process',
      serviceSlug: service.slug,
      name,
      phone,
      company: company || undefined,
      operationType: operationType || undefined,
      description: description || undefined,
      fileUrl,
    });
    setSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Name <span className="text-red-500">*</span></label>
            <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+972-XX-XXX-XXXX" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Company (optional)</label>
          <input value={company} onChange={e => setCompany(e.target.value)} className={inputCls} placeholder="Your company" />
        </div>
        <div>
          <label className={labelCls}>Operation Type</label>
          <select value={operationType} onChange={e => setOperationType(e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            <option value="CNC Cutting">CNC Cutting</option>
            <option value="Edge Banding">Edge Banding</option>
            <option value="Panel Processing">Panel Processing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Description <span className="text-red-500">*</span></label>
          <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)}
            className={inputCls + ' resize-none'} placeholder="Describe your job requirements…" />
        </div>
        <FilePicker file={file} onChange={setFile} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors disabled:opacity-50">
          {submitting ? 'Sending…' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// FORM 3 — DESCRIBE & REQUEST
// ============================================================================

interface DescribeRequestFormProps {
  service: Service;
  onSuccess: () => void;
}

const DescribeRequestForm: React.FC<DescribeRequestFormProps> = ({ service, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [clientRole, setClientRole] = useState<'designer' | 'contractor' | 'developer' | 'private'>('private');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    let fileUrl: string | undefined;
    if (file) {
      const url = await uploadOrderFile(file);
      if (url) fileUrl = url;
    }
    const result = await submitOrderForm({
      orderType: 'describe-and-request',
      serviceSlug: service.slug,
      name,
      phone,
      company: company || undefined,
      clientRole,
      description,
      fileUrl,
    });
    setSubmitting(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Name <span className="text-red-500">*</span></label>
            <input required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className={labelCls}>Phone <span className="text-red-500">*</span></label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="+972-XX-XXX-XXXX" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Company (optional)</label>
          <input value={company} onChange={e => setCompany(e.target.value)} className={inputCls} placeholder="Your company" />
        </div>
        <div>
          <label className={labelCls}>I am a…</label>
          <select value={clientRole} onChange={e => setClientRole(e.target.value as any)} className={inputCls}>
            <option value="private">Private Client</option>
            <option value="designer">Designer</option>
            <option value="contractor">Contractor</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Project Description <span className="text-red-500">*</span></label>
          <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)}
            className={inputCls + ' resize-none'} placeholder="Describe your project — object type, material, approximate size, scope…" />
        </div>
        <FilePicker file={file} onChange={setFile} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors disabled:opacity-50">
          {submitting ? 'Sending…' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

// ============================================================================
// PAGE SHELL
// ============================================================================

export const QuotePage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const serviceSlug = searchParams.get('service') || '';
  const productTitle = searchParams.get('productTitle') || '';
  const typeParam = searchParams.get('type') || '';

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Maps ?type= param to orderType values used by services
  const TYPE_TO_ORDER_TYPE: Record<string, string> = {
    browse:   'browse-and-order',
    file:     'send-file-and-process',
    describe: 'describe-and-request',
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (serviceSlug) {
        const svc = await getServiceBySlug(serviceSlug);
        setService(svc);
      } else if (typeParam && TYPE_TO_ORDER_TYPE[typeParam]) {
        const targetOrderType = TYPE_TO_ORDER_TYPE[typeParam];
        const all = await getServices();
        const matched = all.find(s => s.orderType === targetOrderType);
        setService(matched || all[0] || null);
      } else {
        // Fallback: load first service so page isn't blank
        const all = await getServices();
        if (all.length) setService(all[0]);
      }
      setLoading(false);
    };
    load();
  }, [serviceSlug, typeParam]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
      </div>
    );
  }

  if (submitted && service) {
    return <SuccessState serviceSlug={service.slug} />;
  }

  const accentBg = service?.accentColor || '#005f5f';
  const orderType = service?.orderType || 'browse-and-order';

  const subtitleMap: Record<string, string> = {
    'browse-and-order':     'Browse & Order',
    'send-file-and-process':'Send File & Process',
    'describe-and-request': 'Describe & Request',
    informational:          'Inquiry',
  };

  return (
    <div className="w-full bg-neutral-50">
      {/* Header */}
      <div className="text-white py-12 md:py-16" style={{ backgroundColor: accentBg }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Link to={service ? ROUTES.SERVICE(service.slug) : ROUTES.HOME}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-medium mb-2">
            {service?.title || 'Order Request'}
          </h1>
          <p className="text-lg text-white/80">{subtitleMap[orderType]}</p>
        </div>
      </div>

      {/* Form area */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {service && orderType === 'browse-and-order' && (
          <BrowseOrderForm service={service} productTitle={productTitle} onSuccess={() => setSubmitted(true)} />
        )}
        {service && orderType === 'send-file-and-process' && (
          <SendFileForm service={service} onSuccess={() => setSubmitted(true)} />
        )}
        {service && orderType === 'describe-and-request' && (
          <DescribeRequestForm service={service} onSuccess={() => setSubmitted(true)} />
        )}
        {(!service || orderType === 'informational') && (
          <div className="text-center py-16 text-neutral-500">
            <p>Please use the contact page for inquiries about this service.</p>
            <Link to={ROUTES.CONTACT} className="mt-4 inline-block text-brand hover:underline">Go to Contact</Link>
          </div>
        )}
      </div>
    </div>
  );
};
