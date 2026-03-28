"use client";

import { useState } from 'react';
import { generateIdea } from '../actions';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { CalendarClock, CheckCircle2, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { schedulePost } from '../../scheduler/actions';
import { ManagedPage } from '@/repositories/page.repository';

interface AiGeneratorProps {
  pages?: ManagedPage[];
}

export function AiGenerator({ pages = [] }: AiGeneratorProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || '');
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateIdea(formData);
      if (res.success && res.content) {
        setResult(res.content);
        setPublished(false);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPublish = async () => {
    if (!result || !selectedPageId) return;
    
    setPublishing(true);
    const formData = new FormData();
    formData.append('content', result);
    formData.append('pageId', selectedPageId);
    formData.append('publishNow', 'true');

    try {
      const res = await schedulePost(formData);
      if (res.success) {
        setPublished(true);
        setTimeout(() => setPublished(false), 5000);
      } else {
        alert(res.error);
      }
    } catch (error: any) {
      alert(error.message || 'Error al publicar');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-white/5">
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3 sm:mb-4">{t('generator.title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('generator.label')}</label>
          <textarea 
            name="topic" 
            required 
            rows={3}
            className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white"
            placeholder={t('generator.placeholder')}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 text-sm h-10"
        >
          {loading ? t('generator.button_loading') : t('generator.button_idle')}
        </button>
      </form>

      {result && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              {t('generator.result_title')}
            </h4>
            {published && (
              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full animate-bounce">
                ¡Publicado!
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-400 whitespace-pre-wrap leading-relaxed">
            {result}
          </p>
          
          <div className="space-y-3 pt-2">
            {pages.length > 0 && (
              <select
                value={selectedPageId}
                onChange={(e) => setSelectedPageId(e.target.value)}
                className="w-full bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900/50 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {pages.map(page => (
                  <option key={page.id} value={page.id}>{page.page_name}</option>
                ))}
              </select>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleDirectPublish}
                disabled={publishing || !selectedPageId}
                className="flex-[2] inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Publicar de una vez
              </button>
              
              <Link 
                href={`/dashboard/schedule?content=${encodeURIComponent(result)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 border border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98]"
              >
                <CalendarClock className="h-4 w-4" />
                Programar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
