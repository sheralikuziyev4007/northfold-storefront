import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { CareLabel } from '@/components/ui/care-label';
import { HangDryIcon, NoBleachIcon, WashColdIcon } from '@/components/ui/icons';
import { HERO_PHOTO } from '@/content/photos';

export function Hero() {
  return (
    <section className="mx-auto flex max-w-[1360px] flex-wrap items-stretch gap-8 px-5 pt-8 pb-14 lg:gap-12 lg:px-8 lg:pt-14 lg:pb-[72px]">
      <div className="flex flex-[1_1_480px] flex-col justify-end gap-6 lg:gap-7 lg:pb-6">
        <h1 className="font-wide text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em] sm:text-[clamp(48px,6.4vw,96px)]">
          Clothes built for the long haul.
        </h1>
        <p className="text-muted max-w-[34rem] text-[17px] leading-relaxed sm:text-[19px]">
          Heavyweight cotton, honest seams and colours that age well. Made in small runs, sold without the
          markup.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/collections/all" size="lg">
            Shop new arrivals
          </ButtonLink>
          <ButtonLink href="#collections" size="lg" variant="secondary">
            Browse collections
          </ButtonLink>
        </div>
      </div>

      <div className="bg-tone-sage relative min-h-[420px] flex-[1_1_520px] overflow-hidden rounded lg:min-h-[620px]">
        <Image
          src={HERO_PHOTO.src}
          alt={HERO_PHOTO.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <CareLabel
          tilt
          className="absolute right-5 bottom-6 w-[180px] sm:right-9 sm:bottom-10 sm:w-[230px]"
          innerClassName="flex flex-col gap-2.5 px-3 py-3 text-xs leading-snug sm:px-4 sm:py-4.5 sm:text-[13px]"
        >
          <span className="font-wide text-sm font-extrabold sm:text-[17px]">Northfold</span>
          <span>Heavyweight hoodie</span>
          <span className="text-muted">100% organic cotton, 480 gsm brushed fleece</span>
          <span
            role="img"
            className="border-line-soft hidden gap-2.5 border-t pt-1.5 sm:flex"
            aria-label="Care: wash cold, do not bleach, hang dry"
          >
            <WashColdIcon /> <NoBleachIcon /> <HangDryIcon />
          </span>
          <span className="text-muted">Wash cold. Hang to dry.</span>
        </CareLabel>
      </div>
    </section>
  );
}
