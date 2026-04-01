'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import type { Message } from '@/lib/types';

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  pre: ({ children }) => (
    <pre className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 overflow-x-auto my-3 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    const isBlock = Boolean(className?.startsWith('language-'));
    if (isBlock) {
      return (
        <code className={`${className ?? ''} text-emerald-300 font-mono`}>{children}</code>
      );
    }
    return (
      <code className="bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">
        {children}
      </code>
    );
  },
  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="text-zinc-300">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-emerald-500 pl-4 my-3 text-zinc-400 italic">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-4 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-3 first:mt-0">{children}</h3>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-zinc-700 my-4" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-zinc-700 px-3 py-2 text-left font-semibold bg-zinc-800/60">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-zinc-700 px-3 py-2">{children}</td>
  ),
};

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {isUser ? (
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-md bg-zinc-800 text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      ) : (
        <div className="max-w-[85%] text-zinc-200 text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      )}
    </motion.div>
  );
}
