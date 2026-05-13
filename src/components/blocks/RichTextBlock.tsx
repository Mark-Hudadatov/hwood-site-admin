import React from 'react';
import type { RichTextData } from '../../domain/types';
import { Container } from '../ui/Container';

const MAX_W = { narrow: 'max-w-xl', normal: 'max-w-3xl', wide: 'max-w-5xl', full: 'max-w-none' };
const PAD   = { tight: 'py-8', normal: 'py-14', spacious: 'py-24' };

function renderMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,   '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^- (.+)$/gm,   '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n\n/g,         '</p><p class="mb-4">')
    .replace(/^(?!<[h|l])(.+)$/gm, (m) => m ? m : '');
}

interface Props { data: RichTextData; lang: 'en' | 'he'; }

export const RichTextBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe    = lang === 'he';
  const content = isHe && data.content_he ? data.content_he : data.content_en;

  return (
    <section className={`w-full ${PAD[data.padding] ?? PAD.normal}`}
             style={{ background: data.bg_color, color: data.text_color }}
             dir={isHe ? 'rtl' : 'ltr'}>
      <Container className={`${MAX_W[data.max_width] ?? MAX_W.normal} prose prose-neutral`}
           dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${renderMd(content)}</p>` }} />
    </section>
  );
};
