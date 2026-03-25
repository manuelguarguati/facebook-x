import React from "react";
import { LayoutContainer } from "@/components/ui/LayoutContainer";
import { Card } from "@/components/ui/Card";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <LayoutContainer className="flex w-full items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-200">
              TECHUS
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              AI Social Media Assistant
            </p>
          </div>
          
          <Card className="w-full p-6 sm:p-8 shadow-xl shadow-neutral-200/50 dark:shadow-none bg-white/70 backdrop-blur-xl dark:bg-neutral-900/70 border-white/20 dark:border-white/10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
            </div>
            {children}
          </Card>
        </div>
      </LayoutContainer>
    </div>
  );
}
