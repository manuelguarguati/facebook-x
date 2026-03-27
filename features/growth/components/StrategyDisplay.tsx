'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, LayoutGrid, Zap, Target, BookOpen, Quote, Check, AlertCircle } from 'lucide-react';
import { syncToCalendarAction } from '../actions';
import { Spinner } from '@/components/ui/Spinner';

interface StrategyDisplayProps {
  strategy: any;
  pageId: string;
}

export function StrategyDisplay({ strategy, pageId }: StrategyDisplayProps) {
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [syncedIds, setSyncedIds] = useState<number[]>([]);
  const [errorId, setErrorId] = useState<number | null>(null);

  if (!strategy) return null;
  const { estrategia, calendario, mejores_contenidos, hooks_extra, recomendaciones } = strategy;

  const handleSync = async (post: any, index: number) => {
    setSyncingId(index);
    setErrorId(null);
    
    const result = await syncToCalendarAction({
      pageId,
      content: `${post.hook}\n\n${post.descripcion}`,
      dayNumber: post.dia || 1,
      timeStr: post.hora || "10:00 AM"
    });

    if (result.success) {
      setSyncedIds(prev => [...prev, index]);
    } else {
      setErrorId(index);
    }
    setSyncingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Resumen de Estrategia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-lg">Resumen</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{estrategia.resumen}</p>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <LayoutGrid className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-lg">Tipos de Contenido</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {estrategia.tipos_contenido?.map((type: string, i: number) => (
              <Badge key={i} variant="outline" className="border-emerald-500/30 text-emerald-400">
                {type}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-slate-900/50 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white text-lg">Enfoque</h3>
          </div>
          <p className="text-slate-400 text-sm">{estrategia.enfoque}</p>
        </Card>
      </div>

      {/* Calendario de Publicaciones */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-500" />
            Calendario Maestro
          </h2>
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
            {calendario.length} Publicaciones
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {calendario.slice(0, 15).map((post: any, i: number) => {
            const isSynced = syncedIds.includes(i);
            const isSyncing = syncingId === i;
            const hasError = errorId === i;

            return (
              <Card key={i} className="p-4 bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors group">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-indigo-400 font-bold text-lg">Día {post.dia}</div>
                    <div className="text-slate-500 text-xs">{post.hora}</div>
                    <Badge variant="outline" className="mt-2 text-[10px] uppercase tracking-wider border-slate-700 text-slate-400">
                      {post.formato}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="text-white font-medium text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                      {post.hook}
                    </h4>
                    <p className="text-slate-400 text-sm italic">"{post.descripcion.substring(0, 120)}..."</p>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-tighter">
                        <Zap className="w-3 h-3 text-amber-500/50" />
                        {post.emocion}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 min-w-[120px] flex justify-end">
                    {isSynced ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                        <Check className="w-4 h-4" />
                        Programado
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSync(post, i)}
                        disabled={isSyncing}
                        className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-sm border border-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSyncing ? <Spinner className="w-3 h-3" /> : null}
                        {hasError ? <AlertCircle className="w-3 h-3" /> : null}
                        {hasError ? "Reintentar" : "Programar"}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
          {calendario.length > 15 && (
            <p className="text-center text-slate-500 text-sm py-4 border-t border-slate-800 mt-4">
              Y {calendario.length - 15} publicaciones adicionales en el plan estratégico...
            </p>
          )}
        </div>
      </section>

      {/* Hooks y Recomendaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Quote className="w-5 h-5 text-indigo-500" />
            Hooks Ultra Virales Extra
          </h3>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-3">
            {hooks_extra.slice(0, 10).map((hook: string, i: number) => (
              <div key={i} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-slate-300 text-sm hover:border-indigo-500/30 transition-colors flex gap-3">
                <span className="text-indigo-500/50 font-mono text-xs mt-0.5">{(i+1).toString().padStart(2, '0')}</span>
                {hook}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Plan de Mejora Continua
          </h3>
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 space-y-4">
            {recomendaciones.map((rec: string, i: number) => (
              <div key={i} className="flex gap-4 items-start p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
