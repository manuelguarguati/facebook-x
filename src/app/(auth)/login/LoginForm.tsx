"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { signInAction, signInWithGoogleAction } from '@/features/auth/actions';
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-300 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-900">
            {t('auth.or_continue_with') || 'O continúa con'}
          </span>
        </div>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={async () => {
          await signInWithGoogleAction();
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t('auth.sign_in_with_google') || 'Iniciar sesión con Google'}
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
