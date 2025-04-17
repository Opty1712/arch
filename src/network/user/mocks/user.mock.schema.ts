import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    roleIds: z.array(z.number().int())
  });

export type UserSchemaType = z.infer<typeof UserSchema>;
