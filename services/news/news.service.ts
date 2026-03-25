export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export class NewsService {
  async fetchTrendingTopics(niche: string): Promise<NewsItem[]> {
    const response = await fetch(`https://newsapi.org/v2/everything?q=${niche}&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`);
    
    if (!response.ok) throw new Error('Failed to fetch external news');
    
    const data = await response.json();
    return data.articles.slice(0, 10).map((article: any) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));
  }
}
