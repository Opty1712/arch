import { appConfig } from "../../config/appConfig";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { User } from "../user/types";
import { adaptAuth } from "./authAdapter";
import { mockLogin } from "./authMocks";
import { AuthResponse, LoginRequest } from "./types";

export async function login(username: string = "demo"): Promise<AuthResponse> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockLogin(username);
    }

    const request: LoginRequest = { username };
    const response = await apiClient.url("/auth/login").post(request).json<{
      user: User;
    }>();

    const authResponse = adaptAuth(response);

    if (authResponse.token) {
      localStorage.setItem("auth_token", authResponse.token);
    }

    return authResponse;
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
        .json<{ user: User }>();

      return {
        token,
        user: response.user,
      };
    } catch (error: any) {
      // Если получили ошибку 401, значит токен недействителен
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

  // Всегда удаляем токен, даже если API запрос не удался
  localStorage.removeItem("auth_token");
}
