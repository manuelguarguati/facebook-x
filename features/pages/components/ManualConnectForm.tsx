'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { connectManualPageAction } from '../actions';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ManualConnectForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageId, setPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await connectManualPageAction(pageId, accessToken);
      if (result.success) {
        setSuccess(t('pages.manual_success').replace('{name}', result.name));
        setPageId('');
        setAccessToken('');
      }
    } catch (err: any) {
      setError(err.message || t('pages.manual_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-2">
        <Label htmlFor="pageId">{t('pages.manual_id_label')}</Label>
        <Input
          id="pageId"
          placeholder={t('pages.manual_id_placeholder')}
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          required
          disabled={loading}
          className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        />
        <p className="text-[10px] text-neutral-500">
          {t('pages.manual_id_help')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessToken">{t('pages.manual_token_label')}</Label>
        <Input
          id="accessToken"
          type="password"
          placeholder={t('pages.manual_token_placeholder')}
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
          disabled={loading}
          className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
        />
        <p className="text-[10px] text-neutral-500">
          {t('pages.manual_token_help')}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2 text-green-600 dark:text-green-400 text-xs">
          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900"
      >
        {loading ? t('pages.button_loading') : t('pages.manual_save_button')}
      </Button>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <h4 className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2">
          {t('pages.manual_guide_title')}
        </h4>
        <ul className="space-y-2 text-[11px] text-neutral-500 text-left leading-relaxed">
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <span dangerouslySetInnerHTML={{ __html: t('pages.manual_guide_step1') }} />
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <span dangerouslySetInnerHTML={{ __html: t('pages.manual_guide_step2') }} />
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <span dangerouslySetInnerHTML={{ __html: t('pages.manual_guide_step3') }} />
          </li>
        </ul>
      </div>
    </form>
  );
}
