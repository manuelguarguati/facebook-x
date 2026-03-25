import { createClient } from '@/lib/supabase/server';
import { PageRepository } from '@/repositories/page.repository';
import { ConnectPageForm } from '@/features/pages/components/ConnectPageForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trash2 } from 'lucide-react';
import { deletePage } from '@/features/scheduler/actions';

export default async function PagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const repo = new PageRepository();
  const pages = await repo.getUserPages(user.id);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Facebook Pages</h1>
        <p className="text-neutral-500">Manage your connected Facebook pages and their permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Pages</CardTitle>
              <CardDescription>
                Pages currently authorized to receive scheduled posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-neutral-200">
                {pages.map((page) => (
                  <div key={page.id} className="py-4 flex items-center justify-between group">
                    <div>
                      <h4 className="font-medium text-neutral-900">{page.page_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-500">ID: {page.facebook_page_id}</span>
                        <Badge variant="secondary" className="text-[10px] uppercase py-0 px-1">Active</Badge>
                      </div>
                    </div>
                    <form action={async () => {
                      'use server';
                      await deletePage(page.id);
                    }}>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                ))}
                {pages.length === 0 && (
                  <div className="py-8 text-center text-sm text-neutral-500">
                    No pages connected yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <ConnectPageForm />
        </div>
      </div>
    </div>
  );
}
