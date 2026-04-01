# Bittubot V2 Implementation Plan

## Goal
Build a high-performance, ultra-premium consumer-grade AI chat interface (Bittubot V2) to serve as a portfolio project for an AI Engineering role at Anthropic. It will feature real-time streaming, branching conversations, and an accessible, polished UI.

## Technology Stack

* **Frontend:** Next.js 14+ (App Router), React, TypeScript.
* **Styling & UI:** Tailwind CSS, Radix UI (for accessibility primitives), Framer Motion (for micro-animations), Lucide React (icons).
* **AI Integration:** Vercel AI SDK (for smooth token streaming and state management).
* **LLM:** Groq API (Llama 3) for the initial build to utilize existing keys and ensure ultra-fast, free streaming. We will migrate to Anthropic API (Claude 3.5 Sonnet) before final deployment to align with the Anthropic job requirements.
* **Database:** Neon Serverless Postgres (A perfect drop-in replacement for Supabase's database with a generous free tier). We'll use Drizzle ORM to interact with it.
* **Hosting:** Vercel (zero-cost, edge-optimized for Next.js).

## Architecture Overview

### User Experience (The "Wow" Factor)
1. **Zero-Jank Token Streaming:** Text streams smoothly without stuttering and maintains scroll state.
2. **Generative UI / Rich Parsing:** Custom markdown components (syntax-highlighted code blocks, beautifully styled tables and quotes).
3. **Accessibility (a11y) & Keyboard Navigation:** Full keyboard support (e.g., `Cmd+K` or `Ctrl+K` for a command menu, `Up` arrow to edit previous prompt). This directly addresses Anthropic's job requirements.
4. **Chat Sidebar & History:** Grouped by date (Today, Previous 7 Days, etc.) with the ability to manage threads.

### Data Models
* **`User`**: Stores user preferences and identity.
* **`Chat`**: `id`, `title`, `createdAt`, `updatedAt`, `userId`. Contains high-level session data.
* **`Message`**: `id`, `chatId`, `role` (user, assistant, system), `content`, `createdAt`.

## Proposed Phases

### Phase 1: Foundation
Initialize the Next.js App Router project. Configure Tailwind, TypeScript, ESLint, and absolute imports.

### Phase 2: Database & Schema
Provision a free Neon DB instance. Configure Drizzle ORM and run initial migrations for the `Chat` and `Message` tables.

### Phase 3: Premium UI Framework
Implement the responsive layout wrapper. Build the chat interface (auto-resizing text area, floating submit button, sleek message bubbles, and empty state UI).

### Phase 4: AI & Streaming Engine
Integrate the Vercel AI SDK and connect the Anthropic (or Groq) API route handler. Ensure server-sent events (SSE) stream text fluidly to the client.

### Phase 5: Polish & "Anthropic-grade" Features
Integrate `react-markdown`. Add Framer Motion for entering/exiting message animations. Add robust keyboard accessibility. Deploy to Vercel.
