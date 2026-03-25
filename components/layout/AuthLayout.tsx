import React from "react";
import { LayoutContainer } from "@/components/ui/LayoutContainer";
import { Card } from "@/components/ui/Card";
import { BackgroundGlows } from "@/components/ui/BackgroundGlows";

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 p-4 transition-colors duration-500">
      <BackgroundGlows />
      
      <LayoutContainer className="relative z-10 flex w-full items-center justify-center">
        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              TECHUS
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-blue-400/80 font-semibold">
              AI Social Media Assistant
            </p>
          </div>
          
          <Card className="w-full p-6 sm:p-10 shadow-2xl bg-neutral-900/40 backdrop-blur-2xl border-white/5 ring-1 ring-white/10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h2>
              <p className="text-sm text-neutral-400 font-light">{subtitle}</p>
            </div>
            {children}
          </Card>
        </div>
      </LayoutContainer>
    </div>
  );
}
