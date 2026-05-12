import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ContactFormEmbedData } from '../../domain/types';

interface Props { data: ContactFormEmbedData; lang: 'en' | 'he'; }

export const ContactFormEmbedBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe   = lang === 'he';
  const heading = isHe && data.heading_he ? data.heading_he : data.heading_en;
  const target  = data.form_type === 'quote' ? '/quote' : '/contact';
  const btnText = data.form_type === 'quote'
    ? (isHe ? 'לבקש הצעת מחיר' : 'Request a Quote')
    : (isHe ? 'ליצור קשר' : 'Contact Us');

  return (
    <section className="w-full py-16 px-6 md:px-12"
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-6">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        <Link to={target}
              className="self-center inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-brand text-white hover:bg-brand-hover transition-colors">
          {btnText} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};
