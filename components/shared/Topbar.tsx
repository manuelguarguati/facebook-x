export function Topbar({ user }: { user: any }) {
  return (
    <header className="h-16 border-b bg-white flex items-center px-8 justify-between shadow-sm z-10">
      <div>
        <h2 className="text-lg font-medium text-neutral-800">Workspace</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm uppercase">
            {user?.email?.charAt(0) || 'U'}
          </div>
          <span className="text-sm text-neutral-600 font-medium">
            {user?.email || 'Guest User'}
          </span>
        </div>
      </div>
    </header>
  );
}
