export interface FacebookResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export class FacebookService {
  private readonly baseUrl = 'https://graph.facebook.com/v19.0';

  async publishPost(pageId: string, message: string, accessToken: string): Promise<FacebookResponse> {
    const url = new URL(`${this.baseUrl}/${pageId}/feed`);
    url.searchParams.append('message', message);
    url.searchParams.append('access_token', accessToken);

    try {
      const response = await fetch(url.toString(), { method: 'POST' });
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Unknown Facebook API error' };
      }

      return { success: true, id: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getPageInfo(pageId: string, accessToken: string): Promise<{ name: string; id: string }> {
    const url = new URL(`${this.baseUrl}/${pageId}`);
    url.searchParams.append('fields', 'name,id');
    url.searchParams.append('access_token', accessToken);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Facebook API Exception: ${data.error?.message}`);
    }

    return { name: data.name, id: data.id };
  }
}
