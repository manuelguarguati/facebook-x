'use client';

import { useState } from 'react';
import { schedulePost } from '../actions';
import { ManagedPage } from '@/repositories/page.repository';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';

interface SchedulerFormProps {
  pages: ManagedPage[];
}

export function SchedulerForm({ pages }: SchedulerFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await schedulePost(formData);
      (e.target as HTMLFormElement).reset();
      alert(t('scheduler.success_alert'));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-white/5">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">{t('scheduler.form_title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('scheduler.content_label')}</label>
          <textarea 
            name="content" 
            required 
            rows={4}
            className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white"
            placeholder={t('scheduler.content_placeholder')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
             <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('scheduler.page_label')}</label>
             <select 
               name="pageId" 
               required 
               className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white font-medium shadow-none"
             >
               <option value="">{t('scheduler.page_placeholder')}</option>
               {pages.map((page) => (
                 <option key={page.id} value={page.id}>
                   {page.page_name} ({page.facebook_page_id})
                 </option>
               ))}
             </select>
             {pages.length === 0 && (
               <p className="text-xs text-red-500 mt-1">
                 {t('scheduler.no_pages_error')}
               </p>
             )}
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('scheduler.date_label')}</label>
             <input 
               type="datetime-local" 
               name="scheduledAt" 
               required 
               className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white" 
             />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={loading || pages.length === 0}
          className="w-full"
        >
          {loading ? t('scheduler.button_loading') : t('scheduler.button_idle')}
        </Button>
      </form>
    </div>
  );
}
