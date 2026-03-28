"use client";

import React, { useState } from 'react';
import { ContentTypeSelector } from '@/components/studio/ContentTypeSelector';
import { generatePost, generateHashtags, generateVideoIdeas, getPagesAction, saveScheduledPostAction } from '@/features/studio/ai-studio.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Hash, Video, Copy, Send, Loader2, Wand2, CheckCircle2, CalendarClock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
// Unused import removed
import { ManagedPage } from '@/repositories/page.repository';
import { schedulePost } from '@/features/scheduler/actions';

export default function AiStudioPage() {
  const [loading, setLoading] = useState(false);
  const [generatingHashtags, setGeneratingHashtags] = useState(false);
  const [generatingVideoIdeas, setGeneratingVideoIdeas] = useState(false);
  
  const [contentType, setContentType] = useState<string>('');
  const [details, setDetails] = useState('');
  const [tone, setTone] = useState('viral');
  const [platform, setPlatform] = useState('Facebook');
  const [generatedContent, setGeneratedContent] = useState('');
  
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [scheduling, setScheduling] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

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

    // Handle incoming news/context items
    const incomingType = searchParams.get('type');
    const incomingDetails = searchParams.get('details');
    if (incomingType) setContentType(incomingType);
    if (incomingDetails) setDetails(incomingDetails);
  }, [searchParams]);

  // Prompt details placeholder based on category
  const getDetailsPlaceholder = () => {
    if (contentType.includes('Promoción')) return "¿De qué producto/servicio?";
    if (contentType.includes('Noticia')) return "¿Qué noticia o tema quieres tratar?";
    if (contentType.includes('Tutorial')) return "¿Qué quieres enseñar?";
    return "Agrega detalles específicos (opcional)...";
  };

  const handleGenerate = async () => {
    if (!contentType) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('contentType', contentType);
    formData.append('details', details);
    formData.append('tone', tone);
    formData.append('platform', platform);

    const result = await generatePost(formData);
    if (result.success && result.content) {
      setGeneratedContent(result.content);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleGenerateHashtags = async () => {
    if (!generatedContent) return;
    setGeneratingHashtags(true);
    const result = await generateHashtags(generatedContent);
    if (result.success && result.hashtags) {
      setGeneratedContent(prev => prev + "\n\n" + result.hashtags);
    }
    setGeneratingHashtags(false);
  };

  const handleGenerateVideoIdeas = async () => {
    if (!generatedContent) return;
    setGeneratingVideoIdeas(true);
    const result = await generateVideoIdeas(generatedContent);
    if (result.success && result.ideas) {
      setGeneratedContent(prev => prev + "\n\n--- IDEAS DE VIDEO ---\n" + result.ideas);
    }
    setGeneratingVideoIdeas(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    // Simple notification
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleSendToScheduler = async () => {
    if (!generatedContent || !selectedPageId) {
      if (!selectedPageId) alert("Por favor, selecciona una página primero.");
      return;
    }
    
    setScheduling(true);
    const result = await saveScheduledPostAction({
      page_id: selectedPageId,
      content: generatedContent,
      scheduled_for: new Date(Date.now() + 3600000).toISOString() // Default 1 hour from now
    });

    if (result.success) {
      router.push('/dashboard/schedule');
    } else {
      alert(result.error || "Error al enviar al programador");
    }
    setScheduling(false);
  };

  const handleDirectPublish = async () => {
    if (!generatedContent || !selectedPageId) return;
    
    setScheduling(true);
    const formData = new FormData();
    formData.append('content', generatedContent);
    formData.append('pageId', selectedPageId);
    formData.append('publishNow', 'true');

    try {
      const res = await schedulePost(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(res.error || "Error al publicar");
      }
    } catch (error: any) {
      alert(error.message || "Error al publicar");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="text-blue-500" /> Estudio de Contenido IA
        </h1>
        <p className="text-neutral-400">
          Crea publicaciones virales y profesionales en segundos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Configuration Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-neutral-950 border-white/5">
            <CardHeader className="pb-3 text-white">
              <CardTitle className="text-sm">1. Tipo de Contenido</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentTypeSelector 
                onSelect={(sub) => setContentType(sub)} 
                selectedSubcategory={contentType} 
              />
            </CardContent>
          </Card>

          {contentType && (
            <Card className="bg-neutral-950 border-white/5 animate-in slide-in-from-top-2 duration-300">
              <CardHeader className="pb-3 text-white">
                <CardTitle className="text-sm">2. Detalles específicos</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={getDetailsPlaceholder()}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:border-blue-500 outline-none transition-all min-h-[100px] resize-none"
                />
              </CardContent>
            </Card>
          )}

          <Card className="bg-neutral-950 border-white/5">
            <CardHeader className="pb-3 text-white">
              <CardTitle className="text-sm">3. Estilo y Red</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-neutral-500 font-medium block mb-2 uppercase">Tono</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
                >
                  <option value="viral">Viral / Trendy</option>
                  <option value="professional">Profesional</option>
                  <option value="casual">Casual / Divertido</option>
                  <option value="persuasive">Persuasivo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500 font-medium block mb-2 uppercase">Plataforma</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok / Reels</option>
                </select>
              </div>

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

          <Button 
            onClick={handleGenerate}
            disabled={loading || !contentType}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl transition-all flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {loading ? "Generando Magia..." : "Generar con IA"}
          </Button>
        </div>

        {/* Editor Column */}
        <div className="md:col-span-2">
          <Card className="bg-neutral-950 border-white/5 h-full flex flex-col">
            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between text-white">
              <div>
                <CardTitle className="text-lg">Editor de Contenido IA</CardTitle>
                <CardDescription className="text-neutral-500">Refina y personaliza el resultado generado.</CardDescription>
              </div>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="text-neutral-400 border-white/10 hover:bg-white/5">
                    <Copy className="w-4 h-4 mr-1" /> Copiar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col min-h-[400px]">
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder="El contenido generado aparecerá aquí..."
                className="flex-1 w-full bg-transparent p-6 text-neutral-200 placeholder:text-neutral-700 outline-none resize-none leading-relaxed text-lg scrollbar-thin scrollbar-thumb-white/10"
              />
              
              <div className="p-4 border-t border-white/5 bg-black/20 flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={handleGenerateHashtags}
                  disabled={!generatedContent || generatingHashtags}
                  className="bg-neutral-900 border-white/10 text-neutral-300 hover:bg-white/5"
                >
                  {generatingHashtags ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Hash className="w-4 h-4 mr-2 text-blue-400" />}
                  Generar Hashtags
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleGenerateVideoIdeas}
                  disabled={!generatedContent || generatingVideoIdeas}
                  className="bg-neutral-900 border-white/10 text-neutral-300 hover:bg-white/5"
                >
                  {generatingVideoIdeas ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2 text-pink-400" />}
                  Ideas de Video
                </Button>

                <div className="ml-auto flex items-center gap-3">
                  {success && (
                    <span className="text-green-400 text-xs flex items-center gap-1 animate-out fade-out duration-1000">
                      <CheckCircle2 className="w-3 h-3" /> Copiado
                    </span>
                  )}
                  <Button 
                    onClick={handleDirectPublish}
                    disabled={!generatedContent || !selectedPageId || scheduling}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                  >
                    {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {scheduling ? "Publicando..." : "Publicar de una vez"}
                  </Button>

                  <Button 
                    onClick={handleSendToScheduler}
                    disabled={!generatedContent || !selectedPageId || scheduling}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-2"
                  >
                    <CalendarClock className="w-4 h-4" />
                    Programar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
