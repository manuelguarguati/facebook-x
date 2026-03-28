"use client";

import { useTranslation } from '@/src/lib/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, Users, Zap, CalendarClock, AlertTriangle } from 'lucide-react';
import { AiGenerator } from '@/features/ai/components/AiGenerator';
import Link from 'next/link';

interface DashboardStats {
  totalFollowers: number;    // sum of pages.followers_count
  totalFans: number;         // sum of pages.fans_count
  pageCount: number;         // count of pages rows
  totalPublishedPosts: number; // count of posts rows (real published)
  pendingPosts: number;      // count of scheduled_posts with status=pending
  totalEngagement: number;   // sum of likes+comments+shares from posts
}

interface DashboardContentProps {
  userEmail: string;
  userName?: string;
  userAvatar?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentIdeas: any[];
  stats: DashboardStats;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function DashboardContent({
  userEmail,
  userName,
  recentIdeas,
  stats,
}: DashboardContentProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('dashboard.stats.posts'),
      value: stats.totalPublishedPosts > 0 ? formatNumber(stats.totalPublishedPosts) : '—',
      sub: stats.totalPublishedPosts > 0
        ? `${stats.totalPublishedPosts} publicado${stats.totalPublishedPosts > 1 ? 's' : ''} en Facebook`
        : 'Sin posts publicados aún',
      icon: Zap,
      color: 'text-blue-500',
    },
    {
      title: t('dashboard.stats.reach'),
      value: stats.totalFollowers > 0 ? formatNumber(stats.totalFollowers) : '—',
      sub:
        stats.pageCount > 0
          ? `${stats.pageCount} página${stats.pageCount > 1 ? 's' : ''} conectada${stats.pageCount > 1 ? 's' : ''}`
          : 'Sin páginas conectadas',
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: 'Enganche Total',
      value: stats.totalEngagement > 0 ? formatNumber(stats.totalEngagement) : '—',
      sub: stats.totalEngagement > 0
        ? 'Likes + comentarios + compartidos'
        : 'Sin interacciones aún',
      icon: BarChart3,
      color: 'text-pink-500',
    },
    {
      title: t('dashboard.stats.scheduled'),
      value: String(stats.pendingPosts),
      sub:
        stats.pendingPosts > 0
          ? `${stats.pendingPosts} post${stats.pendingPosts > 1 ? 's' : ''} por publicar`
          : 'Sin posts programados',
      icon: CalendarClock,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-balance">
            {t('dashboard.welcome')}, {userName || userEmail.split('@')[0] || 'User'}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            {t('dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Alert if no pages connected */}
      {stats.pageCount === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            No tienes páginas de Facebook conectadas.{' '}
            <Link href="/dashboard/pages" className="font-semibold underline underline-offset-2 hover:opacity-80">
              Conecta una página
            </Link>{' '}
            para ver tus métricas reales.
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl sm:text-2xl font-bold dark:text-neutral-50">{stat.value}</div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle>{t('dashboard.recent.title')}</CardTitle>
              <CardDescription>{t('dashboard.recent.description')}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-6 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {idea.idea}
                      </Badge>
                      <span className="text-xs text-neutral-500">{t('dashboard.recent.just_now')}</span>
                    </div>
                    <p className="text-sm text-neutral-800 dark:text-neutral-300 line-clamp-2">
                      {idea.source}
                    </p>
                  </div>
                ))}
                {!recentIdeas.length && (
                  <div className="py-12 text-center text-sm text-neutral-500">
                    {t('dashboard.recent.no_items')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <AiGenerator />
        </div>
      </div>
    </div>
  );
}
