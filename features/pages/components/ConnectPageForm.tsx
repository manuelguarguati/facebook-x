'use client';

import { useState } from 'react';
import { connectPage } from '@/features/scheduler/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export function ConnectPageForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await connectPage(formData);
      (e.target as HTMLFormElement).reset();
      alert('Page connected successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect New Page</CardTitle>
        <CardDescription>
          Enter your Facebook Page details manually to start scheduling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageName">Page Name</Label>
            <Input id="pageName" name="pageName" placeholder="My Awesome Page" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebookPageId">Facebook Page ID</Label>
            <Input id="facebookPageId" name="facebookPageId" placeholder="1234567890" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessToken">Page Access Token</Label>
            <Input id="accessToken" name="accessToken" type="password" placeholder="EAAB..." required />
            <p className="text-xs text-neutral-500">
              Get this from the Meta for Developers portal or Graph API Explorer.
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Connecting...' : 'Connect Page'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
