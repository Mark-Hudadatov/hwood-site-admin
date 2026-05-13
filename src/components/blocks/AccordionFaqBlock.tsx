import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { AccordionFaqData } from '../../domain/types';
import { Container } from '../ui/Container';

interface Props { data: AccordionFaqData; lang: 'en' | 'he'; }

export const AccordionFaqBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe = lang === 'he';
  const [open, setOpen] = useState<number>(data.default_open_index ?? -1);
  const heading = isHe && data.heading_he ? data.heading_he : data.heading_en;

  return (
    <section className="w-full py-16"
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <Container className="max-w-3xl flex flex-col gap-6">
        {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
        <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
          {(data.items || []).map((item, i) => {
            const q = isHe && item.question_he ? item.question_he : item.question_en;
            const a = isHe && item.answer_he   ? item.answer_he   : item.answer_en;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex justify-between items-center py-4 text-left font-medium gap-4"
                  style={{ color: data.text_color }}
                >
                  <span>{q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <div className="pb-4 leading-relaxed opacity-75 whitespace-pre-line">{a}</div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
