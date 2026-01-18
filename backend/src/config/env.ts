import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
