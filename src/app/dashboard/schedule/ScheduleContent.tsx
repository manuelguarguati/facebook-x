"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { SchedulerForm } from '@/features/scheduler/components/SchedulerForm';
import { ScheduledList } from '@/features/scheduler/components/ScheduledList';
import { CalendarView } from '@/features/scheduler/components/CalendarView';
import { useState } from 'react';
import { LayoutGrid, Calendar as CalendarIcon, List } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScheduleContent({ posts, pages }: { posts: any[]; pages: any[] }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
            {t('scheduler.title')}
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            {t('scheduler.subtitle')}
          </p>
        </div>
        
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border dark:border-white/5">
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'calendar' ? 'bg-white dark:bg-neutral-700 text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Calendario
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-white dark:bg-neutral-700 text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Lista
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          {viewMode === 'calendar' ? (
            <CalendarView posts={posts} />
          ) : (
            <ScheduledList posts={posts} />
          )}
        </div>
        <div className="order-1 lg:order-2">
          <SchedulerForm pages={pages} />
        </div>
      </div>
    </div>
  );
}
