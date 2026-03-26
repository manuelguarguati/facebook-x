'use client';

import { useState } from 'react';
import { connectPage } from '@/features/scheduler/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

import { useTranslation } from '@/src/lib/i18n/LanguageContext';

export function ConnectPageForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await connectPage(formData);
      (e.target as HTMLFormElement).reset();
      alert(t('pages.success_alert'));
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.connect_title')}</CardTitle>
        <CardDescription>
          {t('pages.connect_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageName">{t('pages.name_label')}</Label>
            <Input id="pageName" name="pageName" placeholder={t('pages.name_placeholder')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebookPageId">{t('pages.id_label')}</Label>
            <Input id="facebookPageId" name="facebookPageId" placeholder={t('pages.id_placeholder')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">{t('pages.token_label')}</Label>
            <Input id="accessToken" name="accessToken" type="password" placeholder={t('pages.token_placeholder')} required />
            <p className="text-xs text-neutral-500">
              {t('pages.token_help')}
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('pages.button_loading') : t('pages.button_idle')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
