'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { PanelLeftOpen } from 'lucide-react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import {
  createChatAction,
  getChatMessagesAction,
  getChatsAction,
} from '@/lib/actions';
import type { Chat } from '@/lib/types';
import type { PersonaType } from '@/components/PersonaSelector';
import { PERSONA_TILES } from '@/lib/personas';

// ── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<PersonaType>('vector');
  const [hasSelectedPersona, setHasSelectedPersona] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs so prepareSendMessagesRequest always reads the latest values
  const activeChatIdRef = useRef<string | null>(null);
  activeChatIdRef.current = activeChatId;
  const personaRef = useRef<PersonaType>(persona);
  personaRef.current = persona;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages,
            chatId: activeChatIdRef.current,
            persona: personaRef.current,
          },
        }),
      }),
    [],
  );

  const { messages, sendMessage, stop, status, setMessages } = useChat({ transport });

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat list on mount
  useEffect(() => {
    getChatsAction().then((rows) => setChatList(rows as Chat[]));
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setHasSelectedPersona(false); // return to selection screen
  }, [setMessages]);

  // Sidebar persona switch — does NOT reset to selection screen
  const handlePersonaChange = useCallback((newPersona: PersonaType) => {
    setPersona(newPersona);
  }, []);

  // Landing tile click — sets persona AND advances to hero state
  const handlePersonaSelect = useCallback((id: PersonaType) => {
    setPersona(id);
    setHasSelectedPersona(true);
  }, []);

  const handleSelectChat = useCallback(
    async (id: string) => {
      setActiveChatId(id);
      setHasSelectedPersona(true); // existing chat bypasses selection screen
      const rows = await getChatMessagesAction(id);
      const uiMessages: UIMessage[] = rows.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: m.content }],
      }));
      setMessages(uiMessages);
    },
    [setMessages],
  );

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || (status !== 'ready' && status !== 'error')) return;

    let chatId = activeChatIdRef.current;

    if (!chatId) {
      const title = input.trim().slice(0, 50);
      const chat = await createChatAction(title);
      chatId = chat.id;
      activeChatIdRef.current = chatId;
      setActiveChatId(chatId);
      setChatList((prev) => [chat as Chat, ...prev]);
    }

    const text = input;
    setInput('');
    await sendMessage({ text });

    getChatsAction().then((rows) => setChatList(rows as Chat[]));
  }, [input, status, sendMessage]);

  const isLoading = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;
  const isSelectionPhase = !hasSelectedPersona && !activeChatId && !hasMessages;

  const headerTitle = activeChatId
    ? (chatList.find((c) => c.id === activeChatId)?.title ?? 'Chat')
    : isSelectionPhase
    ? 'Bittubot'
    : persona === 'bittusan'
    ? 'Bittusan'
    : 'Vector';

  return (
    <div
      data-theme={persona}
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden absolute inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <ChatSidebar
        chats={chatList}
        activeChatId={activeChatId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        persona={persona}
        onChangePersona={handlePersonaChange}
      />

      <div
        className="flex flex-col flex-1 min-w-0"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 py-3 shrink-0 border-b"
          style={{ borderBottomColor: 'color-mix(in srgb, var(--foreground) 8%, transparent)' }}
        >
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-1.5 -ml-1.5 rounded-lg opacity-40 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
              style={{ color: 'var(--foreground)' }}
            >
              <PanelLeftOpen size={18} />
            </button>
          )}

          <span
            className="text-[0.9375rem] font-medium truncate"
            style={{ color: 'var(--foreground)', opacity: 0.65 }}
          >
            {headerTitle}
          </span>
        </header>

        {/* Main content — state machine via AnimatePresence */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">

            {isSelectionPhase ? (
              // ── Persona Selection Landing ─────────────────────────────────
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                className="flex-1 flex flex-col items-center justify-center px-6 pb-16"
              >
                <div className="w-full max-w-2xl">
                  {/* Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-12"
                  >
                    <h1
                      className="text-[2rem] font-black tracking-tight mb-2"
                      style={{ color: 'var(--foreground)', fontFamily: 'var(--font-manrope)' }}
                    >
                      Who would you like to speak with?
                    </h1>
                    <p
                      className="text-[0.9375rem] leading-relaxed"
                      style={{ color: 'var(--foreground)', opacity: 0.42 }}
                    >
                      Select an intelligence profile to begin your curated digital session.
                    </p>
                  </motion.div>

                  {/* Portrait cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {PERSONA_TILES.map((tile, i) => (
                      <motion.button
                        key={tile.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.16 + i * 0.09,
                          duration: 0.4,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePersonaSelect(tile.id)}
                        className="cursor-pointer text-left rounded-2xl overflow-hidden border outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] group relative"
                        style={{
                          borderColor: tile.accentBorder,
                          backgroundColor: 'var(--surface-container)',
                        }}
                      >
                        {/* Portrait image */}
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={tile.portrait}
                            alt={`${tile.name} persona portrait`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Gradient overlay */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(to bottom, transparent 40%, var(--surface-container) 100%)`,
                            }}
                          />
                          {/* Principal label */}
                          <div
                            className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-1 rounded"
                            style={{
                              color: tile.accentBorder,
                              backgroundColor: tile.accentBg,
                              border: `1px solid ${tile.accentBorder}`,
                              fontFamily: 'var(--font-manrope)',
                            }}
                          >
                            Principal AI
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-5">
                          <div
                            className="text-[1.25rem] font-black tracking-tight mb-1"
                            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-manrope)' }}
                          >
                            {tile.name}
                          </div>
                          <div
                            className="text-[0.875rem] leading-relaxed mb-4"
                            style={{ color: 'var(--foreground)', opacity: 0.5 }}
                          >
                            {tile.description}
                          </div>
                          <div
                            className="text-[0.8125rem] font-bold uppercase tracking-widest flex items-center gap-1.5"
                            style={{ color: tile.accentBorder, fontFamily: 'var(--font-manrope)' }}
                          >
                            Select Identity →
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

            ) : hasMessages ? (
              // ── Active Chat Screen ──────────────────────────────────────────
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
                    <div className="space-y-6 md:space-y-8 pb-2">
                      {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))}

                      {status === 'submitted' && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-1.5 px-4 py-3">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full animate-bounce"
                                style={{
                                  backgroundColor: 'var(--accent-action)',
                                  opacity: 0.6,
                                  animationDelay: `${i * 0.15}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>

                {/* Floating input above bottom */}
                <div className="shrink-0 px-4 pb-8 pt-3">
                  <div className="max-w-3xl mx-auto">
                    <ChatInput
                      value={input}
                      onChange={setInput}
                      onSubmit={handleSubmit}
                      onStop={stop}
                      isLoading={isLoading}
                      persona={persona}
                    />
                    <p
                      className="text-center text-[0.75rem] mt-2.5"
                      style={{ color: 'var(--foreground)', opacity: 0.3 }}
                    >
                      {persona === 'bittusan' ? 'Bittusan' : 'Vector'} can make mistakes. Verify important information.
                    </p>
                  </div>
                </div>
              </motion.div>

            ) : (
              // ── Hero Screen (persona chosen, no messages yet) ───────────────
              <motion.div
                key="hero"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex-1 flex flex-col items-center justify-center px-4 pb-10"
              >
                <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center space-y-2"
                  >
                    <h2
                      className="text-[1.75rem] font-medium tracking-tight"
                      style={{ color: 'var(--foreground)' }}
                    >
                      How can I help you today?
                    </h2>
                    <p
                      className="text-[0.9375rem] max-w-sm leading-relaxed"
                      style={{ color: 'var(--foreground)', opacity: 0.45 }}
                    >
                      {persona === 'bittusan'
                        ? 'Chatting with Bittusan — your warm, vegan-powered companion.'
                        : 'Chatting with Vector — sharp, precise, built for speed.'}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.13, duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full"
                  >
                    <ChatInput
                      value={input}
                      onChange={setInput}
                      onSubmit={handleSubmit}
                      onStop={stop}
                      isLoading={isLoading}
                      isHero
                      persona={persona}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
