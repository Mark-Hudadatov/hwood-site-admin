/**
 * ABOUT PAGE - INDUSTRIAL STANDARD
 * =================================
 * Production capability overview
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Users, Award, Truck } from 'lucide-react';
import { getCompanyInfo } from '../services/data/dataService';
import { CompanyInfo } from '../domain/types';

export const AboutPage: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const info = await getCompanyInfo();
      setCompanyInfo(info);
    };
    loadData();
  }, []);

  const stats = [
    { icon: Factory, value: '2000+', label: 'sqm Production' },
    { icon: Users, value: '50+', label: 'Team Members' },
    { icon: Award, value: '15+', label: 'Years Operating' },
    { icon: Truck, value: '1000+', label: 'Projects Completed' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-brand text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-display-sm md:text-display mb-6">
              {companyInfo?.name || 'HWOOD'}
            </h1>
            <p className="text-body-lg text-white/80 leading-relaxed">
              {companyInfo?.description || 'Industrial carpentry and CNC production facility'}
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-teal-600 -skew-x-12 origin-top-right opacity-30" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-brand/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-brand" />
                </div>
                <div className="text-h1 text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-meta text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Capability Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-h1 text-neutral-900 mb-6">
                Production Capability
              </h2>
              <div className="space-y-4 text-body text-neutral-600 leading-relaxed">
                <p>
                  2000+ sqm production facility equipped with CNC machining centers 
                  for high-volume carpentry production. Serving construction companies, 
                  architects, and manufacturing sectors across Israel.
                </p>
                <p>
                  Production capacity supports projects ranging from modular kitchen 
                  systems to custom furniture components and architectural elements.
                </p>
                <p>
                  Integrated quality control ensures consistent output meeting 
                  specified tolerances and finish requirements.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
                alt="HWOOD Production Facility"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Production Standards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-h1 text-neutral-900 mb-12 text-center">
            Production Standards
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Precision', description: 'CNC machining to ±0.1mm tolerance. Verified measurement protocols.' },
              { title: 'Materials', description: 'Grade-certified materials. Documented sourcing and batch traceability.' },
              { title: 'Delivery', description: 'Production scheduling to meet project timelines. Coordinated logistics.' },
            ].map((value, idx) => (
              <div key={idx} className="bg-neutral-50 rounded-xl p-8">
                <h3 className="text-h2 text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-body text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-h1 mb-6">
            Project Inquiry
          </h2>
          <p className="text-body-lg text-white/70 mb-8">
            Contact for production consultation and project quotation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/quote"
              className="bg-white text-brand px-8 py-3 rounded font-medium hover:bg-neutral-100 transition-colors"
            >
              Request Quote
            </Link>
            <Link 
              to="/contact"
              className="border border-white text-white px-8 py-3 rounded font-medium hover:bg-white/10 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
