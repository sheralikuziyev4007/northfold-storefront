import Link from 'next/link';
import type { Article } from '@/content/journal';
import { cn } from '@/lib/utils';

export function ArticleCover({ article, className }: { article: Article; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('block rounded', className)}
      style={{ background: article.tone }}
    />
  );
}

export function ArticleCard({ article, size = 'md' }: { article: Article; size?: 'md' | 'lg' }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group flex flex-col gap-3 no-underline">
      <ArticleCover article={article} className={size === 'lg' ? 'aspect-video' : 'aspect-[4/3]'} />
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
