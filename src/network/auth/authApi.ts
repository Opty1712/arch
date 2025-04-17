import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/utils/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { adaptAuth } from "./authAdapter";
import { AuthSchema } from "./mocks/auth.mock.schema";
import { mockLogin } from "./mocks/authMocks";
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

    // Преобразуем ответ к нашей модели данных
    const authResponse = adaptAuth(response);

    // Валидируем ответ по схеме
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

      // Создаем объект ответа авторизации
      const authResponse = {
        token,
        user: (response as any).user,
      };

      // Валидируем ответ по схеме
      return validateResponse(authResponse, AuthSchema);
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
