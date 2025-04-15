import { adaptUser } from "../user/userAdapter";
import { AuthResponse } from "./types";

export function adaptAuth(rawAuth: any): AuthResponse {
  return {
    token: (rawAuth.token || "").toUpperCase(),
    user: adaptUser(rawAuth.user || {}),
  };
}
