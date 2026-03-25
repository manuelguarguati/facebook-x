export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export class NewsService {
  async fetchTrendingTopics(niche: string): Promise<NewsItem[]> {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${niche || 'technology'}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`);
      
      if (!response.ok) {
        console.error('NewsAPI Error:', response.statusText);
        return [];
      }
      
      const data = await response.json();
      if (!data.articles) return [];

      return data.articles.slice(0, 10).map((article: any) => ({
        title: article.title,
        url: article.url,
        source: article.source?.name || 'Unknown',
        publishedAt: article.publishedAt
      }));
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }
}
