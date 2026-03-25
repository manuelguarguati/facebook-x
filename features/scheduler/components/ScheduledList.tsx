export function ScheduledList({ posts }: { posts: any[] }) {
  if (!posts.length) return <div className="p-8 text-center text-neutral-500 bg-white rounded-xl border">No scheduled posts yet.</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <p className="text-sm text-neutral-800 whitespace-pre-wrap">{post.content}</p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center space-x-2 text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${post.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {post.status.toUpperCase()}
              </span>
              <span className="text-neutral-500">Page: {post.platform_id}</span>
            </div>
            <span className="text-xs font-semibold text-neutral-600">
              {new Date(post.scheduled_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
