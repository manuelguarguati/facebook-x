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

        const platformPostId = await this.fbService.publishPost(
          post.pages.facebook_page_id, 
          post.content, 
          post.pages.access_token
        );
        
        await this.postRepo.updatePostStatus(post.id, 'published', platformPostId);
      } catch (error) {
        await this.postRepo.updatePostStatus(post.id, 'failed', undefined, String(error));
      }
    }
  }
}
