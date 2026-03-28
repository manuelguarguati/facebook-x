"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, Users, Zap, CalendarClock, AlertTriangle, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { AiGenerator } from '@/features/ai/components/AiGenerator';
import Link from 'next/link';

interface DashboardStats {
  totalFollowers: number;
  totalFans: number;
  pageCount: number;
  totalPublishedPosts: number;
  pendingPosts: number;
  totalEngagement: number;
  totalReach: number;
  trends: {
    reachTrend: number;
    engagementTrend: number;
    followerTrend: number;
  };
}

interface DashboardContentProps {
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentIdeas: any[];
  pages: any[];
  stats: DashboardStats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function DashboardContent({
  userName,
  recentIdeas,
  pages,
  stats,
}: DashboardContentProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('dashboard.stats.posts'),
      value: stats.totalPublishedPosts > 0 ? formatNumber(stats.totalPublishedPosts) : '0',
      sub: stats.totalPublishedPosts > 0
        ? `${stats.totalPublishedPosts} publicado${stats.totalPublishedPosts > 1 ? 's' : ''}`
        : 'Sin actividad',
      icon: Zap,
      gradient: 'from-blue-600/20 to-transparent',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Alcance Total',
      value: stats.totalReach > 0 ? formatNumber(stats.totalReach) : '0',
      sub: stats.trends.reachTrend !== 0 ? `${stats.trends.reachTrend > 0 ? '+' : ''}${stats.trends.reachTrend}% vs semana anterior` : 'Tendencia estable',
      trend: stats.trends.reachTrend,
      icon: TrendingUp,
      gradient: 'from-emerald-600/20 to-transparent',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Engagement',
      value: stats.totalEngagement > 0 ? formatNumber(stats.totalEngagement) : '0',
      sub: stats.trends.engagementTrend !== 0 ? `${stats.trends.engagementTrend > 0 ? '+' : ''}${stats.trends.engagementTrend}% engagement` : 'Interacción constante',
      trend: stats.trends.engagementTrend,
      icon: Activity,
      gradient: 'from-purple-600/20 to-transparent',
      borderColor: 'border-purple-500/20',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Programados',
      value: String(stats.pendingPosts),
      sub:
        stats.pendingPosts > 0
          ? `${stats.pendingPosts} en cola de espera`
          : 'Cola vacía',
      icon: CalendarClock,
      gradient: 'from-orange-600/20 to-transparent',
      borderColor: 'border-orange-500/20',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-neutral-900 to-black p-8 sm:p-12 border border-white/5 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
            Elite Command Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
            {t('dashboard.welcome')}, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{userName || 'Creador'}</span>
          </h1>
          <p className="text-neutral-400 text-lg font-medium leading-relaxed">
            {t('dashboard.subtitle')} Gestiona tu imperio digital con inteligencia artificial de última generación.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-40 w-80 translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" />
        <Zap className="absolute right-12 top-12 w-32 h-32 text-white/5 -rotate-12" />
      </div>

      {/* Alert if no pages connected */}
      {stats.pageCount === 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4 text-sm text-amber-400 backdrop-blur-md">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">
            Tu cuenta no tiene páginas de Facebook vinculadas aún.{' '}
            <Link href="/dashboard/pages" className="font-bold underline underline-offset-4 hover:text-amber-300 transition-colors">
              Conectar mi primera página ahora
            </Link>
          </p>
        </div>
      )}

      {/* Stats grid with Glassmorphism */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat: any, i) => (
          <Card key={i} className={`relative p-0 bg-neutral-950/40 backdrop-blur-xl border ${stat.borderColor} overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6 px-6 relative z-10">
              <CardTitle className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.iconColor} transition-transform duration-500 group-hover:rotate-12`} />
            </CardHeader>
            
            <CardContent className="px-6 pb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
                {stat.trend !== undefined && stat.trend !== 0 && (
                  <Badge variant="outline" className={`border-none px-2 py-0.5 text-[10px] font-black ${stat.trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {stat.trend > 0 ? '↑' : '↓'}{Math.abs(stat.trend)}%
                  </Badge>
                )}
              </div>
              <p className="text-[11px] font-semibold text-neutral-600 mt-2 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${stat.iconColor} opacity-50`} />
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary area: Content & Ideas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Ideas / Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-neutral-950 border-white/5 overflow-hidden shadow-xl">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" /> {t('dashboard.recent.title')}
                </CardTitle>
                <CardDescription className="text-neutral-500 mt-1">{t('dashboard.recent.description')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-white/5">
                {recentIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-8 transition-all hover:bg-white/[0.02] group"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-neutral-900 text-neutral-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors px-3 py-1"
                      >
                        {idea.idea}
                      </Badge>
                      <div className="flex items-center gap-6">
                        <Link 
                          href={`/dashboard/schedule?content=${encodeURIComponent(idea.source)}`}
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-blue-400 transition-colors"
                        >
                          <CalendarClock className="h-4 w-4" />
                          <span>Programar</span>
                        </Link>
                        <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">{t('dashboard.recent.just_now')}</span>
                      </div>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-medium line-clamp-3 group-hover:text-white transition-colors">
                      {idea.source}
                    </p>
                  </div>
                ))}
                {!recentIdeas.length && (
                  <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-4 rounded-3xl bg-neutral-900 text-neutral-600">
                      <Zap className="h-8 w-8" />
                    </div>
                    <p className="text-neutral-500 font-medium tracking-tight">
                      No hay actividad reciente para mostrar.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Mini-Tools */}
        <div className="lg:col-span-1 space-y-8">
          <AiGenerator pages={pages} />
        </div>
      </div>
    </div>
  );
}
