'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSubmit();
    }
  };

  const canSubmit = !isLoading && value.trim().length > 0;

  return (
    <div className="relative flex items-end gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-zinc-500 transition-colors">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message Bittubot…"
        aria-label="Type your message"
        rows={1}
        className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm resize-none outline-none leading-relaxed max-h-48 overflow-y-auto"
      />
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Send message"
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500 text-white transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
      >
        <ArrowUp size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
