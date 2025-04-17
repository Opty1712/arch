import { validateResponse } from "@/utils/validateResponse";
import { AuthResponse } from "../types";
import authData from "./auth.mock.json";
import { AuthSchema } from "./auth.mock.schema";

export async function mockLogin(username: string): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const validatedAuth = validateResponse(authData, AuthSchema);

  const response = {
    token: validatedAuth.token,
    user: {
      ...validatedAuth.user,
      name:
        username !== "demo"
          ? `${username.charAt(0).toUpperCase()}${username.slice(1)}`
          : validatedAuth.user.name,
    },
  };

  localStorage.setItem("auth_token", response.token);

  return response;
}
