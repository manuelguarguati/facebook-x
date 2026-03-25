"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { signInAction } from '@/features/auth/actions';
import Link from 'next/link';

export function LoginForm({ error, message }: { error?: string; message?: string }) {
  const { t } = useTranslation();

  return (
    <form action={signInAction} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email_label')}</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password_label')}</Label>
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-500">
              {/* Add forgotten password to translations if needed */}
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-red-400">
          {message}
        </div>
      )}

      <Button type="submit" className="w-full">
        {t('auth.sign_in_button')}
      </Button>
      
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        {t('auth.dont_have_account')} {' '}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
          {/* Extract sign up text if needed, but the key usually covers the whole phrase */}
          Sign up
        </Link>
      </p>
    </form>
  );
}
