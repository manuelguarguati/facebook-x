"use client";

import React from 'react';
import { useTranslation } from './LanguageContext';
import { Button } from '@/components/ui/Button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
          language === 'es' 
            ? 'bg-blue-600 text-white hover:bg-blue-500' 
            : 'text-neutral-500 hover:text-white'
        }`}
        onClick={() => setLanguage('es')}
      >
        ES
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-3 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
          language === 'en' 
            ? 'bg-blue-600 text-white hover:bg-blue-500' 
            : 'text-neutral-500 hover:text-white'
        }`}
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}
