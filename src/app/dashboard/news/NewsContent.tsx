"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { NewsList } from '@/features/news/components/NewsList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NewsContent({ newsItems }: { newsItems: any[] }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          {t('news.title')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t('news.subtitle')}
        </p>
      </div>
      
      <NewsList news={newsItems} />
    </div>
  );
}
