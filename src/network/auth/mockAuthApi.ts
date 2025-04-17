import { validateResponse } from "@/utils/validateResponse";
import authData from "./mocks/auth.mock.json";
import { AuthSchema } from "./mocks/auth.mock.schema";
import { CombinedAuthResponse } from "./schema";

export async function mockAuthApi(_: string): Promise<CombinedAuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const validatedAuth = validateResponse(authData, AuthSchema);
  localStorage.setItem("auth_token", validatedAuth.token);

  return validatedAuth;
}
