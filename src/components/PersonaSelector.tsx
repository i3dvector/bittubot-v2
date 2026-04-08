'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Bot, Sparkles } from 'lucide-react';

export type PersonaType = 'default' | 'bittusan';

interface PersonaSelectorProps {
  persona: PersonaType;
  onChange: (persona: PersonaType) => void;
}

const personas: { id: PersonaType; label: string; description: string; icon: typeof Bot }[] = [
  { id: 'default', label: 'Default AI', description: 'Sharp, concise assistant', icon: Bot },
  { id: 'bittusan', label: 'Bittusan', description: 'Warm, conversational companion', icon: Sparkles },
];

export default function PersonaSelector({ persona, onChange }: PersonaSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = personas.find((p) => p.id === persona) ?? personas[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Current persona: ${active.label}. Click to change.`}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
      >
        <active.icon size={13} className="text-[var(--accent-action)]" aria-hidden="true" />
        <span>{active.label}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="Select persona"
            className="absolute top-full left-0 mt-1.5 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl shadow-black/30 overflow-hidden z-50"
          >
            {personas.map((p) => {
              const isActive = persona === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onChange(p.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-3.5 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                  }`}
                >
                  <Icon size={15} className="mt-0.5 shrink-0 text-[var(--accent-action)]" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="text-[11px] text-zinc-500">{p.description}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
