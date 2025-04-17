import { z } from 'zod';

export const CurrentUserSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    roleIds: z.array(z.number().int())
  });

export type CurrentUserSchemaType = z.infer<typeof CurrentUserSchema>;
