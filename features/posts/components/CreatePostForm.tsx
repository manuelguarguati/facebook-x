'use client';

import { generateAndSchedule } from '../actions';
import { useState } from 'react';

export function CreatePostForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await generateAndSchedule(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold mb-4">Create AI Scheduled Post</h3>
      <input type="hidden" name="pageId" value="mock-page-id" />
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <input 
            name="topic" 
            required 
            className="w-full border rounded-lg p-2" 
            placeholder="e.g., The future of Next.js"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate & Schedule'}
        </button>
      </div>
    </form>
  );
}
