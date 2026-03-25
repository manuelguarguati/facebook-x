import { fetchNews } from '@/features/news/actions';
import { NewsContent } from './NewsContent';

export default async function NewsPage() {
  const newsItems = await fetchNews('technology OR artificial intelligence');

  return <NewsContent newsItems={newsItems} />;
}
