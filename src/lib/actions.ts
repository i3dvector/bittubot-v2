'use server';

import { desc, eq, and } from 'drizzle-orm';
import { db } from './db';
import { chats, messages } from './schema';

export async function createChatAction(title: string, sessionId: string) {
  const [chat] = await db.insert(chats).values({ title, sessionId }).returning();
  return chat;
}

export async function getChatsAction(sessionId: string) {
  return db
    .select()
    .from(chats)
    .where(eq(chats.sessionId, sessionId))
    .orderBy(desc(chats.createdAt));
}

export async function getChatMessagesAction(chatId: string, sessionId: string) {
  // Verify the chat belongs to this session before returning messages
  const [chat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.sessionId, sessionId)));

  if (!chat) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);
}

export async function updateChatTitleAction(chatId: string, title: string) {
  await db.update(chats).set({ title }).where(eq(chats.id, chatId));
}
