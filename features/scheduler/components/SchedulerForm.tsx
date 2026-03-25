'use client';

import { useState } from 'react';
import { schedulePost } from '../actions';

export function SchedulerForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await schedulePost(formData);
      (e.target as HTMLFormElement).reset();
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
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-medium text-neutral-700 mb-1">Facebook Page ID</label>
             <input type="text" name="platformId" required className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Page ID" />
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
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Scheduling...' : 'Schedule Post'}
        </button>
      </form>
    </div>
  );
}
