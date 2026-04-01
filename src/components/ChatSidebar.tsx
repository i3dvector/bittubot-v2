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
}

export default function ChatSidebar({
  chats,
  activeChatId,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          aria-label="Chat history"
          className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 overflow-hidden shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
            <span className="text-sm font-semibold text-zinc-100" aria-hidden="true">
              Bittubot
            </span>
            <button
              onClick={onToggle}
              aria-label="Collapse sidebar"
              aria-expanded={isOpen}
              aria-controls="chat-history-list"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 py-3 shrink-0">
            <button
              onClick={onNewChat}
              aria-label="Start a new chat"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-100 hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
            >
              <MessageSquarePlus size={15} aria-hidden="true" />
              <span>New Chat</span>
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
                        onClick={() => onSelectChat(chat.id)}
                        aria-label={`Open chat: ${chat.title}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none ${
                          isActive
                            ? 'bg-zinc-800 text-zinc-100'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
