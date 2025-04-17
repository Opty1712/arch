import { z } from 'zod';

export const AuthErrorSchema = z.object({
    status: z.string(),
    message: z.string()
  });

export type AuthErrorSchemaType = z.infer<typeof AuthErrorSchema>;
