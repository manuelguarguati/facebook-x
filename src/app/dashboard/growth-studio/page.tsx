import { getGrowthStrategiesAction } from '@/features/growth/actions';
import { GrowthForm } from '@/features/growth/components/GrowthForm';
import { StrategyDisplay } from '@/features/growth/components/StrategyDisplay';
import { Sparkles, TrendingUp } from 'lucide-react';
import { LayoutContainer } from '@/components/ui/LayoutContainer';

export default async function GrowthStudioPage({
  searchParams,
}: {
  searchParams: { pageId?: string };
}) {
  const pageId = searchParams.pageId;
  let latestStrategy = null;

  if (pageId) {
    const response = await getGrowthStrategiesAction(pageId);
    if (response.success && response.data && response.data.length > 0) {
      latestStrategy = response.data[0].strategy_json;
    }
  }

  return (
    <LayoutContainer>
      <div className="max-w-6xl mx-auto space-y-10 py-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl flex items-center gap-3">
              Elite Growth Studio
              <Sparkles className="w-10 h-10 text-white fill-white/20 animate-pulse" />
            </h1>
            <p className="text-indigo-100 text-lg sm:text-xl font-medium leading-relaxed">
              No generamos texto, creamos imperios. Nuestro sistema IA actúa como tu estratega 
              personal para dominar el algoritmo de Facebook y viralizar tu marca.
            </p>
          </div>
          
          {/* Abstract Decorations */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-40 w-80 translate-y-1/2 rounded-full bg-indigo-500/30 blur-3xl" />
          <TrendingUp className="absolute right-12 top-12 w-32 h-32 text-white/5 -rotate-12" />
        </div>

        {!pageId ? (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 border-2 border-dashed border-slate-800 rounded-3xl">
            <div className="p-4 bg-slate-800/50 rounded-full">
              <Sparkles className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Selecciona una Página</h3>
            <p className="text-slate-500 max-w-xs">
              Para empezar a generar estrategias de crecimiento, selecciona una página de Facebook en el menú lateral.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <GrowthForm pageId={pageId} />
            </section>

            {latestStrategy && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-800" />
                  <span className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">Última Estrategia Generada</span>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>
                <StrategyDisplay strategy={latestStrategy} pageId={pageId} />
              </section>
            )}
          </div>
        )}
      </div>
    </LayoutContainer>
  );
}
