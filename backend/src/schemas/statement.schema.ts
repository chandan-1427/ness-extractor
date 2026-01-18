import { z } from 'zod';

export const statementInputSchema = z.object({
  text: z.string().min(10),
});
