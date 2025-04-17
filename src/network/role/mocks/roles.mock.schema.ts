import { z } from 'zod';

export const RolesSchema = z.array(z.object({
    id: z.number().int(),
    name: z.string(),
    description: z.string()
  }));

export type RolesSchemaType = z.infer<typeof RolesSchema>;
