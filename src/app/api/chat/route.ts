import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { db } from '@/lib/db';
import { messages as messagesTable } from '@/lib/schema';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  const { messages, chatId } = (await req.json()) as {
    messages: UIMessage[];
    chatId: string | null;
  };

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system:
      'You are Bittubot, a sharp and helpful AI assistant. ' +
      'Be concise and clear. Use markdown formatting for code, lists, and structure when it helps readability.',
    messages: modelMessages,
    onFinish: async ({ text }) => {
      if (!chatId) return;

      // Find the last user message to persist
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      if (!lastUserMsg) return;

      const userText = lastUserMsg.parts
        .filter((p) => p.type === 'text')
        .map((p) => (p as { type: 'text'; text: string }).text)
        .join('');

      await db.insert(messagesTable).values([
        { chatId, role: 'user', content: userText },
        { chatId, role: 'assistant', content: text },
      ]);
    },
  });

  return result.toUIMessageStreamResponse();
}
