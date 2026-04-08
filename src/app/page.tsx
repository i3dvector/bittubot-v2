'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { PanelLeftOpen, Sparkles } from 'lucide-react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import PersonaSelector, { type PersonaType } from '@/components/PersonaSelector';
import {
  createChatAction,
  getChatMessagesAction,
  getChatsAction,
} from '@/lib/actions';
import type { Chat } from '@/lib/types';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<PersonaType>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs so prepareSendMessagesRequest always reads the latest values
  const activeChatIdRef = useRef<string | null>(null);
  activeChatIdRef.current = activeChatId;
  const personaRef = useRef<PersonaType>(persona);
  personaRef.current = persona;

  const titleSetRef = useRef<Set<string>>(new Set());

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
  }, [setMessages]);

  const handleSelectChat = useCallback(
    async (id: string) => {
      setActiveChatId(id);
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
      titleSetRef.current.add(chatId);
    }

    const text = input;
    setInput('');
    await sendMessage({ text });

    getChatsAction().then((rows) => setChatList(rows as Chat[]));
  }, [input, status, sendMessage]);

  const isLoading = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;

  return (
    <div data-theme={persona} className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <ChatSidebar
        chats={chatList}
        activeChatId={activeChatId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}

          <span className="text-sm font-semibold text-zinc-300 mr-auto">
            {activeChatId
              ? (chatList.find((c) => c.id === activeChatId)?.title ?? 'Chat')
              : 'Bittubot'}
          </span>

          <PersonaSelector persona={persona} onChange={setPersona} />
        </header>

        {/* Content — vertically centered splash OR scrollable chat */}
        <motion.div
          layout
          className={`flex-1 flex flex-col min-h-0 ${
            hasMessages ? 'justify-between' : 'justify-center'
          }`}
        >
          {hasMessages ? (
            /* Chat messages */
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full px-4 py-6">
                <div className="space-y-6 pb-2">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}

                  {status === 'submitted' && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 px-4 py-3">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          ) : (
            /* Centered splash greeting */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center gap-5 text-center px-4 pb-6"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--accent-action-soft)',
                  border: '1px solid var(--accent-action-border)',
                }}
              >
                <Sparkles size={24} style={{ color: 'var(--accent-action)' }} />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-semibold text-zinc-100">
                  How can I help you today?
                </h2>
                <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                  Ask me anything — write code, brainstorm ideas, or just have a conversation.
                </p>
              </div>
            </motion.div>
          )}

          {/* Input — always at the bottom */}
          <div className="shrink-0 px-4 py-4 border-t border-zinc-800">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                onStop={stop}
                isLoading={isLoading}
              />
              <p className="text-center text-xs text-zinc-600 mt-2">
                Bittubot can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
