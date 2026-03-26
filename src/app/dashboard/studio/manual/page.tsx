"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PenTool, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPagesAction, saveScheduledPostAction } from '@/features/studio/ai-studio.actions';
import { ManagedPage } from '@/repositories/page.repository';

export default function ManualStudioPage() {
  const [content, setContent] = useState('');
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [scheduling, setScheduling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPages = async () => {
      const result = await getPagesAction();
      if (result.success && result.pages) {
        setPages(result.pages);
        if (result.pages.length > 0) {
          setSelectedPageId(result.pages[0].id);
        }
      }
    };
    fetchPages();
  }, []);

  const handleSchedule = async () => {
    if (!content || !selectedPageId) {
      if (!selectedPageId) alert("Por favor, selecciona una página primero.");
      return;
    }
    
    setScheduling(true);
    const result = await saveScheduledPostAction({
      page_id: selectedPageId,
      content: content,
      scheduled_for: new Date(Date.now() + 3600000).toISOString() // Default 1 hour from now
    });

    if (result.success) {
      router.push('/dashboard/schedule');
    } else {
      alert(result.error || "Error al enviar al programador");
    }
    setScheduling(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <PenTool className="text-blue-500 h-6 w-6 sm:h-8 sm:w-8" /> Estudio Manual
        </h1>
        <p className="text-sm sm:text-base text-neutral-400">
          Crea publicaciones manualmente y prográmalas en tus páginas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-neutral-950 border-white/5">
            <CardHeader className="p-4 sm:p-6 pb-3 text-white">
              <CardTitle className="text-sm">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-[10px] text-neutral-500 font-medium block mb-2 uppercase">Publicar en</label>
                <select 
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white outline-none focus:border-blue-500 transition-all font-medium"
                  disabled={pages.length === 0}
                >
                  {pages.length === 0 ? (
                    <option value="">No hay páginas conectadas</option>
                  ) : (
                    pages.map(page => (
                      <option key={page.id} value={page.id}>{page.page_name}</option>
                    ))
                  )}
                </select>
                {pages.length === 0 && (
                  <p className="text-[10px] text-amber-500 mt-1">⚠️ Conecta una página en la sección Páginas.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-neutral-950 border-white/5 h-full flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/5 p-4 sm:p-6 pb-4 text-white">
              <CardTitle className="text-base sm:text-lg">Redacta tu Contenido</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-neutral-500">Escribe exactamente lo que quieres publicar.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-[300px] sm:min-h-[400px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Empieza a escribir aquí..."
                className="flex-1 w-full bg-transparent p-4 sm:p-6 text-sm sm:text-lg text-neutral-200 placeholder:text-neutral-700 outline-none resize-none leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
              />
              
              <div className="p-3 sm:p-4 border-t border-white/5 bg-black/20 flex gap-3 justify-end">
                <Button 
                  onClick={handleSchedule}
                  disabled={!content || !selectedPageId || scheduling}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 h-10 px-4 text-sm"
                >
                  {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {scheduling ? "Enviando..." : "Enviar al Programador"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
