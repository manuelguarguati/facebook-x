import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from './DashboardContent';

export default async function DashboardPage() {
  const repo = new AiIdeaRepository();
  const recentIdeas = await repo.getRecentIdeas();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <DashboardContent
      userEmail={user?.email || 'User'}
      recentIdeas={recentIdeas}
    />
  );
}
