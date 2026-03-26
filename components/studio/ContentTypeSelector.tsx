"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ContentCategory = {
  id: string;
  name: string;
  emoji: string;
  subcategories: string[];
};

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: 'news',
    name: 'Noticias y Tendencias',
    emoji: '📰',
    subcategories: ['Noticia viral del día', 'Opinión sobre tendencia', 'Resumen de noticias tech']
  },
  {
    id: 'business',
    name: 'Negocios y Emprendimiento',
    emoji: '💼',
    subcategories: ['Consejo de negocios', 'Historia de éxito', 'Tip de productividad', 'Motivación empresarial']
  },
  {
    id: 'education',
    name: 'Educativo e Informativo',
    emoji: '🎓',
    subcategories: ['Tutorial paso a paso', 'Dato curioso', 'Mito vs realidad', 'Pregunta reflexiva']
  },
  {
    id: 'entertainment',
    name: 'Entretenimiento',
    emoji: '😂',
    subcategories: ['Meme textual', 'Historia graciosa', 'Pregunta para engagement', 'Encuesta/Poll']
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle y Motivación',
    emoji: '💪',
    subcategories: ['Frase motivacional', 'Rutina diaria', 'Consejo de vida', 'Reflexión personal']
  },
  {
    id: 'sales',
    name: 'Ventas y Promoción',
    emoji: '🛍️',
    subcategories: ['Promoción de producto', 'Testimonio de cliente', 'Oferta especial', 'Lanzamiento de producto']
  },
  {
    id: 'social',
    name: 'Social y Comunidad',
    emoji: '🌍',
    subcategories: ['Causa social', 'Celebración de fecha especial', 'Pregunta a la comunidad', 'Agradecimiento a seguidores']
  }
];

interface ContentTypeSelectorProps {
  onSelect: (subcategory: string) => void;
  selectedSubcategory?: string;
}

export function ContentTypeSelector({ onSelect, selectedSubcategory }: ContentTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const selectedCategory = CONTENT_CATEGORIES.find(cat =>
    cat.subcategories.includes(selectedSubcategory || '')
  );

  return (
    <div className="relative w-full">
      {/* Principal Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-neutral-900 border border-white/10 rounded-xl hover:border-blue-500/50 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {selectedCategory ? selectedCategory.emoji : '✨'}
          </span>
          <div className="text-left">
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              {selectedCategory ? selectedCategory.name : 'Tipo de Contenido'}
            </p>
            <p className={cn(
              "text-sm font-semibold",
              selectedSubcategory ? "text-blue-400" : "text-white"
            )}>
              {selectedSubcategory || 'Selecciona una categoría'}
            </p>
          </div>
        </div>
        <ChevronDown className={cn(
          "w-5 w-5 text-neutral-500 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-neutral-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="max-h-[450px] overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
              {CONTENT_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                      expandedCategory === category.id
                        ? "bg-white/5 text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Subcategories */}
                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    expandedCategory === category.id
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <div className="pl-11 pr-3 py-1 space-y-1">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              onSelect(sub);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "w-full text-left p-2 rounded-md text-sm transition-all flex items-center justify-between group/item",
                              selectedSubcategory === sub
                                ? "bg-blue-600/20 text-blue-400 font-semibold"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                            )}
                          >
                            <span>{sub}</span>
                            {selectedSubcategory === sub && (
                              <Check className="w-4 h-4" />
                            )}
                            <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
