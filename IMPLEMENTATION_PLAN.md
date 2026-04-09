# Bittubot V2 — Implementation Plan

## Goal
Build a high-performance, ultra-premium consumer-grade AI chat interface. Features real-time streaming, persistent conversation history, a persona system, and a polished, accessible UI.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion, Lucide React |
| **AI** | Vercel AI SDK v6 (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`) |
| **LLM** | Groq API — `llama-3.3-70b-versatile` (fast, free tier) |
| **Database** | Neon Serverless Postgres + Drizzle ORM |
| **Hosting** | Vercel |

## Architecture Overview

### Core Data Flow
1. User selects a persona on the landing screen → sets `persona` state
2. `ChatInput` sends message via `useChat` (AI SDK v6) with `DefaultChatTransport`
3. Transport injects `{ chatId, persona }` into every request body
4. `/api/chat` reads `persona`, picks system prompt, streams via Groq
5. `onFinish` persists both user + assistant messages to Neon DB

### Persona System
Two personas share the same LLM model but receive different system prompts:
- **Bittusan** — warm, Indian, vegan-forward conversationalist
- **Vector AI** — sharp, concise, coding-focused assistant

CSS variables (`--accent-action`, `--accent-action-soft`, `--accent-action-border`) are swapped via `data-theme` attribute on the root div, updating all accent colors globally.

---

## Phases

### Phase 1: Foundation ✅
- Scaffolded Next.js 16 App Router with TypeScript and Tailwind CSS v4
- Configured absolute imports, ESLint, Geist font

### Phase 2: Database & Schema ✅
- Provisioned Neon Serverless Postgres (Drizzle ORM)
- Schema: `chats(id, title, createdAt)` + `messages(id, chatId, role, content, createdAt)`
- `drizzle.config.ts` loads `.env.local` via dotenv (drizzle-kit doesn't auto-load it)

### Phase 3: Premium UI Framework ✅
- Responsive split layout: collapsible sidebar + main chat area
- `ChatSidebar` — framer-motion slide, ARIA nav, chat history list
- `ChatInput` — auto-resizing textarea, glassmorphism styling, focus ring
- `MessageBubble` — user bubble (right) + assistant prose (full-width)

### Phase 4: AI & Streaming Engine ✅
- Integrated Vercel AI SDK v6 (`useChat`, `DefaultChatTransport`)
- `/api/chat` route: `convertToModelMessages` → `streamText` → `toUIMessageStreamResponse`
- Dynamic body injection via `prepareSendMessagesRequest` + refs (avoids stale closures)
- DB persistence in `onFinish` callback

### Phase 5: Polish & Accessibility ✅
- `react-syntax-highlighter` (Prism + vscDarkPlus) with copy button + animated icon swap
- Framer Motion message entrance: spring (user), ease (assistant)
- Full ARIA on `ChatInput` (role, aria-busy, aria-describedby) and `ChatSidebar` (nav, aria-current)

### Phase 6: Persona Theming ✅
- CSS variable token system: `--accent-action`, `--accent-action-soft`, `--accent-action-border`
- `data-theme` attribute toggles between Default (blue/copper) and Bittusan (emerald) palettes
- `PersonaSelector` dropdown in sidebar; persona injected into API request body
- Full `bittusan_persona.md` system prompt for Bittusan; sharp Vector AI prompt

### Phase 7: UI Overhaul ✅
- Semantic CSS variable theming (light/dark adaptive via `prefers-color-scheme`)
- `ChatInput` glassmorphism: `bg-[var(--sidebar-bg)] backdrop-blur`, focus glow ring
- `MessageBubble`: user bubbles (`bg-[var(--bubble-user)]`), assistant prose (full-width)
- `ChatSidebar`: `bg-[var(--sidebar-bg)]` + theme-aware borders
- Radial gradient overlay on app background; custom scrollbars; `tracking-tight` globally

### Phase 8: Persona Landing Screen ✅
- **Selection state** (`!hasSelectedPersona && !activeChatId && !messages`): ChatInput hidden; two persona tiles presented (Bittusan + Vector AI) with brand-colored hover glows
- `AnimatePresence mode="wait"` transitions cleanly between three states: selection → hero → chat
- `handleNewChat` resets `hasSelectedPersona` → returns user to selection screen
- `handleSelectChat` (opening existing chat) sets `hasSelectedPersona(true)` — bypasses selection

### Phase 9: Persona Switcher & Dynamic Placeholders ✅
- **Sidebar persona switcher**: replaces old dropdown with the same tile UI as the landing screen. A persistent button at the sidebar bottom shows the active persona; clicking it reveals an animated slide-up panel with both persona tiles.
- **Shared tile definitions**: `src/lib/personas.ts` exports `PERSONA_TILES` and `PERSONA_PLACEHOLDERS` — single source of truth used by both the landing screen and the sidebar switcher.
- **Dynamic placeholders**: `ChatInput` accepts a `persona` prop. On each persona change a random persona-appropriate placeholder is picked (e.g. *"Kya baat hai? What's on your mind?"* for Bittusan, *"Fire away — I'm fast."* for Vector AI).

---

## Key Technical Notes

### AI SDK v6 Breaking Changes (vs v4/v5)
- `ai/react` subpath removed → install `@ai-sdk/react` separately
- `UIMessage.parts[]` replaces `.content` string; use `isTextUIPart` to extract text
- `useChat` returns `sendMessage` (not `handleSubmit`); no built-in `input` state
- `convertToModelMessages` is **async** (returns `Promise<ModelMessage[]>`)
- Body injection: use `prepareSendMessagesRequest` + refs (not state, avoids stale reads)

### File Map
```
src/
├── app/
│   ├── page.tsx          # Root page: state machine (selection/hero/chat)
│   ├── layout.tsx        # Geist font, antialiased, tracking-tight
│   ├── globals.css       # CSS variables, radial gradient, scrollbars
│   └── api/chat/
│       └── route.ts      # Streaming endpoint, persona → system prompt
├── components/
│   ├── ChatSidebar.tsx   # Collapsible sidebar + persona tile switcher
│   ├── ChatInput.tsx     # Glassmorphism omnibar, dynamic placeholder
│   ├── MessageBubble.tsx # Markdown rendering, syntax highlighting
│   └── PersonaSelector.tsx # (Legacy dropdown — type source for PersonaType)
└── lib/
    ├── personas.ts       # PERSONA_TILES, PERSONA_PLACEHOLDERS, pickPlaceholder
    ├── schema.ts         # Drizzle schema: chats + messages
    ├── db.ts             # Neon HTTP driver + Drizzle client
    ├── actions.ts        # Server actions: CRUD for chats/messages
    └── types.ts          # Chat type
```
