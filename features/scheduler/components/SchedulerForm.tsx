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
  const [publishNow, setPublishNow] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('publishNow', String(publishNow));
    
    try {
      const result = await schedulePost(formData);
      
      if (result && !result.success) {
        // Mostrar error amigable de Facebook
        alert(result.error || 'Error al procesar la publicación.');
        return;
      }

      (e.target as HTMLFormElement).reset();
      setPublishNow(false);
      alert(t('scheduler.success_alert') || '¡Acción realizada con éxito!');
    } catch (error: any) {
      console.error('Frontend Error:', error);
      alert('Hubo un error de conexión con el servidor. Inténtalo de nuevo.');
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
        
        <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
          <input 
            type="checkbox" 
            id="publishNow"
            checked={publishNow}
            onChange={(e) => setPublishNow(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="publishNow" className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer select-none">
            {t('scheduler.publish_now') || 'Subir ahora mismo a Facebook'}
          </label>
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
          </div>
          
          {!publishNow && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
               <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('scheduler.date_label')}</label>
               <input 
                 type="datetime-local" 
                 name="scheduledAt" 
                 required={!publishNow}
                 className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white" 
               />
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || pages.length === 0}
          className={`w-full ${publishNow ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {loading ? t('scheduler.button_loading') : (publishNow ? (t('scheduler.button_publish') || 'Publicar Ahora') : t('scheduler.button_idle'))}
        </Button>
      </form>
    </div>
  );
}
