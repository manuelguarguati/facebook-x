import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { FacebookService } from '@/services/facebook/facebook.service';

export class PostScheduler {
  private postRepo = new ScheduledPostRepository();
  private fbService = new FacebookService();

  async processQueue(): Promise<void> {
    const pendingPosts = await this.postRepo.getDuePosts();

    for (const post of pendingPosts) {
      try {
        if (!post.pages?.facebook_page_id || !post.pages?.access_token) {
          throw new Error('Missing page configuration or access token');
        }

        const result = await this.fbService.publishPost(
          post.pages.facebook_page_id,
          post.content,
          post.pages.access_token
        );

        if (result.success && result.id) {
          console.log(`[Scheduler] Published post ${post.id} → FB id: ${result.id}`);
          await this.postRepo.updatePostStatus(post.id, 'published', { facebook_post_id: result.id });
        } else {
          console.error(`[Scheduler] Failed to publish post ${post.id}:`, result.error);
          await this.postRepo.updatePostStatus(post.id, 'failed', { error_message: result.error });
        }
      } catch (error: any) {
        console.error(`[Scheduler] Unexpected error publishing post ${post.id}:`, error);
        await this.postRepo.updatePostStatus(post.id, 'failed', { error_message: error.message });
      }
    }
  }
}

