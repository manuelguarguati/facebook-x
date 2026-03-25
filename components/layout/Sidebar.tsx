"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Newspaper, Calendar, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/news",
      label: "Content Studio",
      icon: Newspaper,
      active: pathname?.includes("/dashboard/news"),
    },
    {
      href: "/dashboard/schedule",
      label: "Scheduler",
      icon: Calendar,
      active: pathname?.includes("/dashboard/schedule"),
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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-neutral-950 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-neutral-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">TECHUS</h2>
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

        {/* Footer / Logout */}
        <div className="p-4 border-t border-neutral-900 mt-auto">
          <form action="/api/auth/signout" method="post">
            <button 
              type="submit" 
              className="w-full text-left px-4 py-3 text-sm font-medium text-neutral-400 rounded-lg hover:bg-neutral-900 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
