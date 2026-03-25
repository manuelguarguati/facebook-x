import { AiIdeaRepository } from '@/repositories/ai-idea.repository';
import { AiGenerator } from '@/features/ai/components/AiGenerator';

export default async function DashboardPage() {
  const repo = new AiIdeaRepository();
  const recentIdeas = await repo.getRecentIdeas();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">TECHUS Dashboard</h1>
        <p className="text-neutral-500">Generate viral AI content for your FB Pages.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
             <div className="p-4 border-b bg-neutral-50">
               <h3 className="font-semibold">Recent AI Generations</h3>
             </div>
             <div className="p-0 divide-y">
               {recentIdeas.map(idea => (
                  <div key={idea.id} className="p-4">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">{idea.topic}</span>
                    <p className="text-sm text-neutral-800 line-clamp-3">{idea.content}</p>
                  </div>
               ))}
               {!recentIdeas.length && <p className="p-6 text-center text-sm text-neutral-500">No ideas generated yet.</p>}
             </div>
           </div>
        </div>
        <div>
          <AiGenerator />
        </div>
      </div>
    </div>
  );
}
