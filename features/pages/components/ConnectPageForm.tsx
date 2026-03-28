'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { ManualConnectForm } from './ManualConnectForm';
import { Settings, Globe } from 'lucide-react';

export function ConnectPageForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'oauth' | 'manual'>('oauth');
  const supabase = createClient();

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'pages_show_list, pages_read_engagement, pages_manage_posts',
          redirectTo: `${window.location.origin}/auth/callback?sync=true&next=/dashboard/pages`
        }
      });
      if (error) {
        throw error;
      }
      // El redireccionamiento ocurre automáticamente si no hay error
    } catch (error: any) {
      alert(error.message || 'Error al conectar con Facebook');
      setLoading(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{t('pages.connect_title')}</CardTitle>
          <div className="flex p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <button
              onClick={() => setMode('oauth')}
              title={t('pages.mode_oauth_title')}
              className={`p-1.5 rounded-md transition-all ${mode === 'oauth' ? 'bg-white dark:bg-neutral-700 shadow-sm text-blue-600' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Globe className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMode('manual')}
              title={t('pages.mode_manual_title')}
              className={`p-1.5 rounded-md transition-all ${mode === 'manual' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 hover:text-neutral-900'}`}
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
        <CardDescription className="text-sm">
          {mode === 'oauth'
            ? (t('pages.connect_description_oauth'))
            : (t('pages.manual_description'))
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mode === 'oauth' ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full h-11 bg-[#1877F2] hover:bg-[#166fe5] text-white border-none shadow-md flex items-center justify-center gap-3 font-semibold rounded-xl"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {loading ? t('pages.button_loading') : t('pages.sync_button_idle')}
            </Button>

            <p className="mt-4 text-[11px] text-neutral-500 text-center leading-relaxed">
              {t('pages.oauth_disclaimer')}
            </p>
          </div>
        ) : (
          <ManualConnectForm />
        )}
      </CardContent>
    </Card>
  );
}
