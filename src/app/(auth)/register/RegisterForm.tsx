"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { signUpAction } from '@/features/auth/actions';
import Link from 'next/link';

export function RegisterForm({ error }: { error?: string }) {
  const { t } = useTranslation();

  return (
    <form action={signUpAction} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.name_label')}</Label>
          <Input id="name" name="name" type="text" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email_label')}</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password_label')}</Label>
          <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        {t('auth.create_account_button')}
      </Button>
      
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        {t('auth.already_have_account')} {' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}
