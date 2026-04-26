import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Wiping existing messages and chats...');
  await sql`DELETE FROM messages`;
  await sql`DELETE FROM chats`;

  console.log('Adding session_id column to chats...');
  await sql`ALTER TABLE chats ADD COLUMN IF NOT EXISTS session_id text NOT NULL DEFAULT ''`;

  // Remove the default so future inserts must supply it
  await sql`ALTER TABLE chats ALTER COLUMN session_id DROP DEFAULT`;

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
