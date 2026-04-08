'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { isTextUIPart, type UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

// ─── Code Block with Copy Button ─────────────────────────────────────────────

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-800/60 bg-zinc-900/50 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/60">
        <span className="text-[11px] text-zinc-500 font-mono tracking-wide uppercase">
          {language || 'plaintext'}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
          className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-200 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--accent-action)] outline-none rounded px-2 py-0.5"
        >
          <motion.span
            key={copied ? 'check' : 'copy'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check size={11} className="text-[var(--accent-action)]" />
                <span className="text-[var(--accent-action)]">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy
              </>
            )}
          </motion.span>
        </button>
      </div>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          background: 'transparent',
          fontSize: '0.78rem',
          lineHeight: '1.65',
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-geist-mono), monospace' } }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// ─── Markdown component map ───────────────────────────────────────────────────

const markdownComponents: Components = {
  pre: ({ children }) => <>{children}</>,

  code: ({ children, className }) => {
    const language = className?.replace('language-', '') ?? '';
    const isBlock = Boolean(className?.startsWith('language-'));

    if (isBlock) {
      return (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      );
    }

    return (
      <code className="bg-zinc-800/80 text-[var(--accent-action)] px-1.5 py-0.5 rounded text-[0.78rem] font-mono">
        {children}
      </code>
    );
  },

  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-[1.7] text-zinc-200 text-[0.9375rem] tracking-tight">{children}</p>
  ),

  ul: ({ children }) => (
    <ul className="mb-3 ml-5 space-y-1.5 list-disc marker:text-zinc-500 text-[0.9375rem]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-5 space-y-1.5 list-decimal marker:text-zinc-500 text-[0.9375rem]">{children}</ol>
  ),
  li: ({ children }) => <li className="text-zinc-200 leading-[1.7]">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[var(--accent-action)]/40 pl-4 my-3 text-zinc-400 italic">
      {children}
    </blockquote>
  ),

  h1: ({ children }) => (
    <h1 className="text-lg font-semibold text-zinc-100 mb-2 mt-5 first:mt-0 pb-1 border-b border-zinc-800/60">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold text-zinc-100 mb-2 mt-4 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-zinc-200 mb-1.5 mt-3 first:mt-0">{children}</h3>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent-action)] underline underline-offset-2 hover:brightness-125 transition-all"
    >
      {children}
    </a>
  ),

  hr: () => <hr className="border-zinc-800/60 my-5" />,

  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-zinc-800/50">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-800/40">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-zinc-800/50 px-4 py-2 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-zinc-800/30 px-4 py-2.5 text-zinc-300 last:border-b-0">
      {children}
    </td>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-400">{children}</em>,
};

// ─── Animation variants ───────────────────────────────────────────────────────

const userVariants = {
  initial: { opacity: 0, x: 16, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1 },
};

const assistantVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const springTransition = { type: 'spring' as const, stiffness: 420, damping: 32 };
const easeTransition = { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const };

// ─── Component ────────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: UIMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const textContent = message.parts.filter(isTextUIPart).map((p) => p.text).join('');

  return (
    <motion.div
      variants={isUser ? userVariants : assistantVariants}
      initial="initial"
      animate="animate"
      transition={isUser ? springTransition : easeTransition}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`${isUser ? 'Your message' : 'Bittubot response'}`}
    >
      {isUser ? (
        <div className="md:max-w-[75%] px-[1.125rem] py-3 rounded-[1.25rem] bg-[#27272a]/90 backdrop-blur-xl text-zinc-50 text-[0.9375rem] font-medium leading-[1.65] whitespace-pre-wrap shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-white/10">
          {textContent}
        </div>
      ) : (
        <div className="max-w-[85%] text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {textContent}
          </ReactMarkdown>
        </div>
      )}
    </motion.div>
  );
}
