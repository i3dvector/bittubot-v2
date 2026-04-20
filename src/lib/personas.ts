import { Bot, Sparkles } from 'lucide-react';
import type { PersonaType } from '@/components/PersonaSelector';

// ── Shared persona tile definitions ─────────────────────────────────────────
// Used by the landing selection screen AND the sidebar switcher.

export const PERSONA_TILES = [
  {
    id: 'bittusan' as PersonaType,
    name: 'Bittusan',
    description:
      'Warm, highly intelligent, and engaging conversational companion. Uncompromisingly vegan.',
    icon: Sparkles,
    accentBg: 'rgba(46, 184, 114, 0.08)',
    accentBorder: 'rgba(46, 184, 114, 0.3)',
    portrait: '/images/bittusan.png',
  },
  {
    id: 'vector' as PersonaType,
    name: 'Vector',
    description:
      'Sharp, concise, and highly effective assistant. Perfect for rapid coding and problem solving.',
    icon: Bot,
    accentBg: 'rgba(237, 135, 102, 0.08)',
    accentBorder: 'rgba(237, 135, 102, 0.3)',
    portrait: '/images/vector.jpg',
  },
] as const;

// ── Persona-specific placeholder copy for the chat input ────────────────────

export const PERSONA_PLACEHOLDERS: Record<PersonaType, string[]> = {
  bittusan: [
    "Kya baat hai? What's on your mind?",
    'Talk to me, yaar…',
    "What's cooking today?",
    'Tell me what is up…',
    'Share away — I am all ears 🌱',
  ],
  vector: [
    'What problem can I solve for you?',
    'Ask me anything…',
    'Fire away — I am fast.',
    'What do you need?',
    'Drop your question here…',
  ],
};

export function pickPlaceholder(persona: PersonaType): string {
  const options = PERSONA_PLACEHOLDERS[persona];
  return options[Math.floor(Math.random() * options.length)];
}
