"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TopbarProps {
  user: any;
  onOpenSidebar: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Topbar({ user, onOpenSidebar }: { user: any; onOpenSidebar: () => void }) {
  // Extract initial for avatar
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "US";

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-white/5 bg-neutral-950/50 px-3 sm:px-6 lg:px-8 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onOpenSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <h1 className="text-lg font-semibold text-neutral-50 hidden md:block">
          Workspace
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 py-1 pl-1 pr-3 sm:pr-4">
          <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-blue-600 font-semibold text-[10px] sm:text-xs text-white">
            {initials}
          </div>
          <span className="text-xs sm:text-sm font-medium text-neutral-300 max-w-[80px] truncate sm:max-w-[200px]">
            {user?.email || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
