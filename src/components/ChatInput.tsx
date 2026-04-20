'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Mic, Square, ArrowUp } from 'lucide-react';
import type { PersonaType } from './PersonaSelector';
import { pickPlaceholder } from '@/lib/personas';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  isHero?: boolean;
  persona?: PersonaType;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  isHero = false,
  persona = 'vector',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [placeholder, setPlaceholder] = useState(() => pickPlaceholder(persona));
  useEffect(() => {
    setPlaceholder(pickPlaceholder(persona));
  }, [persona]);

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

  const handleContainerClick = () => {
    textareaRef.current?.focus();
  };

  const canSubmit = !isLoading && value.trim().length > 0;

  return (
    <div role="group" aria-label="Message composer" aria-busy={isLoading}>
      <span id="chat-input-hint" className="sr-only">
        Press Enter to send your message. Press Shift and Enter together to add a new line.
      </span>

      {/* Pill container */}
      <div
        onClick={handleContainerClick}
        className="flex items-center gap-2 rounded-full px-3 py-2 cursor-text transition-all duration-300 border"
        style={{
          backgroundColor: 'var(--surface-container-highest, #323534)',
          borderColor: 'rgba(255,255,255,0.07)',
          boxShadow: isHero
            ? '0 20px 40px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Mic button */}
        <button
          type="button"
          aria-label="Voice input"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
          style={{ color: 'var(--foreground)', opacity: 0.4 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
        >
          <Mic size={18} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="chat-message-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Type your message"
          aria-describedby="chat-input-hint"
          aria-multiline="true"
          aria-disabled={isLoading}
          autoComplete="off"
          spellCheck
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none leading-[1.6] max-h-48 overflow-y-auto placeholder:opacity-40"
          style={{
            color: 'var(--foreground)',
            fontSize: isHero ? '1rem' : '0.9375rem',
            minHeight: isHero ? '36px' : '32px',
            fontFamily: 'var(--font-inter)',
          }}
        />

        {/* Send / Stop button */}
        {isLoading && onStop ? (
          <button
            onClick={(e) => { e.stopPropagation(); onStop(); }}
            aria-label="Stop generating response"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all hover:brightness-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
            style={{ backgroundColor: 'var(--surface-container-high, #282b29)', color: 'var(--foreground)' }}
          >
            <Square size={13} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); if (canSubmit) onSubmit(); }}
            disabled={!canSubmit}
            aria-label={isLoading ? 'Sending message…' : 'Send message'}
            aria-disabled={!canSubmit}
            className="shrink-0 h-9 px-4 flex items-center justify-center gap-1.5 rounded-full font-bold text-[11px] uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
            style={{
              background: canSubmit
                ? `linear-gradient(135deg, var(--accent-action), var(--accent-dim, var(--accent-action)))`
                : 'var(--surface-container-high, #282b29)',
              color: canSubmit ? '#00391e' : 'var(--foreground)',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            <ArrowUp size={15} strokeWidth={2.5} />
            <span>Send</span>
          </button>
        )}
      </div>
    </div>
  );
}
