# Bittubot V2 Project Details

## Checklist

- [x] **Phase 1: Foundation**
  - [x] Initialize Next.js 14+ App Router project (TS, Tailwind).
  - [x] Configure Biome/ESLint and Prettier.
  - [x] Set up project structure (`components`, `lib`, `app/api`).
- [ ] **Phase 2: Database & Schema**
  - [ ] Set up Neon Serverless Postgres.
  - [x] Configure Drizzle ORM and schema (`users`, `chats`, `messages`).
  - [ ] Test database connectivity and create initial migration.
- [ ] **Phase 3: Premium UI Framework**
  - [ ] Build responsive layout (Sidebar + Main Content Area).
  - [ ] Create generic Chat Input (auto-resizing textarea, submit button).
  - [ ] Design and implement Empty State UI.
- [ ] **Phase 4: AI & Streaming Engine**
  - [ ] Install Vercel AI SDK (`ai` package).
  - [ ] Build `/api/chat` edge route handler.
  - [ ] Integrate `useChat` hook into the main Chat UI components.
- [ ] **Phase 5: Polish & "Anthropic-grade" Features**
  - [ ] Implement robust Markdown parsing with custom styling.
  - [ ] Add Framer Motion animations for messages.
  - [ ] Add keyboard shortcuts and ARIA accessibility labels.
- [ ] **Phase 6: Deployment**
  - [ ] Setup Vercel project and environment variables.
  - [ ] Trigger first production build.
