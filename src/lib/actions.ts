'use server';

import { desc, eq } from 'drizzle-orm';
import { db } from './db';
import { chats, messages } from './schema';

export async function createChatAction(title: string) {
  const [chat] = await db.insert(chats).values({ title }).returning();
  return chat;
}

export async function getChatsAction() {
  return db.select().from(chats).orderBy(desc(chats.createdAt));
}

export async function getChatMessagesAction(chatId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt);
}

export async function updateChatTitleAction(chatId: string, title: string) {
  await db.update(chats).set({ title }).where(eq(chats.id, chatId));
}
