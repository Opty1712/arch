import { CombinedAuthResponse } from "./schema";

export function adaptAuth(response: any): CombinedAuthResponse {
  if (response.error || !response.user) {
    return {
      status: "error",
      message: response.error || "User data not found",
    };
  }

  return {
    token: response.token,
    user: {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      roleIds: response.user.roleIds || [],
    },
  };
}
