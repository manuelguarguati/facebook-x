import { NextResponse } from 'next/server';
import { PostScheduler } from '@/services/scheduler/post.scheduler';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const scheduler = new PostScheduler();
  await scheduler.processQueue();

  return NextResponse.json({ processed: true, timestamp: Date.now() });
}
