import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/utils/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { adaptAuth } from "./authAdapter";
import { AuthSchema } from "./mocks/auth.mock.schema";
import { mockLogin } from "./mocks/authMocksApi";
import { AuthResponse, LoginRequest } from "./types";

export async function login(username: string = "demo"): Promise<AuthResponse> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockLogin(username);
    }

    const request: LoginRequest = { username };
    const response = await apiClient
      .url("/auth/login")
      .post(request)
      .json<unknown>();

    const authResponse = adaptAuth(response);

    const validatedResponse = validateResponse(authResponse, AuthSchema);

    if (validatedResponse.token) {
      localStorage.setItem("auth_token", validatedResponse.token);
    }

    return validatedResponse;
  } catch (error) {
    throw handleApiError(error as any);
  }
}

export async function fetchCurrentUser(): Promise<AuthResponse | null> {
  try {
    const token = localStorage.getItem("auth_token");

    if (appConfig.IS_MOCK_MODE) {
      return mockLogin("demo");
    }

    if (!token) {
      return null;
    }

    try {
      const response = await apiClient
        .url("/auth/me")
        .auth(`Bearer ${token}`)
        .get()
        .json<unknown>();

      const authResponse = {
        token,
        user: (response as any).user,
      };

      return validateResponse(authResponse, AuthSchema);
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem("auth_token");
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("auth_token");

  if (token && !appConfig.IS_MOCK_MODE) {
    try {
      await apiClient.url("/auth/logout").auth(`Bearer ${token}`).post().res();
    } catch (error) {
      console.error("Logout API error:", error);
    }
  }

  localStorage.removeItem("auth_token");
}
