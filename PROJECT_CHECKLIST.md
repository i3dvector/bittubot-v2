# Bittubot V2 Project Details

## Checklist

- [x] **Phase 1: Foundation**
  - [x] Initialize Next.js 14+ App Router project (TS, Tailwind).
  - [x] Configure Biome/ESLint and Prettier.
  - [x] Set up project structure (`components`, `lib`, `app/api`).
- [x] **Phase 2: Database & Schema**
  - [x] Set up Neon Serverless Postgres.
  - [x] Configure Drizzle ORM and schema (`users`, `chats`, `messages`).
  - [x] Test database connectivity and create initial migration.
- [x] **Phase 3: Premium UI Framework**
  - [x] Build responsive layout (Sidebar + Main Content Area).
  - [x] Create generic Chat Input (auto-resizing textarea, submit button).
  - [x] Design and implement Empty State UI.
- [x] **Phase 4: AI & Streaming Engine**
  - [x] Install Vercel AI SDK (`ai` package).
  - [x] Build `/api/chat` edge route handler.
  - [x] Integrate `useChat` hook into the main Chat UI components.
- [x] **Phase 5: Polish & "Anthropic-grade" Features**
  - [x] Implement robust Markdown parsing with custom styling.
  - [x] Add Framer Motion animations for messages.
  - [x] Add keyboard shortcuts and ARIA accessibility labels.
- [ ] **Phase 6: Persona & Dynamic Polish**
  - [ ] Add `PersonaSelector` component and store state in `page.tsx`.
  - [ ] Create system prompts and implement passing persona in API payload.
  - [ ] Implement `framer-motion` centered-to-bottom layout for empty state.
  - [ ] Fix ChatInput focus bug via wrapping div onClick handler.
- [ ] **Phase 7: Deployment & Domain Configuration**
  - [ ] Deploy repository to Vercel and input Env Vars.
  - [ ] Configure `bittubot.com` domain in Vercel.
  - [ ] Map Cloudflare DNS settings.
