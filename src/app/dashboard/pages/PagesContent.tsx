"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { ConnectPageForm } from '@/features/pages/components/ConnectPageForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FacebookSyncButton } from '@/features/pages/components/FacebookSyncButton';
import { RefreshCw, Trash2, Users, Heart, AlertCircle } from 'lucide-react';
import { deletePage } from '@/features/scheduler/actions';
import { refreshSinglePageStats } from '@/features/pages/actions';
import { useSearchParams } from 'next/navigation';

import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export function PagesContent({ pages }: { pages: any[] }) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
            {t('pages.title')}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t('pages.subtitle')}
          </p>
        </div>
        <FacebookSyncButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('pages.list_title')}</CardTitle>
              <CardDescription>
                {t('pages.list_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {pages.map((page) => (
                  <div key={page.id} className="py-6 flex items-center justify-between group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{page.page_name}</h4>
                        <Badge variant="secondary" className="text-[10px] uppercase py-0 px-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none">
                          {t('pages.active')}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">ID: {page.facebook_page_id}</p>
                      
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{t('pages.followers') || 'Followers'}</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{page.followers_count?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{t('pages.fans') || 'Fans'}</p>
                                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{page.fans_count?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-neutral-500 hover:text-blue-600"
                            onClick={() => refreshSinglePageStats(page.id, page.facebook_page_id, page.access_token)}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <form action={async () => {
                          await deletePage(page.id);
                        }}>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                    </div>
                  </div>
                ))}
                {pages.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                        <Users className="h-8 w-8 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-500 max-w-[200px] mx-auto">
                      {t('pages.no_pages')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <ConnectPageForm />
        </div>
      </div>
    </div>
  );
}
