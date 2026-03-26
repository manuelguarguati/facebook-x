"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { SchedulerForm } from '@/features/scheduler/components/SchedulerForm';
import { ScheduledList } from '@/features/scheduler/components/ScheduledList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScheduleContent({ posts, pages }: { posts: any[]; pages: any[] }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
          {t('scheduler.title')}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t('scheduler.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScheduledList posts={posts} />
        </div>
        <div>
          <SchedulerForm pages={pages} />
        </div>
      </div>
    </div>
  );
}
