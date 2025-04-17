import { z } from 'zod';

export const AuthMinSchema = z.object({
    token: z.string(),
    user: z.object({
    id: z.number().int(),
    name: z.string()
  })
  });

export type AuthMinSchemaType = z.infer<typeof AuthMinSchema>;
