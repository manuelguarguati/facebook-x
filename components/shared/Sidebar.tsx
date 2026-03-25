"use client";

import Link from 'next/link';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/src/lib/i18n/LanguageSwitcher';

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <div className="w-64 bg-neutral-900 text-white min-h-screen flex flex-col border-r border-white/5">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tighter">Manuel Asistente IA</h2>
        <p className="text-xs text-blue-400 uppercase tracking-widest mt-1 font-semibold">AI Assistant</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/dashboard" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          {t('dashboard.sidebar.dashboard')}
        </Link>
        <Link href="/dashboard/news" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          {t('dashboard.sidebar.studio')}
        </Link>
        <Link href="/dashboard/schedule" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          {t('dashboard.sidebar.scheduler')}
        </Link>
        <Link href="/dashboard/pages" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          {t('dashboard.sidebar.pages')}
        </Link>
      </nav>
      
      <div className="px-6 py-4">
        <LanguageSwitcher />
      </div>

      <div className="p-4 border-t border-neutral-800">
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
            {t('dashboard.sidebar.sign_out')}
          </button>
        </form>
      </div>
    </div>
  );
}
