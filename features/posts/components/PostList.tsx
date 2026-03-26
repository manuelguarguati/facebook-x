// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PostList({ posts }: { posts: any[] }) {
  if (!posts.length) return <div className="p-8 text-center text-neutral-500 bg-white rounded-xl border">No scheduled posts.</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white rounded-xl border shadow-sm">
          <p className="text-sm text-neutral-800">{post.content}</p>
          <div className="flex justify-between mt-4 text-xs text-neutral-500">
            <span>Status: <span className="font-medium capitalize text-blue-600">{post.status}</span></span>
            <span>Sch: {new Date(post.scheduled_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
