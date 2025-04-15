import { mockLogin } from "./authMocks";
import { AuthResponse } from "./types";

export async function login(username: string): Promise<AuthResponse> {
  return mockLogin(username);
}
