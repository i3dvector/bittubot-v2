'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, MessageSquare, MessageSquarePlus } from 'lucide-react';
import type { Chat } from '@/lib/types';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  persona: import('./PersonaSelector').PersonaType;
  onChangePersona: (persona: import('./PersonaSelector').PersonaType) => void;
}

import PersonaSelector from './PersonaSelector';
import { Settings } from 'lucide-react';

export default function ChatSidebar({
  chats,
  activeChatId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
  persona,
  onChangePersona,
}: ChatSidebarProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          aria-label="Chat history"
          className="absolute md:relative flex flex-col h-full bg-[var(--sidebar-bg)] border-r border-black/10 dark:border-white/5 overflow-hidden shrink-0 z-50 shadow-2xl md:shadow-none"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b shrink-0"
            style={{ borderBottomColor: 'color-mix(in srgb, var(--foreground) 8%, transparent)' }}
          >
            <span
              className="text-sm font-semibold"
              aria-hidden="true"
              style={{ color: 'var(--foreground)', opacity: 0.7 }}
            >
              Bittubot
            </span>
            <button
              onClick={onToggle}
              aria-label="Collapse sidebar"
              aria-expanded={isOpen}
              aria-controls="chat-history-list"
              className="p-1.5 rounded-lg opacity-40 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
              style={{ color: 'var(--foreground)' }}
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 py-3 shrink-0">
            <button
              onClick={onNewChat}
              aria-label="Start a new chat"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[0.9375rem] font-medium bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] shadow-sm outline-none"
            >
              <span className="flex items-center gap-2">
                <MessageSquarePlus size={16} aria-hidden="true" />
                New Chat
              </span>
            </button>
          </div>

          {/* Chat list */}
          <nav
            id="chat-history-list"
            aria-label="Previous chats"
            className="flex-1 overflow-y-auto px-3 pb-3"
          >
            {chats.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-6" aria-live="polite">
                No chats yet
              </p>
            ) : (
              <ul role="list" className="space-y-0.5">
                {chats.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  return (
                    <li key={chat.id} role="listitem">
                      <button
                        onClick={() => {
                          onSelectChat(chat.id);
                          if (window.innerWidth < 768) onToggle();
                        }}
                        aria-label={`Open chat: ${chat.title}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.9375rem] text-left transition-all outline-none ${
                          isActive
                            ? 'bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-zinc-100 font-medium'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 font-medium'
                        }`}
                      >
                        <MessageSquare size={13} className="shrink-0 opacity-60" aria-hidden="true" />
                        <span className="truncate">{chat.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>

          {/* Bottom actions: Persona and Settings */}
          <div className="shrink-0 p-3 bg-[var(--sidebar-bg)] border-t border-black/10 dark:border-white/5">
            <div className="flex flex-col gap-1">
              <PersonaSelector persona={persona} onChange={onChangePersona} />
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.9375rem] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all outline-none"
                aria-label="Settings"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
