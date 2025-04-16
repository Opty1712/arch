import { AuthResponse } from "./types";

export function adaptAuth(response: any): AuthResponse {
  return {
    token: response.token,
    user: response.user
      ? {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          roleIds: response.user.roleIds || [],
        }
      : null,
  };
}
