import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/content/journal';
import { cn } from '@/lib/utils';

/**
 * Article photo. The article's tone colour fills the box while the photo loads,
 * so the layout never jumps and a failed image still looks intentional.
 */
export function ArticleCover({
  article,
  className,
  sizes,
  priority = false,
}: {
  article: Article;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn('relative block overflow-hidden rounded', className)}
      style={{ background: article.tone }}
    >
      <Image
        src={article.cover.src}
        alt={article.cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </span>
  );
}

export function PhotoCredit({ article, className }: { article: Article; className?: string }) {
  return (
    <p className={cn('text-muted text-[13px]', className)}>
      Photo by{' '}
      <a
        href={article.cover.credit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {article.cover.credit.name}
      </a>{' '}
      on Unsplash
    </p>
  );
}

export function ArticleCard({ article, size = 'md' }: { article: Article; size?: 'md' | 'lg' }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group flex flex-col gap-3 no-underline">
      <ArticleCover
        article={article}
        className={size === 'lg' ? 'aspect-video' : 'aspect-[4/3]'}
        sizes={
          size === 'lg'
            ? '(min-width: 1024px) 50vw, 100vw'
            : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
        }
      />
      <span className="text-muted text-sm">
        {article.topic}, {article.readingMinutes} min read
      </span>
      <span
        className={cn(
          'leading-tight font-bold group-hover:underline group-hover:underline-offset-4',
          size === 'lg' ? 'text-[26px]' : 'text-[21px]',
        )}
      >
        {article.title}
      </span>
    </Link>
  );
}
