import { Sparkles } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <Sparkles size={24} className="text-emerald-400" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-zinc-100">How can I help you today?</h2>
        <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
          Ask me anything — write code, brainstorm ideas, or just have a conversation.
        </p>
      </div>
    </div>
  );
}
