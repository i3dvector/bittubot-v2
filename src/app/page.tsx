'use client';

import { useEffect, useRef, useState } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import ChatSidebar from '@/components/ChatSidebar';
import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import EmptyState from '@/components/EmptyState';
import type { Chat, Message } from '@/lib/types';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewChat = (): string => {
    const id = crypto.randomUUID();
    const newChat: Chat = { id, title: 'New Chat', createdAt: new Date() };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setMessages([]);
    return id;
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setMessages([]); // Phase 4: load messages from DB
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (!activeChatId) createNewChat();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    // Phase 4: trigger AI streaming response here
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        onNewChat={createNewChat}
        onSelectChat={handleSelectChat}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 shrink-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <span className="text-sm font-semibold text-zinc-300">
            {activeChatId
              ? (chats.find((c) => c.id === activeChatId)?.title ?? 'Chat')
              : 'Bittubot'}
          </span>
        </header>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full h-full px-4 py-6">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-6 pb-2">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 py-4 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
            <p className="text-center text-xs text-zinc-600 mt-2">
              Bittubot can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
