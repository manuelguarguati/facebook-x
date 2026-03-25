import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { SchedulerForm } from '@/features/scheduler/components/SchedulerForm';
import { ScheduledList } from '@/features/scheduler/components/ScheduledList';
import { createClient } from '@/lib/supabase/server';

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const repo = new ScheduledPostRepository();
  const posts = user ? await repo.getUserScheduledPosts(user.id) : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Content Scheduler</h1>
        <p className="text-neutral-500">Manage and schedule your upcoming Facebook posts.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScheduledList posts={posts} />
        </div>
        <div>
          <SchedulerForm />
        </div>
      </div>
    </div>
  );
}
