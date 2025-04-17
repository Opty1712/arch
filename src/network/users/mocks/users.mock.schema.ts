import { z } from 'zod';

export const UsersSchema = z.array(z.object({
    id: z.number().int(),
    name: z.string(),
    email: z.string().email(),
    roleIds: z.array(z.number().int())
  }));

export type UsersSchemaType = z.infer<typeof UsersSchema>;
