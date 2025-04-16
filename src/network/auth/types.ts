import { User } from "../user/types";

export interface AuthResponse {
  token: string;
  user: User | null;
}

export interface LoginRequest {
  username: string;
}
