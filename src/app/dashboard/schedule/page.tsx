import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { PageRepository } from '@/repositories/page.repository';
import { createClient } from '@/lib/supabase/server';
import { ScheduleContent } from './ScheduleContent';

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const postRepo = new ScheduledPostRepository();
  const pageRepo = new PageRepository();
  
  const [posts, pages] = await Promise.all([
    postRepo.getUserScheduledPosts(user.id),
    pageRepo.getUserPages(user.id)
  ]);

  return <ScheduleContent posts={posts} pages={pages} />;
}
