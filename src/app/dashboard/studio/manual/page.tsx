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
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <PenTool className="text-blue-500" /> Estudio Manual
        </h1>
        <p className="text-neutral-400">
          Crea publicaciones manualmente y prográmalas en tus páginas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-neutral-950 border-white/5">
            <CardHeader className="pb-3 text-white">
              <CardTitle className="text-sm">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 font-medium block mb-2 uppercase">Publicar en</label>
                <select 
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
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

        <div className="md:col-span-2">
          <Card className="bg-neutral-950 border-white/5 h-full flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4 text-white">
              <CardTitle className="text-lg">Redacta tu Contenido</CardTitle>
              <CardDescription className="text-neutral-500">Escribe exactamente lo que quieres publicar.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-[400px]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Empieza a escribir aquí..."
                className="flex-1 w-full bg-transparent p-6 text-neutral-200 placeholder:text-neutral-700 outline-none resize-none leading-relaxed text-lg scrollbar-thin scrollbar-thumb-white/10"
              />
              
              <div className="p-4 border-t border-white/5 bg-black/20 flex gap-3 justify-end">
                <Button 
                  onClick={handleSchedule}
                  disabled={!content || !selectedPageId || scheduling}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  {scheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
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
