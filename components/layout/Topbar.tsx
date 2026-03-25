"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TopbarProps {
  user: any;
  onOpenSidebar: () => void;
}

export function Topbar({ user, onOpenSidebar }: TopbarProps) {
  // Extract initial for avatar
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/5 bg-neutral-950/50 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={onOpenSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 hidden sm:block">
          Workspace
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 py-1.5 pl-1.5 pr-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-semibold text-xs text-white">
            {initials}
          </div>
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 max-w-[120px] truncate sm:max-w-[200px]">
            {user?.email || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
