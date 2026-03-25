'use client';

import { useState } from 'react';
import { schedulePost } from '../actions';
import { ManagedPage } from '@/repositories/page.repository';
import { Button } from '@/components/ui/Button';

interface SchedulerFormProps {
  pages: ManagedPage[];
}

export function SchedulerForm({ pages }: SchedulerFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await schedulePost(formData);
      (e.target as HTMLFormElement).reset();
      alert('Post scheduled successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">🗓 Schedule a Post</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Post Content</label>
          <textarea 
            name="content" 
            required 
            rows={4}
            className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="What's on your mind? ..."
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
             <label className="block text-sm font-medium text-neutral-700 mb-1">Target Facebook Page</label>
             <select 
               name="pageId" 
               required 
               className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
             >
               <option value="">Select a page...</option>
               {pages.map((page) => (
                 <option key={page.id} value={page.id}>
                   {page.page_name} ({page.facebook_page_id})
                 </option>
               ))}
             </select>
             {pages.length === 0 && (
               <p className="text-xs text-red-500 mt-1">
                 No pages connected. Please go to "Facebook Pages" to connect one.
               </p>
             )}
          </div>
          <div>
             <label className="block text-sm font-medium text-neutral-700 mb-1">Date & Time</label>
             <input 
               type="datetime-local" 
               name="scheduledAt" 
               required 
               className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
             />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={loading || pages.length === 0}
          className="w-full"
        >
          {loading ? 'Scheduling...' : 'Schedule Post'}
        </Button>
      </form>
    </div>
  );
}
