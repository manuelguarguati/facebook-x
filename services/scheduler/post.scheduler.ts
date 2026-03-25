import { PostRepository } from '@/repositories/post.repository';
import { FacebookService } from '@/services/facebook/facebook.service';

export class PostScheduler {
  private postRepo = new PostRepository();
  private fbService = new FacebookService();

  async processQueue(): Promise<void> {
    const pendingPosts = await this.postRepo.getDuePosts();

    for (const post of pendingPosts) {
      try {
        const platformPostId = await this.fbService.publishPost(
          post.page_id, 
          post.content, 
          post.pages?.access_token
        );
        
        await this.postRepo.updatePostStatus(post.id, 'published', platformPostId);
      } catch (error) {
        await this.postRepo.updatePostStatus(post.id, 'failed', undefined, String(error));
      }
    }
  }
}
