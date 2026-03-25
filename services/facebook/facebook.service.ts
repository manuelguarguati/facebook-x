export class FacebookService {
  private readonly baseUrl = 'https://graph.facebook.com/v19.0';

  async publishPost(pageId: string, message: string, accessToken: string): Promise<string> {
    const url = new URL(`${this.baseUrl}/${pageId}/feed`);
    url.searchParams.append('message', message);
    url.searchParams.append('access_token', accessToken);

    const response = await fetch(url.toString(), { method: 'POST' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Facebook API Exception: ${data.error?.message}`);
    }

    return data.id;
  }
}
