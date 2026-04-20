# PHASE 8: Persona Landing Screen Overhaul

## Objective
Provide the user with a distinct, beautiful "Persona Selection" screen when they land on a fresh, empty session (`!activeChatId` && `messages.length === 0`). Instead of defaulting to a specific persona and showing the chat input immediately, the user will see beautifully designed interactive tiles to choose their companion.

## Design Aesthetic
The tiles must adhere to the high-end "Hybrid Claude" aesthetic we established in Phase 6/7. They should use subtle borders, deep drop shadows, and scale gracefully on hover, leveraging the `framer-motion` library.

---

## Technical Specifications for Claude

### 1. State Management Changes (`page.tsx`)
Currently, `persona` defaults to `'bittusan'`. 
- **Change**: Introduce a new state (or derive from existing state) to determine if the user is in the "Selection Phase". 
- If `!activeChatId` and `messages.length === 0` and the user hasn't explicitly picked a persona yet, we are in the `selection` phase.
- You can add a `[hasSelectedPersona, setHasSelectedPersona] = useState(false)` state. This defaults to `false` when the app loads.
- When `handleNewChat` is called (e.g., from the sidebar), reset `hasSelectedPersona` back to `false` so the user goes back to the selection screen!

### 2. The Selection UI (replaces the Empty State Hero)
When `!hasSelectedPersona && !activeChatId && messages.length === 0`:
- **Hide** the `ChatInput` completely.
- **Hide** the current "How can I help you today?" splash.
- **Show** a new Framer Motion container:
  - **Heading**: "Who would you like to speak with?" (Typography: tracking-tight, medium font, subtle fade-in).
  - **Grid**: A flex-col or grid-cols-2 layout holding the Persona Tiles.

### 3. The Persona Tiles
Create two interactive buttons (tiles) mapping to our existing personas:

**Tile 1: Bittusan**
- **Icon**: `Sparkles`
- **Title**: Bittusan
- **Description**: Warm, highly intelligent, and engaging conversational companion. Uncompromisingly vegan.
- **Hover/Active State**: Hovering should inject a subtle hint of her signature green `rgba(46, 184, 114, 0.1)` (or `var(--accent-action-soft)` when active).

**Tile 2: Vector**
- **Icon**: `Bot`
- **Title**: Vector AI
- **Description**: Sharp, concise, and highly effective assistant. Perfect for rapid coding and problem solving.
- **Hover/Active State**: Hovering injects a subtle hint of the Claude-orange `rgba(217, 119, 87, 0.1)`.

**Styling Rules**:
- Use `bg-white dark:bg-[#252525]` for the tile surface.
- Use `border border-black/10 dark:border-white/10`.
- Add `transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`.
- Add `cursor-pointer text-left p-6 rounded-[1.25rem]`.

### 4. The Interaction Flow
When a user clicks a tile:
1. Call `handlePersonaChange(id)` to set the persona.
2. Call `setHasSelectedPersona(true)`.
3. Vercel AI SDK state remains empty. 
4. The UI seamlessly transitions to the `hasSelectedPersona === true` view: revealing the `ChatInput` at the bottom and showing the "How can I help you today?" hero splash (which will automatically borrow the colors of the chosen persona).

---

## Claude Execution Instructions
1. Open `src/app/page.tsx`.
2. Add the `hasSelectedPersona` boolean state.
3. Update `handleNewChat` to `setHasSelectedPersona(false)`.
4. Refactor the `!hasMessages` condition block to return either the **Selection Screen** or the **Hero Chat Screen** depending on `hasSelectedPersona`.
5. Ensure `framer-motion` `layout` and `AnimatePresence` are used so the tiles beautifully dissolve into the chat interface. 
6. Strictly respect the CSS variables and Tailwind classes. DO NOT introduce arbitrary colours; stick to the existing semantic values for `bg-[var(--sidebar-bg)]` and text variables.
