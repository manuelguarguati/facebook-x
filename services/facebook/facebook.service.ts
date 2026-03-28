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

  async exchangeToken(shortLivedToken: string, appId: string, appSecret: string): Promise<string> {
    const url = new URL(`https://graph.facebook.com/oauth/access_token`);
    url.searchParams.append('grant_type', 'fb_exchange_token');
    url.searchParams.append('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('fb_exchange_token', shortLivedToken);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Facebook Token Exchange Error: ${data.error?.message || 'Unknown error'}`);
    }

    return data.access_token;
  }
}
