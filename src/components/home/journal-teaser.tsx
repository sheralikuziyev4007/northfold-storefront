import { ArticleCard } from '@/components/journal/article-card';
import { SectionHeading } from '@/components/ui/section-heading';
import { ARTICLES } from '@/content/journal';

export function JournalTeaser() {
  const [lead, ...rest] = ARTICLES.slice(0, 3);
  return (
    <section aria-labelledby="home-journal" className="mx-auto max-w-[1360px] px-5 pt-24 lg:px-8">
      <SectionHeading
        id="home-journal"
        title="From the journal"
        action={{ href: '/journal', label: 'Read the journal' }}
      />
      <div className="flex flex-wrap gap-5">
        <div className="flex-[2_1_480px]">{lead ? <ArticleCard article={lead} size="lg" /> : null}</div>
        {rest.map((a) => (
          <div key={a.slug} className="flex-[1_1_280px]">
            <ArticleCard article={a} />
          </div>
        ))}
      </div>
    </section>
  );
}
