import { z } from "zod";
import { AuthSchema } from "./mocks/auth.mock.schema";
import { AuthErrorSchema } from "./mocks/authError.mock.schema";
import { AuthMinSchema } from "./mocks/authMin.mock.schema";

export const combinedAuthSchema = z.union([
  AuthSchema,
  AuthMinSchema,
  AuthErrorSchema,
]);

export type CombinedAuthResponse = z.infer<typeof combinedAuthSchema>;
