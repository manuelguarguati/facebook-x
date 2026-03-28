"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageIcon, Wand2, Loader2, Download, Send, Upload, X, Sparkles, CalendarClock, Edit3, AlertCircle } from 'lucide-react';
import { generateImageAction, editImageAction } from '@/features/studio/image-studio.actions';
import { getPagesAction, saveScheduledPostAction } from '@/features/studio/ai-studio.actions';
import { schedulePost } from '@/features/scheduler/actions';
import { ManagedPage } from '@/repositories/page.repository';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/src/lib/i18n/LanguageContext';

type Mode = 'generate' | 'edit';

const ASPECT_RATIOS = [
  { label: '1:1 Cuadrado', value: '1:1' },
  { label: '4:5 Portrait', value: '4:5' },
  { label: '16:9 Landscape', value: '16:9' },
  { label: '9:16 Stories', value: '9:16' },
];

const STYLE_PRESETS = [
  { label: '📸 Fotorrealista', value: 'photorealistic, ultra detailed, professional photography' },
  { label: '🎨 Ilustración', value: 'digital illustration, vibrant colors, clean lines' },
  { label: '🖼️ Arte Minimalista', value: 'minimalist, clean, modern design, flat style' },
  { label: '📱 Para Redes', value: 'social media optimized, eye-catching, trending aesthetic' },
  { label: '🛍️ Producto', value: 'professional product photography, studio lighting, white background' },
  { label: '✏️ Sin estilo', value: '' },
];

