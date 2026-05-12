import React from 'react';
import type { VideoEmbedData } from '../../domain/types';

interface Props { data: VideoEmbedData; lang: 'en' | 'he'; }

export const VideoEmbedBlock: React.FC<Props> = ({ data, lang }) => {
  const isHe    = lang === 'he';
  const heading = isHe && data.heading_he ? data.heading_he : data.heading_en;
  const caption = isHe && data.caption_he ? data.caption_he : data.caption_en;

  const isEmbed = data.video_url?.includes('youtube') || data.video_url?.includes('vimeo');

  return (
    <section className="w-full py-12 px-6 md:px-12" style={{ background: data.bg_color }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-4" dir={isHe ? 'rtl' : 'ltr'}>
        {heading && <h2 className="text-2xl font-bold text-white">{heading}</h2>}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black">
          {data.video_url && isEmbed ? (
            <iframe src={data.video_url} className="w-full h-full" allowFullScreen title={heading} />
          ) : data.video_url ? (
            <video
              src={data.video_url}
              poster={data.poster_image_url || undefined}
              autoPlay={data.autoplay} loop={data.loop} muted={data.autoplay}
              controls={!data.autoplay}
              className="w-full h-full object-cover"
            />
          ) : (
            data.poster_image_url
              ? <img src={data.poster_image_url} alt={heading} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/30 text-sm">No video URL set</div>
          )}
        </div>
        {caption && <p className="text-sm text-white/60 text-center">{caption}</p>}
      </div>
    </section>
  );
};
