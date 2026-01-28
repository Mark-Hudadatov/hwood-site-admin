/**
 * QUOTE PAGE - HWOOD
 * ==================
 * Quote request form
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Upload, Send, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { getProductBySlug, getServices, getCompanyInfo } from '../services/data/dataService';
import { Product, Service, CompanyInfo  } from '../domain/types';

export const QuotePage: React.FC = () => {
  const { productSlug } = useParams();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    serviceType: '',
    projectDescription: '',
    quantity: '',
    deadline: '',
    hasDrawings: false,
    message: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const [allServices, info] = await Promise.all([getServices(), getCompanyInfo()]);
      setServices(allServices);
      setCompanyInfo(info);
      
      if (productSlug) {
        const prod = await getProductBySlug(productSlug);
        if (prod) {
          setProduct(prod);
        }
      }
    };
    loadData();
  }, [productSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote request submitted:', formData);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitted) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-neutral-50">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-medium text-neutral-900 mb-4">
            Quote Request Received!
          </h1>
          <p className="text-neutral-600 mb-8">
            Thank you for your interest in {companyInfo.name}. Our team will review your 
            request and get back to you within 1-2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="bg-brand text-white px-8 py-3 rounded-xl font-medium hover:bg-brand/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link 
              to="/services/modular-cabinet-systems"
              className="border-2 border-brand text-brand px-8 py-3 rounded-xl font-medium hover:bg-brand/5 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-50">
      {/* Header */}
      <div className="bg-brand text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-medium mb-3">
            Request a Quote
          </h1>
          <p className="text-lg text-white/80">
            Tell us about your project and we'll provide a detailed quote.
          </p>
          {product && (
            <div className="mt-6 bg-white/10 rounded-xl p-4 inline-flex items-center gap-4">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <div className="text-sm text-white/70">Requesting quote for:</div>
                <div className="font-medium">{product.title}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm">1</span>
              Contact Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  placeholder="+972-XX-XXX-XXXX"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm">2</span>
              Project Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                >
                  <option value="">Select a service...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none"
                  placeholder="Describe your project requirements, specifications, materials needed..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                    placeholder="e.g., 50 units, 100 sqm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm">3</span>
              Attachments (Optional)
            </h2>
            
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-brand transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2">
                Drop your files here or <span className="text-brand font-medium">browse</span>
              </p>
              <p className="text-sm text-neutral-400">
                Upload drawings, specifications, or reference images (PDF, DWG, JPG, PNG)
              </p>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasDrawings"
                  checked={formData.hasDrawings}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-neutral-300 text-brand focus:ring-brand"
                />
                <span className="text-neutral-700">I have technical drawings ready to share</span>
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-medium text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm">4</span>
              Additional Notes
            </h2>
            
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none resize-none"
              placeholder="Any additional information or questions..."
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/"
              className="px-8 py-4 border-2 border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-4 bg-brand text-white rounded-xl font-medium hover:bg-brand/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Quote Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
