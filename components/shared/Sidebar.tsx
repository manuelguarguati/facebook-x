import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-64 bg-neutral-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tighter">TECHUS</h2>
        <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">AI Assistant</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/dashboard" className="block px-4 py-2 bg-neutral-800 rounded-lg text-sm font-medium text-white">
          Dashboard Overview
        </Link>
        <Link href="/dashboard/news" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          News Content
        </Link>
        <Link href="/dashboard/schedule" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg text-sm font-medium text-neutral-300 transition-colors">
          Scheduled Posts
        </Link>
      </nav>
      <div className="p-4 border-t border-neutral-800">
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
