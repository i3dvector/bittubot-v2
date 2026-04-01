# Bittubot V2: UI/UX & Architecture Design Specification

This document serves as the exact technical and aesthetic blueprint for Claude to implement Bittubot V2.

## 1. Visual Aesthetics & UI/UX (The "Anthropic Wow Factor")

To impress the Anthropic hiring team, the UI must feel incredibly polished, responsive, and minimalistic.
* **Palette**: Monochromatic core (Zinc/Slate) with a single vibrant accent color to represent the Persona (e.g., Emerald/Teal).
  * Background: `bg-zinc-950` (Dark Mode default) or `bg-white` (Light Mode).
  * Typography: Inter/Geist (Sans-serif) for UI elements.
* **Animations**: All micro-interactions must use `framer-motion`.
  * Message reveal: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}`
  * Button hovers: Slight scale up `hover:scale-105` and background transitions.
* **Layout**: A classic 2-pane layout (collapsible sidebar + main chat area). The main chat width should be constrained (e.g., `max-w-3xl`) for optimal reading length.

## 2. Core Components

### `ChatSidebar` (Client Component)
* Displays historical chats.
* Clean "New Chat" button prominently featured at the top.
* Uses modern scrolling without ugly default browser scrollbars.

### `ChatInput` (Client Component)
* Must use an auto-resizing `<textarea>` that grows with multi-line inputs but caps at a `max-height` (e.g., `max-h-48`) before scrolling internally.
* Must support `Enter` to submit, and `Shift+Enter` for a newline.
* Include a floating circular "Send" icon button (using Lucide icons) inside the Input area.

### `MessageBubble` (Client Component)
* Determines styling based on `message.role` (user vs. assistant).
* **Assistant**: Minimalistic, clean text, richly rendered Markdown.
* **User**: Distinct background bubble (e.g., `bg-zinc-800` in dark mode), gently rounded borders, aligned nicely.
* Renders markdown securely using `react-markdown` with `remark-gfm` and syntax highlighting for code blocks.

## 3. Database Schema (Neon + Drizzle ORM)

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const chats = pgTable('chats', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  chatId: uuid('chat_id').references(() => chats.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## 4. Edge API & AI Connection

* **Endpoint**: `POST /api/chat`
* **Model**: Use `groq` provider locally with the `llama3-8b-8192` model for ultra-fast, free token generation during development.
* **SDK**: Leverage Vercel AI SDK (`ai` and `@ai-sdk/openai` configured with Groq base URL).
* **Streaming**: The endpoint must stream the response back using `streamText()` to the `useChat` hook on the frontend for zero-latency UX.

## 5. Accessibility Requirements (a11y)
* All interactive elements must have `aria-label`.
* Use explicit focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-500`) instead of relying on default browser outlines.
