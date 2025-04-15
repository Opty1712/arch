import { mockFetchUser } from "../user/userMocks";
import { AuthResponse } from "./types";

export async function mockLogin(username: string): Promise<AuthResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const userId =
    Math.abs(
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3
    ) + 1;

  const user = await mockFetchUser(userId);

  return {
    token: `mock-token-${Date.now()}`,
    user,
  };
}
