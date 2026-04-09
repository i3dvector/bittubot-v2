'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronUp, MessageSquare, MessageSquarePlus } from 'lucide-react';
import type { Chat } from '@/lib/types';
import type { PersonaType } from './PersonaSelector';
import { PERSONA_TILES } from '@/lib/personas';

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  persona: PersonaType;
  onChangePersona: (persona: PersonaType) => void;
}

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
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const activeTile = PERSONA_TILES.find((t) => t.id === persona) ?? PERSONA_TILES[0];
  const ActiveIcon = activeTile.icon;

  const handlePersonaSelect = (id: PersonaType) => {
    onChangePersona(id);
    setSwitcherOpen(false);
  };

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
              <p
                className="text-xs text-center py-6"
                style={{ color: 'var(--foreground)', opacity: 0.35 }}
                aria-live="polite"
              >
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

          {/* Persona switcher — bottom panel */}
          <div
            className="shrink-0 border-t"
            style={{ borderTopColor: 'color-mix(in srgb, var(--foreground) 8%, transparent)' }}
          >
            {/* Tile picker — slides up from within sidebar */}
            <AnimatePresence>
              {switcherOpen && (
                <motion.div
                  key="persona-tiles"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-3 flex flex-col gap-2">
                    {PERSONA_TILES.map((tile, i) => {
                      const Icon = tile.icon;
                      const isActive = persona === tile.id;
                      return (
                        <motion.button
                          key={tile.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                          onClick={() => handlePersonaSelect(tile.id)}
                          className="w-full cursor-pointer text-left p-4 rounded-[1rem] border transition-shadow duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
                          style={{
                            backgroundColor: isActive ? tile.accentBg : 'var(--background)',
                            borderColor: isActive
                              ? tile.accentBorder
                              : 'color-mix(in srgb, var(--foreground) 10%, transparent)',
                            boxShadow: isActive ? `0 4px 16px ${tile.accentBg}` : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = tile.accentBg;
                              e.currentTarget.style.borderColor = tile.accentBorder;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--background)';
                              e.currentTarget.style.borderColor =
                                'color-mix(in srgb, var(--foreground) 10%, transparent)';
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: tile.accentBg,
                                border: `1px solid ${tile.accentBorder}`,
                              }}
                            >
                              <Icon size={14} style={{ color: tile.accentBorder }} />
                            </div>
                            <div>
                              <div
                                className="text-[0.875rem] font-semibold leading-tight"
                                style={{ color: 'var(--foreground)' }}
                              >
                                {tile.name}
                              </div>
                              <div
                                className="text-[0.75rem] leading-snug mt-0.5"
                                style={{ color: 'var(--foreground)', opacity: 0.45 }}
                              >
                                {tile.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current persona button — always visible */}
            <button
              onClick={() => setSwitcherOpen((prev) => !prev)}
              aria-label={`Current persona: ${activeTile.name}. Click to switch.`}
              aria-expanded={switcherOpen}
              className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--foreground) 5%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: activeTile.accentBg,
                  border: `1px solid ${activeTile.accentBorder}`,
                }}
              >
                <ActiveIcon size={15} style={{ color: activeTile.accentBorder }} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div
                  className="text-[0.875rem] font-medium truncate"
                  style={{ color: 'var(--foreground)' }}
                >
                  {activeTile.name}
                </div>
                <div
                  className="text-[0.7rem] truncate"
                  style={{ color: 'var(--foreground)', opacity: 0.4 }}
                >
                  Active persona
                </div>
              </div>
              <ChevronUp
                size={14}
                className={`shrink-0 transition-transform duration-200 ${switcherOpen ? '' : 'rotate-180'}`}
                style={{ color: 'var(--foreground)', opacity: 0.4 }}
                aria-hidden="true"
              />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
