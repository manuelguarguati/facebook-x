"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { PenTool, Send, Loader2, Image as ImageIcon, Sparkles, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPagesAction, saveScheduledPostAction, analyzeImageAction } from '@/features/studio/ai-studio.actions';
import { ManagedPage } from '@/repositories/page.repository';
import { createClient } from '@/lib/supabase/client';
import { schedulePost } from '@/features/scheduler/actions';
import { CalendarClock } from 'lucide-react';

export default function ManualStudioPage() {
  const [content, setContent] = useState('');
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [scheduling, setScheduling] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyzeImage = async () => {
    if (!imagePreview) return;
    
    setAnalyzing(true);
    try {
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imageFile?.type || 'image/jpeg';
      
      const result = await analyzeImageAction(base64Data, mimeType);
      if (result.success && result.content) {
        setContent(result.content);
      } else {
        alert(result.error || "Error al analizar la imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al analizar la imagen");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSchedule = async () => {
    if (!content || !selectedPageId) {
      if (!selectedPageId) alert("Por favor, selecciona una página primero.");
      return;
    }
    
    setScheduling(true);
    let mediaUrl = undefined;

    // Upload image if present
    if (imageFile) {
      try {
        const supabase = createClient();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `manual-studio/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('posts')
          .upload(filePath, imageFile);

        if (uploadError) {
          // Si el bucket no existe, podrías recibir un error aquí. 
          // En producción deberías asegurar que el bucket exista.
          console.error('Upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);
          mediaUrl = publicUrl;
        }
      } catch (e) {
        console.error('Storage error:', e);
      }
    }

    const result = await saveScheduledPostAction({
      page_id: selectedPageId,
      content: content,
      media_url: mediaUrl,
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
    if (!content || !selectedPageId) return;
    
    setScheduling(true);
    let mediaUrl = undefined;

    // Upload image if present (reuse logic)
    if (imageFile) {
      try {
        const supabase = createClient();
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `manual-studio/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('posts').upload(filePath, imageFile);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(filePath);
          mediaUrl = publicUrl;
        }
      } catch (e) { console.error(e); }
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('pageId', selectedPageId);
    formData.append('publishNow', 'true');
    if (mediaUrl) formData.append('mediaUrl', mediaUrl);

    try {
      const res = await schedulePost(formData);
      if (res.success) {
        alert("¡Publicado con éxito en Facebook!");
        setContent('');
        setImageFile(null);
        setImagePreview(null);
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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <PenTool className="text-blue-500 h-8 w-8" /> Estudio Manual
          </h1>
          <p className="text-neutral-400 mt-1">
            Crea publicaciones personalizadas con ayuda de IA visual.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Config */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-neutral-900/50 border-white/5 backdrop-blur-sm">
            <CardHeader className="pb-3 text-white">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-neutral-500">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-neutral-400">Publicar en</Label>
                <select 
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] text-neutral-500 mb-2 uppercase font-bold">Resumen del Post</p>
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <div className={`w-2 h-2 rounded-full ${content ? 'bg-green-500' : 'bg-red-500'}`} />
                  {content ? 'Texto listo' : 'Esperando texto'}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-300 mt-2">
                  <div className={`w-2 h-2 rounded-full ${imageFile ? 'bg-blue-500' : 'bg-neutral-700'}`} />
                  {imageFile ? 'Imagen cargada' : 'Sin imagen'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor Main */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-neutral-900/50 border-white/5 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-lg text-white">Compositor de Contenido</CardTitle>
                <CardDescription className="text-xs">Usa la IA para describir tus imágenes automáticamente.</CardDescription>
              </div>
              
              {imagePreview && (
                <Button 
                  onClick={handleAnalyzeImage}
                  disabled={analyzing}
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 flex items-center gap-2"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {analyzing ? "Analizando..." : "Análisis IA"}
                </Button>
              )}
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/5 min-h-[500px]">
              {/* Media Section */}
              <div className="w-full sm:w-1/3 p-4 bg-black/20 flex flex-col gap-4">
                <Label className="text-xs text-neutral-500 uppercase font-bold">Media</Label>
                
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-square group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all text-neutral-500 hover:text-neutral-300"
                  >
                    <div className="p-3 bg-white/5 rounded-full">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-center px-4">Haz clic para subir una imagen</span>
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Text Section */}
              <div className="flex-1 flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe la descripción de tu post aquí, o sube una foto y deja que la IA se encargue..."
                  className="flex-1 w-full bg-transparent p-6 text-lg text-neutral-200 placeholder:text-neutral-700 outline-none resize-none leading-relaxed"
                />
                
                <div className="p-4 border-t border-white/5 bg-black/10 flex justify-between items-center">
                  <div className="text-[10px] text-neutral-600 font-mono">
                    {content.length} caracteres
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDirectPublish}
                      disabled={!content || !selectedPageId || scheduling}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {scheduling ? "Publicando..." : "Publicar de una vez"}
                    </Button>
                    
                    <Button 
                      onClick={handleSchedule}
                      disabled={!content || !selectedPageId || scheduling}
                      variant="outline"
                      className="border-neutral-700 text-neutral-400 hover:bg-white/5 px-6 h-12 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <CalendarClock className="w-4 h-4" />
                      Programar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
