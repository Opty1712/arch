import { z } from 'zod';

export const AuthSchema = z.object({
    token: z.string(),
    user: z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    roleIds: z.array(z.number().int())
  })
  });

export type AuthSchemaType = z.infer<typeof AuthSchema>;
