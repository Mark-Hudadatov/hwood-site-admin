/**
 * CONTACT PAGE - INDUSTRIAL STANDARD
 * ===================================
 * Production inquiries and support
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { getCompanyInfo } from '../services/data/dataService';
import { CompanyInfo } from '../domain/types';

export const ContactPage: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const info = await getCompanyInfo();
      setCompanyInfo(info);
    };
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    { icon: MapPin, label: 'Location', value: companyInfo?.address || '' },
    { icon: Phone, label: 'Phone', value: companyInfo?.phone || '' },
    { icon: Mail, label: 'Email', value: companyInfo?.email || '' },
    { icon: Clock, label: 'Hours', value: 'Sun-Thu: 08:00 – 17:00' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-brand text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h1 className="text-display-sm md:text-display mb-4">
            Contact
          </h1>
          <p className="text-body-lg text-white/70 max-w-2xl">
            Production inquiries and project consultation.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-h2 text-neutral-900 mb-8">Location & Hours</h2>
              
              <div className="space-y-6 mb-12">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="text-meta text-neutral-500 mb-1">{item.label}</div>
                      <div className="text-body text-neutral-900">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Google Map */}
              <div className="rounded-xl overflow-hidden h-64">
                <iframe
                  title="HWOOD Location"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent('המסגר 20, נתניה, ישראל')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-h2 text-neutral-900 mb-8">Send Inquiry</h2>
              
              {submitted ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center">
                  <div className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-brand" />
                  </div>
                  <h3 className="text-h2 text-neutral-900 mb-2">Inquiry Sent</h3>
                  <p className="text-body text-neutral-600">
                    We will respond within 1-2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-meta text-neutral-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-meta text-neutral-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-meta text-neutral-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-meta text-neutral-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-meta text-neutral-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Describe your project requirements"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
