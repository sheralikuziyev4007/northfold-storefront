import type { Metadata } from 'next';
import { JournalIndex } from '@/components/journal/journal-index';
import { ARTICLES } from '@/content/journal';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'How Northfold clothes are made, and how to keep them going for years.',
  alternates: { canonical: '/journal' },
};

export default function JournalPage() {
  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-10 px-5 pt-10 pb-24 lg:px-8 lg:pt-12">
      <JournalIndex articles={ARTICLES} />
    </div>
  );
}
