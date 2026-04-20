'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronUp, MessageSquare, PenSquare } from 'lucide-react';
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
          className="absolute md:relative flex flex-col h-full overflow-hidden shrink-0 z-50 shadow-2xl md:shadow-none"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Brand Header */}
          <div className="flex items-center justify-between px-4 py-5 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-action-soft)',
                  border: '1px solid var(--accent-action-border)',
                  boxShadow: '0 0 16px var(--accent-action-soft)',
                }}
              >
                <img
                  src={activeTile.portrait}
                  alt={activeTile.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-black tracking-tight leading-none"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-manrope)' }}
                >
                  {activeTile.name}
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.12em] font-bold"
                  style={{ color: 'var(--accent-action)' }}
                >
                  {persona === 'bittusan' ? 'The Organic Curator' : 'The Technical Architect'}
                </span>
              </div>
            </div>
            <button
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg opacity-40 hover:opacity-80 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
              style={{ color: 'var(--foreground)' }}
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* New Chat CTA */}
          <div className="px-3 pb-4 shrink-0">
            <button
              onClick={onNewChat}
              aria-label="Start a new chat"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-[0.875rem] transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
              style={{
                background: 'linear-gradient(135deg, var(--accent-action), var(--accent-dim, var(--accent-action)))',
                color: '#00391e',
                fontFamily: 'var(--font-manrope)',
                boxShadow: '0 8px 20px var(--accent-action-soft)',
              }}
            >
              <PenSquare size={15} />
              New Chat
            </button>
          </div>

          {/* Chat list */}
          <nav
            id="chat-history-list"
            aria-label="Previous chats"
            className="flex-1 overflow-y-auto no-scrollbar px-2 pb-3"
          >
            {chats.length > 0 && (
              <div
                className="px-3 py-2 mb-1 text-[10px] font-bold uppercase tracking-widest opacity-40"
                style={{ color: 'var(--foreground)', fontFamily: 'var(--font-manrope)' }}
              >
                Recent History
              </div>
            )}
            {chats.length === 0 ? (
              <p
                className="text-xs text-center py-6 opacity-35"
                style={{ color: 'var(--foreground)' }}
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
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.875rem] text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
                        style={{
                          backgroundColor: isActive ? 'var(--accent-action-soft)' : 'transparent',
                          borderLeft: isActive ? '2px solid var(--accent-action)' : '2px solid transparent',
                          color: isActive ? 'var(--foreground)' : 'var(--foreground)',
                          opacity: isActive ? 1 : 0.55,
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: isActive ? 600 : 400,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.opacity = '0.85';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.opacity = '0.55';
                        }}
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
            style={{ borderTopColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Portrait picker — slides up */}
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
                      const isActive = persona === tile.id;
                      return (
                        <motion.button
                          key={tile.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.22 }}
                          onClick={() => handlePersonaSelect(tile.id)}
                          className="w-full cursor-pointer text-left rounded-xl overflow-hidden border transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] flex items-center gap-3 p-2"
                          style={{
                            backgroundColor: isActive ? tile.accentBg : 'var(--surface-container)',
                            borderColor: isActive ? tile.accentBorder : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          <img
                            src={tile.portrait}
                            alt={tile.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div
                              className="text-[0.875rem] font-bold truncate"
                              style={{
                                color: isActive ? tile.accentBorder : 'var(--foreground)',
                                fontFamily: 'var(--font-manrope)',
                              }}
                            >
                              {tile.name}
                            </div>
                            <div
                              className="text-[0.75rem] truncate opacity-50"
                              style={{ color: 'var(--foreground)' }}
                            >
                              {tile.description}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Current persona footer — always visible */}
            <button
              onClick={() => setSwitcherOpen((prev) => !prev)}
              aria-label={`Current persona: ${activeTile.name}. Click to switch.`}
              aria-expanded={switcherOpen}
              className="w-full flex items-center gap-3 px-4 py-4 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)]"
              style={{ color: 'var(--foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <img
                src={activeTile.portrait}
                alt={activeTile.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
                style={{ filter: 'grayscale(20%) brightness(1.1)' }}
              />
              <div className="flex-1 text-left min-w-0">
                <div
                  className="text-[0.8125rem] font-bold truncate uppercase tracking-wide"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-manrope)' }}
                >
                  {activeTile.name}
                </div>
                <div
                  className="text-[0.7rem] truncate"
                  style={{ color: 'var(--accent-action)', opacity: 0.8 }}
                >
                  Active Persona
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
