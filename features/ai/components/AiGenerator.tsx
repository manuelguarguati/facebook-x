'use client';

import { useState } from 'react';
import { generateIdea } from '../actions';

export function AiGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await generateIdea(formData);
      if (res.success) setResult(res.content);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">💡 AI Content Generator</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">What is your post about?</label>
          <textarea 
            name="topic" 
            required 
            rows={3}
            className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Explain why Next.js App Router is the future of web development..."
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating Magic...' : 'Generate Idea'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Generated Result:</h4>
          <p className="text-sm text-blue-800 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}
