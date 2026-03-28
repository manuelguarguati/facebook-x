"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';

export interface ScheduledPostProps {
  id: string;
  content: string;
  status: 'pending' | 'published' | 'failed';
  facebook_post_id?: string;
  scheduled_for: string;
}

export function ScheduledList({ posts }: { posts: ScheduledPostProps[] }) {
  const { t } = useTranslation();
  
  if (!posts.length) {
    return (
      <div className="p-8 text-center text-neutral-500 bg-white dark:bg-neutral-900 rounded-xl border dark:border-white/5 shadow-sm">
        {t('scheduler.list_empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-white/5 shadow-sm animate-in fade-in duration-300">
          <p className="text-sm text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                post.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                post.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {post.status === 'pending' ? t('scheduler.status_scheduled') : 
                 post.status === 'published' ? t('scheduler.status_posted') : 'Error'}
              </span>
              {post.facebook_post_id && (
                <span className="text-[10px] text-neutral-500 font-mono">FB Ref: {post.facebook_post_id.slice(0, 15)}...</span>
              )}
            </div>
            
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              {post.scheduled_for ? new Date(post.scheduled_for).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
