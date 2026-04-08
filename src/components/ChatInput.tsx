'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
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

  // Clicking anywhere in the padded container focuses the textarea
  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const canSubmit = !isLoading && value.trim().length > 0;

  return (
    <div
      role="group"
      aria-label="Message composer"
      aria-busy={isLoading}
    >
      {/* Keyboard shortcut hint — screen-reader only */}
      <span id="chat-input-hint" className="sr-only">
        Press Enter to send your message. Press Shift and Enter together to add a new line.
      </span>

      <div
        onClick={handleContainerClick}
        className="flex items-end gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 cursor-text focus-within:border-zinc-500 transition-colors"
      >
        <textarea
          ref={textareaRef}
          id="chat-message-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Bittubot…"
          aria-label="Type your message"
          aria-describedby="chat-input-hint"
          aria-multiline="true"
          aria-disabled={isLoading}
          autoComplete="off"
          spellCheck
          rows={1}
          className="flex-1 w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 text-sm resize-none outline-none leading-relaxed max-h-48 overflow-y-auto"
        />

        {/* Stop button while streaming; send button otherwise */}
        {isLoading && onStop ? (
          <button
            onClick={(e) => { e.stopPropagation(); onStop(); }}
            aria-label="Stop generating response"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-zinc-100 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
          >
            <Square size={13} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); if (canSubmit) onSubmit(); }}
            disabled={!canSubmit}
            aria-label={isLoading ? 'Sending message…' : 'Send message'}
            aria-disabled={!canSubmit}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--accent-action)] text-white transition-all hover:brightness-110 hover:scale-105 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
          >
            <ArrowUp size={15} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
