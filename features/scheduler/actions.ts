'use server';

import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { PageRepository } from '@/repositories/page.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { FacebookService } from '@/services/facebook/facebook.service';

export async function schedulePost(formData: FormData) {
  try {
    const content = formData.get('content') as string;
    const scheduledAt = formData.get('scheduledAt') as string;
    const pageId = formData.get('pageId') as string;
    const publishNow = formData.get('publishNow') === 'true';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const repo = new ScheduledPostRepository();
    const fbService = new FacebookService();

    if (publishNow) {
      // 1. Immediate Publishing
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('facebook_page_id, access_token')
        .eq('id', pageId)
        .single();

      if (pageError || !page?.access_token) {
        return { success: false, error: 'No se pudo encontrar el token de la página.' };
      }

      const result = await fbService.publishPost(page.facebook_page_id, content, page.access_token);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      await repo.scheduleNewPost({
        page_id: pageId,
        content,
        scheduled_for: new Date().toISOString(),
        status: 'published',
        facebook_post_id: result.id
      });
    } else {
      // 2. Scheduled Publishing
      const scheduledDate = new Date(scheduledAt);
      
      if (scheduledDate < new Date()) {
        return { success: false, error: 'La fecha no puede estar en el pasado.' };
      }

      await repo.scheduleNewPost({
        page_id: pageId,
        content,
        scheduled_for: scheduledDate.toISOString(),
        status: 'pending'
      });
    }

    revalidatePath('/dashboard/schedule', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('Error in schedulePost:', error);
    return { success: false, error: error.message || 'Error interno del servidor' };
  }
}

export async function deletePage(id: string) {
  const repo = new PageRepository();
  await repo.deletePage(id);
  revalidatePath('/dashboard/pages', 'page');
  revalidatePath('/dashboard/schedule', 'page');
  return { success: true };
}
