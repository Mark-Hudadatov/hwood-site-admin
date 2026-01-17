/**
 * ABOUT PAGE - HWOOD
 * ==================
 * Company information and story
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Factory, Users, Award, Truck } from 'lucide-react';
import { getCompanyInfo } from '../services/data/dataService';

export const AboutPage: React.FC = () => {
  const companyInfo = getCompanyInfo();

  const stats = [
    { icon: Factory, value: '2000+', label: 'sqm Production Area' },
    { icon: Users, value: '50+', label: 'Skilled Professionals' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Truck, value: '1000+', label: 'Projects Delivered' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#005f5f] text-white py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About {companyInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {companyInfo.description}
            </p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[#004d4d] -skew-x-12 origin-top-right opacity-50" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#005f5f]/10 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-[#005f5f]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  HWOOD was founded with a clear mission: to bring industrial-grade carpentry 
                  and CNC production capabilities to construction companies, architects, and 
                  private clients across Israel.
                </p>
                <p>
                  Our state-of-the-art facility combines advanced CNC technology with 
                  traditional craftsmanship, allowing us to deliver precision-built solutions 
                  for projects of any scale.
                </p>
                <p>
                  From modular kitchen systems to custom furniture fronts, every product 
                  that leaves our facility meets the highest standards of quality and durability.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
                alt="HWOOD Production Facility"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Precision', description: 'Every cut, every drill, every finish is executed with millimeter accuracy.' },
              { title: 'Quality', description: 'We use only premium materials and maintain rigorous quality control.' },
              { title: 'Reliability', description: 'On-time delivery and consistent results you can count on.' },
            ].map((value, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#005f5f] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Contact us today for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/quote"
              className="bg-white text-[#005f5f] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
