# UI Overhaul & Polish Specification

This specification dictates the exact aesthetic rules for completely transforming the application's UI from basic Tailwind to a Tier-1, consumer-grade Anthropics/Apple aesthetic.

You must rewrite the UI components applying strict adherence to these rules.

## 1. Global Theming & Backgrounds
*   **Abolish Flat Backgrounds**: The main background must not be pure flat black. Use a subtle, sophisticated gradient or noise overlay.
    *   Example root layout: `bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]`
*   **Theming Swap**: Implement CSS variables to swap accents based on selected `persona`.
    *   Default Persona Accent: Blue/Indigo (e.g., `#3b82f6`).
    *   Bittusan Persona Accent: Emerald/Teal (e.g., `#10b981`).
*   **Typography Base**: Ensure `antialiased` and `tracking-tight` are globally applied to `html/body` for crisp rendering. Font stack should prioritize `Geist`, `Inter`, or `SF Pro Display`.

## 2. Dynamic Centered Layout ("Hero" State vs "Chat" State)
*   **Empty State (0 Messages)**: 
    *   The `ChatInput` container must be perfectly centered vertically and horizontally on the screen using `<motion.div layout>`.
    *   Above the input, display a stunning, glowing, typography-rich greeting (e.g., "How can I help you today?").
    *   The input box should be wider/larger in this state (acting like a global search bar/omnibar). 
*   **Message State (>0 Messages)**:
    *   Upon sending a message, the layout must elegantly animate down.
    *   The Input settles floating slightly *above* the actual bottom of the screen (e.g., `pb-8`), not tethered rigidly to the border, with a soft backdrop blur to separate it from scrolling text behind it.

## 3. High-End Components

### `ChatInput.tsx` (The Omnibar)
*   **Glassmorphism**: Give the input area a glass effect.
    *   `bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]`
*   **Focus State**: When deeply focused, the border should transition smoothly to a slightly glowing accent border `focus-within:ring-1 focus-within:ring-[var(--accent-action)]/50 focus-within:border-[var(--accent-action)]/40`.
*   **The Focus Bug**: Structure the HTML so the entire rounded container is clickable.
    *   ```jsx
        // The container handles the click to focus the textarea seamlessly
        <div onClick={() => textareaRef.current?.focus()} className="flex ...">
            <textarea ... className="flex-1 min-h-[44px] ..." />
        </div>
        ```

### `MessageBubble.tsx` (Typography & Spacing)
*   **Assistant Messages**:
    *   Remove rigid bubble backgrounds. Assistant messages should look like beautifully typeset documents on the page.
    *   Use `prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800/60 prose-pre:shadow-sm`.
    *   Syntax highlighted blocks need sleek headers (e.g., "TypeScript" label separated by a subtle 1px border line) and beautiful copy buttons that don't crowd the code.
*   **User Messages**:
    *   Sophisticated bubbles floating right.
    *   `bg-zinc-800/80 backdrop-blur text-zinc-100 rounded-2xl md:max-w-[75%] px-5 py-3 shadow-md border border-white/5`

### `ChatSidebar.tsx` (Sleek Drawer)
*   **Aesthetic**: It should feel like a macOS sidebar.
    *   `bg-zinc-950/80 backdrop-blur-xl border-r border-white/5`
*   **List Items**: 
    *   Active conversation: `bg-zinc-800/50 text-zinc-100 font-medium`.
    *   Inactive: `text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200 transition-colors`.

## 4. Persona Selection & API Flow
*   Provide a drop-down/toggle top-left (or top-center) to switch between Custom System prompts ("Default" vs "Bittusan").
*   Use standard React state to track this, inject it into the `DefaultChatTransport` body, and parse it in the Route Handler to prepend the rigorous system instructions.

## EXECUTION
Adopt these strict visual tokens exactly. Rebuild the spacing, the padding, the borders, and the colors to emulate absolute top-tier consumer UI.
