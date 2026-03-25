import { createClient } from '@/lib/supabase/server';
import { PageRepository } from '@/repositories/page.repository';
import { PagesContent } from './PagesContent';

export default async function PagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const repo = new PageRepository();
  const pages = await repo.getUserPages(user.id);

  return <PagesContent pages={pages} />;
}
