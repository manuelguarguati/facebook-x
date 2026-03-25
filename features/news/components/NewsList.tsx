'use client';

import { useState } from 'react';
import { transformNewsToPost } from '../actions';
import type { NewsItem } from '@/services/news/news.service';

export function NewsList({ news }: { news: NewsItem[] }) {
  const [loadingTitle, setLoadingTitle] = useState<string | null>(null);

  const handleGenerate = async (item: NewsItem) => {
    setLoadingTitle(item.title);
    try {
      const res = await transformNewsToPost(item.title, item.url);
      if (res.success) alert('AI Generated Idea:\n\n' + res.content);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoadingTitle(null);
    }
  };

  if (!news.length) return <div className="p-8 text-center text-neutral-500 bg-white rounded-xl border">No trending news found.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-5 flex-1">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {item.source}
              </span>
              <span className="text-xs text-neutral-400">{new Date(item.publishedAt).toLocaleDateString()}</span>
            </div>
            <h4 className="font-semibold text-neutral-900 leading-snug mb-2 line-clamp-3">{item.title}</h4>
            <a href={item.url} target="_blank" className="text-sm text-blue-500 hover:underline">Read Source →</a>
          </div>
          <div className="p-4 border-t border-neutral-100 bg-neutral-50">
             <button 
               onClick={() => handleGenerate(item)}
               disabled={loadingTitle === item.title}
               className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
             >
               {loadingTitle === item.title ? 'Synthesizing...' : 'Generate AI Post'}
             </button>
          </div>
        </div>
      ))}
    </div>
  );
}
