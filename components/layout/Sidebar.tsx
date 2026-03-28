"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, X, Settings, Wand2, PenTool, TrendingUp, Image as ImageIcon, Sparkles } from 'lucide-react';
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
      href: "/dashboard/studio/ai",
      label: t('dashboard.sidebar.studio_ai'),
      icon: Wand2,
      active: pathname?.includes("/dashboard/studio/ai"),
    },
    {
      href: "/dashboard/studio/manual",
      label: t('dashboard.sidebar.studio_manual'),
      icon: PenTool,
      active: pathname?.includes("/dashboard/studio/manual"),
    },
    {
      href: "/dashboard/studio/imagenes",
      label: t('dashboard.sidebar.studio_images'),
      icon: ImageIcon,
      active: pathname?.includes("/dashboard/studio/imagenes"),
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
    {
      href: "/dashboard/growth-studio",
      label: t('dashboard.sidebar.growth'),
      icon: TrendingUp,
      active: pathname?.includes("/dashboard/growth-studio"),
    },
  ];

  return (
    <>
      {/* Mobile backdrop with better blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-black text-white transition-all duration-500 ease-in-out lg:static lg:translate-x-0 border-r border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Elite Branding Header */}
        <div className="flex items-center justify-between p-8 pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-white to-neutral-500 bg-clip-text text-transparent">
                TECHUS <span className="text-blue-500 italic">ELITE</span>
              </h1>
            </div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold mt-1">Creator Engine</p>
          </div>
          <button 
            className="lg:hidden text-neutral-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Premium Navigation */}
        <nav className="flex-1 space-y-2 px-4 mt-8">
          {routes.map((route) => {
            const isActive = route.active;
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group relative flex items-center rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300",
                  isActive 
                    ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]" 
                    : "text-neutral-500 hover:bg-white/[0.03] hover:text-neutral-200"
                )}
              >
                {/* Active Glow Accent */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]" />
                )}
                
                <route.icon className={cn(
                  "mr-3 h-5 w-5 transition-all duration-300", 
                  isActive ? "text-blue-500 scale-110" : "text-neutral-600 group-hover:text-neutral-300 group-hover:translateX(2px)"
                )} />
                {route.label}
                
                {isActive && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(37,99,235,1)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Specialized Modules / Footer Area */}
        <div className="mt-auto flex flex-col gap-4 p-4 border-t border-white/5 bg-white/[0.01]">
          <div className="px-4">
             <LanguageSwitcher />
          </div>

          <form action={signOutAction}>
            <button 
              type="submit" 
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300"
            >
              <div className="p-1 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                <X className="w-4 h-4" />
              </div>
              {t('dashboard.sidebar.sign_out')}
            </button>
          </form>
          
          <div className="px-4 py-2">
            <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-black p-4 border border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Plan Actual</span>
                <span className="text-xs text-white font-black italic">PRO ACCESS</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
