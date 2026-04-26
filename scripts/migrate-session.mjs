import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Adding persona column to chats...');
  await sql`ALTER TABLE chats ADD COLUMN IF NOT EXISTS persona text NOT NULL DEFAULT 'vector'`;
  await sql`ALTER TABLE chats ALTER COLUMN persona DROP DEFAULT`;

  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
