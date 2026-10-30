'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Image as ImageType } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * Desktop: thumbnail rail plus a main image with hover zoom.
 * Mobile: a swipeable scroll-snap strip with dot controls.
 */
export function ProductGallery({ images, title }: { images: ImageType[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  if (!images.length) {
    return (
      <div
        className="bg-tone-oat aspect-[4/5] rounded"
        role="img"
        aria-label={`${title}, no photo available`}
      />
    );
  }

  const current = images[index] ?? images[0]!;

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile strip */}
      <div className="relative -mx-5 sm:mx-0 lg:hidden">
        <div
          ref={stripRef}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== index) setIndex(i);
          }}
          aria-label={`${title} photos`}
          role="region"
          tabIndex={0}
        >
          {images.map((img, i) => (
            <div key={img.url} className="bg-tone-oat relative aspect-[4/5] w-full flex-none snap-center">
              <Image
                src={img.url}
                alt={img.altText}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 1 ? (
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === index}
                onClick={() => {
                  setIndex(i);
                  stripRef.current?.scrollTo({ left: i * stripRef.current.clientWidth, behavior: 'smooth' });
                }}
                className="grid size-7 place-items-center"
              >
                <span
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'bg-ink w-[18px]' : 'bg-ink/35 w-1.5',
                  )}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop */}
      <div className="hidden gap-3 lg:flex">
        <div className="flex w-[88px] flex-none flex-col gap-2.5" role="group" aria-label="Choose photo">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === index}
              className={cn(
                'bg-tone-oat relative h-[110px] w-[88px] overflow-hidden rounded-[3px] border-2',
                i === index ? 'border-ink' : 'hover:border-line border-transparent',
              )}
            >
              <Image src={img.url} alt="" fill sizes="88px" className="object-cover" />
            </button>
          ))}
        </div>
        <div
          className="bg-tone-oat relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <Image
            src={current.url}
            alt={current.altText}
            fill
            priority
            sizes="(min-width: 1360px) 700px, 55vw"
            className="object-cover transition-transform duration-200"
            style={zoom ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
