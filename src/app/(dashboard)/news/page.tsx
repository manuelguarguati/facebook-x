import { fetchNews } from '@/features/news/actions';
import { NewsList } from '@/features/news/components/NewsList';

export default async function NewsPage() {
  // In a real app, this topic could be dynamic or user-configured
  const newsItems = await fetchNews('technology OR artificial intelligence');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Trending News</h1>
        <p className="text-neutral-500">Find viral topics and let AI write the perfect post.</p>
      </div>
      
      <NewsList news={newsItems} />
    </div>
  );
}
