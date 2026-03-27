'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { generateGrowthStrategyAction } from '../actions';
import { Spinner } from '@/components/ui/Spinner';
import { Sparkles, BarChart3, Clock, Calendar } from 'lucide-react';

interface GrowthFormProps {
  pageId: string;
}

export function GrowthForm({ pageId }: GrowthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const params = {
      pageId,
      niche: formData.get('niche') as string,
      style: formData.get('style') as string,
      frequency: formData.get('frequency') as string,
      days: parseInt(formData.get('days') as string) || 30,
      analytics: formData.get('analytics') as string,
    };

    const result = await generateGrowthStrategyAction(params);
    if (!result.success) {
      setError(result.error || 'Error desconocido');
    }
    setLoading(false);
  };

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Configurar Plan de Crecimiento</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="niche">Nicho / Temática</Label>
            <Input 
              id="niche" 
              name="niche" 
              placeholder="Ej: Emprendimiento, Fitness, Cocina..." 
              required 
              className="bg-slate-950/50 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Estilo de Marca</Label>
            <Input 
              id="style" 
              name="style" 
              placeholder="Ej: Directo, Amigable, Polémico..." 
              required 
              className="bg-slate-950/50 border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia Diaria</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input 
                id="frequency" 
                name="frequency" 
                placeholder="Ej: 2 posts al día" 
                required 
                className="pl-10 bg-slate-950/50 border-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days">Duración (Días)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input 
                id="days" 
                name="days" 
                type="number" 
                defaultValue="30" 
                required 
                className="pl-10 bg-slate-950/50 border-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="analytics">Datos de Rendimiento (Opcional)</Label>
          <textarea 
            id="analytics" 
            name="analytics" 
            rows={3}
            placeholder="Pega insights o métricas pasadas para que la IA aprenda de ellas..."
            className="w-full rounded-md border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-6"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              Generando Estrategia Maestra...
            </div>
          ) : (
            "Generar Plan 30 Días con IA"
          )}
        </Button>
      </form>
    </Card>
  );
}
