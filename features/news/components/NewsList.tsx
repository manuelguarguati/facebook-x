"use client";

import { useState } from 'react';
import { transformNewsToPost } from '../actions';
import type { NewsItem } from '@/services/news/news.service';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';

export function NewsList({ news }: { news: NewsItem[] }) {
  const { t } = useTranslation();
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null);

  const handleGenerate = async (item: NewsItem) => {
    setLoadingTitle(item.title);
    try {
      const res = await transformNewsToPost(item.title, item.url);
      if (res.success) alert(t('news.alert_title') + res.content);
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setLoadingTitle(null);
    }
  };

  if (!news.length) return <div className="p-8 text-center text-neutral-500 bg-white dark:bg-neutral-900 rounded-xl border dark:border-white/5">{t('news.no_news')}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                {item.source}
              </span>
              <span className="text-xs text-neutral-400">{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 leading-snug mb-2 line-clamp-3">{item.title}</h4>
            <a href={item.url} target="_blank" className="text-sm text-blue-500 hover:underline">{t('news.read_source')}</a>
          </div>
          <div className="p-4 border-t border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/50">
             <button 
               onClick={() => handleGenerate(item)}
               disabled={loadingTitle === item.title}
               className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
             >
               {loadingTitle === item.title ? t('news.button_loading') : t('news.button_idle')}
             </button>
          </div>
        </div>
      ))}
    </div>
  );
}
