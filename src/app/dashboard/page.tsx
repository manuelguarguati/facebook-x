import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from './DashboardContent';
import { UserRepository } from '@/repositories/user.repository';

export default async function DashboardPage() {
  const repo = new AiIdeaRepository();
  const userRepo = new UserRepository();
  const recentIdeas = await repo.getRecentIdeas();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const profile = user ? await userRepo.getUserProfile(user.id) : null;

  return (
    <DashboardContent
      userEmail={profile?.email || user?.email || 'User'}
      userName={profile?.name || user?.user_metadata?.name || 'User'}
      userAvatar={profile?.avatar_url || user?.user_metadata?.avatar_url}
      recentIdeas={recentIdeas}
    />
  );
}