export default function ImageStudioPage() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('generate');
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedMime, setGeneratedMime] = useState('image/png');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedMime, setUploadedMime] = useState('image/jpeg');
  const [editPrompt, setEditPrompt] = useState('');
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [postContent, setPostContent] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{base64: string, mime: string, prompt: string}[]>([]);
  const router = useRouter();

  useEffect(() => {
    getPagesAction().then(result => {
      if (result.success && result.pages) {
        setPages(result.pages);
        if (result.pages.length > 0) setSelectedPageId(result.pages[0].id);
      }
    });
  }, []);

  const buildFinalPrompt = () => {
    const parts = [prompt];
    if (stylePreset) parts.push(stylePreset);
    return parts.join(', ');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedImage(null);
    const finalPrompt = buildFinalPrompt();
    const result = await generateImageAction(finalPrompt, aspectRatio);
    if (result.success && result.imageBase64) {
      const newImg = result.imageBase64;
      const newMime = result.mimeType || 'image/png';
      setGeneratedImage(newImg);
      setGeneratedMime(newMime);
      setHistory(prev => [{base64: newImg, mime: newMime, prompt: finalPrompt}, ...prev].slice(0, 6));
      if (result.text) setPostContent(result.text);
    } else {
      setError(result.error || 'Error al generar imagen');
    }
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!editPrompt.trim() || !uploadedImage) return;
    setLoading(true);
    const result = await editImageAction(editPrompt, uploadedImage, uploadedMime);
    if (result.success && result.imageBase64) {
      const newImg = result.imageBase64;
      const newMime = result.mimeType || 'image/png';
      setGeneratedImage(newImg);
      setGeneratedMime(newMime);
      setHistory(prev => [{base64: newImg, mime: newMime, prompt: editPrompt}, ...prev].slice(0, 6));
    } else {
      setError(result.error || 'Error al editar imagen');
    }
    setLoading(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedMime(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setUploadedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:${generatedMime};base64,${generatedImage}`;
    link.download = `techus-image-${Date.now()}.png`;
    link.click();
  };

  const handlePublishNow = async () => {
    if (!generatedImage || !selectedPageId) return;
    setScheduling(true);
    const formData = new FormData();
    formData.append('content', postContent || prompt);
    formData.append('pageId', selectedPageId);
    formData.append('publishNow', 'true');
    try {
      const res = await schedulePost(formData);
      if (res.success) {
        alert('¡Publicado con éxito!');
      } else {
        alert(res.error || 'Error al publicar');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setScheduling(false);
    }
  };

  const handleSchedule = async () => {
    if (!generatedImage || !selectedPageId) return;
    setScheduling(true);
    const result = await saveScheduledPostAction({
      page_id: selectedPageId,
      content: postContent || prompt,
      scheduled_for: new Date(Date.now() + 3600000).toISOString(),
    });
    if (result.success) {
      router.push('/dashboard/schedule');
    } else {
      setError(result.error || 'Error al programar');
      setScheduling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      <header>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ImageIcon className="text-purple-500 h-8 w-8" /> {t('studio.images.title')}
        </h1>
        <p className="text-neutral-400 mt-1">{t('studio.images.subtitle')}</p>
      </header>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-neutral-900 rounded-xl w-fit border border-white/5">
        <button
          onClick={() => { setMode('generate'); setGeneratedImage(null); setUploadedImage(null); setError(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'generate' ? 'bg-purple-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
        >
          <Wand2 className="w-4 h-4" /> {t('studio.images.mode_generate')}
        </button>
        <button
          onClick={() => { setMode('edit'); setGeneratedImage(null); setError(null); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'edit' ? 'bg-purple-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
        >
          <Edit3 className="w-4 h-4" /> {t('studio.images.mode_edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-4">

          {mode === 'generate' ? (
            <>
              <Card className="bg-neutral-950 border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">{t('studio.images.describe_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => { setPrompt(e.target.value); setError(null); }}
                    placeholder={t('studio.images.describe_placeholder')}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:border-purple-500 outline-none transition-all min-h-[120px] resize-none"
                  />
                  <p className="text-[10px] text-neutral-600 text-right mt-1">{prompt.length}/500 {t('studio.images.chars_counter')}</p>

                  <div>
                    <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">{t('studio.images.style_label')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STYLE_PRESETS.map(s => (
                        <button
                          key={s.value}
                          onClick={() => setStylePreset(s.value)}
                          className={`text-xs px-3 py-2 rounded-lg border transition-all text-left ${stylePreset === s.value ? 'border-purple-500 bg-purple-500/10 text-purple-300' : 'border-white/10 text-neutral-400 hover:border-white/30'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">{t('studio.images.aspect_label')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ASPECT_RATIOS.map(r => (
                        <button
                          key={r.value}
                          onClick={() => setAspectRatio(r.value)}
                          className={`text-xs px-3 py-2 rounded-lg border transition-all ${aspectRatio === r.value ? 'border-purple-500 bg-purple-500/10 text-purple-300' : 'border-white/10 text-neutral-400 hover:border-white/30'}`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? t('studio.images.button_generating') : t('studio.images.button_generate')}
              </Button>
            </>
          ) : (
            <>
              <Card className="bg-neutral-950 border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">{t('studio.images.upload_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadedImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                      <img src={`data:${uploadedMime};base64,${uploadedImage}`} alt="Upload" className="w-full object-cover max-h-48" />
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 hover:bg-white/5 transition-all text-neutral-500"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">{t('studio.images.upload_drop')}</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </CardContent>
              </Card>

              <Card className="bg-neutral-950 border-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">{t('studio.images.edit_instruction')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder={t('studio.images.edit_placeholder')}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:border-purple-500 outline-none transition-all min-h-[100px] resize-none"
                  />
                </CardContent>
              </Card>

              <Button
                onClick={handleEdit}
                disabled={loading || !editPrompt.trim() || !uploadedImage}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Edit3 className="w-5 h-5" />}
                {loading ? t('studio.images.button_editing') : t('studio.images.button_edit')}
              </Button>
            </>
          )}
        </div>

        {/* Right Panel - Result */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-neutral-950 border-white/5 min-h-[500px] flex flex-col">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">{t('studio.images.result_title')}</CardTitle>
                <CardDescription className="text-neutral-500">{t('studio.images.result_sub')}</CardDescription>
              </div>
              {generatedImage && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadedImage(generatedImage);
                      setUploadedMime(generatedMime);
                      setMode('edit');
                      setGeneratedImage(null);
                    }}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> {t('studio.images.button_use_base')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="border-white/10 text-neutral-400 hover:bg-white/5">
                    <Download className="w-4 h-4 mr-2" /> {t('studio.images.button_download')}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
              {loading ? (
                <div className="w-full space-y-3 animate-pulse">
                  <div className="w-full h-64 bg-neutral-800 rounded-2xl" />
                  <div className="h-4 bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  <p className="text-center text-sm text-purple-400 mt-4">✨ {t('studio.images.generating_feedback')}</p>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-4">
                  <img
                    src={`data:${generatedMime};base64,${generatedImage}`}
                    alt="Imagen generada"
                    className="w-full rounded-2xl border border-white/10 object-contain max-h-80"
                  />

                  {/* Post caption */}
                  <div>
                    <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">{t('studio.images.post_text_label')}</label>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder={t('studio.images.post_text_placeholder')}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-neutral-600 focus:border-purple-500 outline-none min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Page selector */}
                  <div>
                    <label className="text-xs text-neutral-500 uppercase font-bold block mb-2">{t('studio.images.publish_label')}</label>
                    <select
                      value={selectedPageId}
                      onChange={(e) => setSelectedPageId(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-purple-500"
                      disabled={pages.length === 0}
                    >
                      {pages.length === 0 ? (
                        <option value="">{t('studio.images.no_pages')}</option>
                      ) : (
                        pages.map(p => <option key={p.id} value={p.id}>{p.page_name}</option>)
                      )}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handlePublishNow}
                      disabled={!selectedPageId || scheduling}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {t('studio.images.button_publish_now')}
                    </Button>
                    <Button
                      onClick={handleSchedule}
                      disabled={!selectedPageId || scheduling}
                      variant="outline"
                      className="flex-1 border-green-600/50 text-green-500 hover:bg-green-500/10 h-11 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <CalendarClock className="w-4 h-4" />
                      {t('studio.images.button_schedule')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-neutral-600">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                  {error ? (
                    <div className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-center max-w-[200px]">
                      {mode === 'generate' ? t('studio.images.empty_state_generate') : t('studio.images.empty_state_edit')}
                    </p>
                  )}
                </div>
              )}

              {/* Session History */}
              {history.length > 1 && (
                <div className="w-full mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-neutral-500 uppercase font-bold mb-3">{t('studio.images.history_title')}</p>
                  <div className="flex gap-2 flex-wrap">
                    {history.slice(1).map((item, i) => (
                      <img
                        key={i}
                        src={`data:${item.mime};base64,${item.base64}`}
                        alt={item.prompt}
                        title={item.prompt}
                        onClick={() => { setGeneratedImage(item.base64); setGeneratedMime(item.mime); setError(null); }}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10 cursor-pointer hover:border-purple-500 transition-all hover:scale-105"
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
