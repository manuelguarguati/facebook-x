"use client";

import { useState } from 'react';
import { generateIdea } from '../actions';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';

export function AiGenerator() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateIdea(formData);
      if (res.success) setResult(res.content);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-white/5">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">{t('generator.title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t('generator.label')}</label>
          <textarea 
            name="topic" 
            required 
            rows={3}
            className="w-full border border-neutral-300 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-neutral-950 dark:text-white"
            placeholder={t('generator.placeholder')}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? t('generator.button_loading') : t('generator.button_idle')}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">{t('generator.result_title')}</h4>
          <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
