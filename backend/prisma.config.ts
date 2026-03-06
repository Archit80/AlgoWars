import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  datasource: {
    // CLI commands like `prisma db push` and `prisma migrate` require a direct connection,
    // not a transaction pooler (port 6543). Use DIRECT_URL (port 5432).
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
