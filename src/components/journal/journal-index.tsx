'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TOPICS, type Article, type JournalTopic } from '@/content/journal';
import { cn } from '@/lib/utils';
import { ArticleCard, ArticleCover } from './article-card';

export function JournalIndex({ articles }: { articles: Article[] }) {
  const [topic, setTopic] = useState<JournalTopic | 'All'>('All');
  const [featured, ...rest] = articles;
  const showFeatured = featured && (topic === 'All' || featured.topic === topic);
  const list = topic === 'All' ? rest : articles.filter((a) => a.topic === topic && a !== featured);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-wide text-[44px] leading-[0.95] font-extrabold tracking-[-0.035em] sm:text-[clamp(44px,6vw,88px)]">
            Journal
          </h1>
          <p className="text-muted max-w-[36rem] text-lg leading-normal">
            How our clothes are made, and how to keep them going for years.
          </p>
        </div>
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {(['All', ...TOPICS] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={cn(
                'h-10 rounded-full border-[1.5px] px-4 text-sm font-semibold',
                topic === t ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {showFeatured ? (
        <Link
          href={`/journal/${featured.slug}`}
          className="group bg-paper flex flex-wrap items-center gap-8 overflow-hidden rounded no-underline"
        >
          <ArticleCover
            article={featured}
            className="aspect-[16/10] flex-[1_1_520px] rounded-none"
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority
          />
          <span className="flex flex-[1_1_360px] flex-col gap-3.5 p-8">
            <span className="text-muted text-sm">
              {featured.topic}, {featured.readingMinutes} min read
            </span>
            <span className="font-semiwide text-[28px] leading-tight font-extrabold tracking-[-0.02em] sm:text-[clamp(28px,2.6vw,40px)]">
              {featured.title}
            </span>
            <span className="text-muted text-base leading-relaxed">{featured.excerpt}</span>
            <span className="text-[15px] font-semibold underline underline-offset-4">Read the article</span>
          </span>
        </Link>
      ) : null}

      <ul
        className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-5 gap-y-10"
        aria-live="polite"
      >
        {list.map((a) => (
          <li key={a.slug}>
            <ArticleCard article={a} />
          </li>
        ))}
      </ul>
    </>
  );
}
