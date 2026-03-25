"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Newspaper, Calendar, X, Settings } from 'lucide-react';
import { signOutAction } from '@/features/auth/actions';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { LanguageSwitcher } from '@/src/lib/i18n/LanguageSwitcher';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const routes = [
    {
      href: "/dashboard",
      label: t('dashboard.sidebar.dashboard'),
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/news",
      label: t('dashboard.sidebar.studio'),
      icon: Newspaper,
      active: pathname?.includes("/dashboard/news"),
    },
    {
      href: "/dashboard/schedule",
      label: t('dashboard.sidebar.scheduler'),
      icon: Calendar,
      active: pathname?.includes("/dashboard/schedule"),
    },
    {
      href: "/dashboard/pages",
      label: t('dashboard.sidebar.pages'),
      icon: Settings,
      active: pathname?.includes("/dashboard/pages"),
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-neutral-950 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Manuel Asistente IA</h2>
            <p className="text-xs text-blue-400 uppercase tracking-widest mt-1 font-semibold">AI Assistant</p>
          </div>
          <button 
            className="lg:hidden text-neutral-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 mt-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all",
                route.active 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
              )}
            >
              <route.icon className={cn("mr-3 h-5 w-5", route.active ? "text-blue-500" : "text-neutral-400 group-hover:text-neutral-50")} />
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Language Selection */}
        <div className="px-6 py-4">
           <LanguageSwitcher />
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <form action={signOutAction}>
            <button 
              type="submit" 
              className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-900 hover:text-red-400 transition-colors"
            >
              {t('dashboard.sidebar.sign_out')}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
