# Phase 6 & 7 Execution Specification

## 1. ChatInput Focus Fix
In `src/components/ChatInput.tsx`, wrap the textarea inside its curved padding container with an `onClick` that guarantees focus.
```tsx
const handleContainerClick = () => {
  textareaRef.current?.focus();
};
// Add onClick to the parent rounded border div
<div onClick={handleContainerClick} className="...">
  <textarea ref={textareaRef} ... className="... h-full w-full" />
</div>
```

## 2. Dynamic Centered Layout ("Splash" to "Chat")
In `src/app/page.tsx`, we want the chatbox to be vertically and horizontally centered when no messages exist, and smoothly slide to the bottom after the first message.
1. Wrap the message list and input areas in a `<motion.div layout>` from `framer-motion`. 
2. Leverage CSS layout techniques (like conditionally switching `justify-center` verses `justify-between`) depending on `messages.length === 0`. 
3. Remove `EmptyState` component or weave its greeting text directly into the centered splash screen above the ChatInput.

## 3. Persona Theming
**State:**
Create a state in `page.tsx`:
```tsx
type PersonaType = 'default' | 'bittusan';
const [persona, setPersona] = useState<PersonaType>('default');
```

**Header UI:**
Add a dropdown or toggle button in the header (beside the sidebar opener) that lets the user switch between "Default AI" and "Bittusan". Pass this state to the `ChatSidebar` as well if you want the "New Chat" logic to be aware of it, or keep it explicitly global in the URL search params. Keeping it as a `useState` is fine for now.

**Theming Effect:**
Pass the `persona` as a data attribute to the wrapper element: `<div data-theme={persona} ...>`
In `src/app/globals.css`:
```css
:root {
  --accent-action: #3b82f6; /* Blue for default */
}
[data-theme='bittusan'] {
  --accent-action: #10b981; /* Emerald for Bittusan */
}
```
Switch out static `bg-emerald-500` classes in components (like your Send button) to use the CSS variable: `className="bg-[var(--accent-action)]"`.

**Backend Prompting:**
Modify the `DefaultChatTransport` payload in `page.tsx`:
```tsx
prepareSendMessagesRequest: ({ messages }) => ({
  body: { messages, chatId: activeChatIdRef.current, persona },
})
```
Update `src/app/api/chat/route.ts` to read `persona` from the `req.json()` body and dynamically inject the Persona system prompt (from `bittusan_persona.md` logic or generic helpful logic) into the `messages` array or `system` param of `streamText`.

## 4. Deployment (To be done manually by user)
1. Commit all files and push branch to GitHub.
2. Connect Vercel to GitHub.
3. Apply `DATABASE_URL` and `GROQ_API_KEY` into Vercel Settings -> Environment Variables.
4. Add custom domain (`bittubot.com`) via Vercel Dashboard and map Cloudflare CNAME.
