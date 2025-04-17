import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/network/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { adaptAuth } from "./adaptAuth";
import { mockAuthApi } from "./mockAuthApi";
import { CombinedAuthResponse, combinedAuthSchema } from "./schema";

export async function login(
  username: string = "demo"
): Promise<CombinedAuthResponse> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockAuthApi(username);
    }

    const response = await apiClient
      .url("/auth/login")
      .post({ username })
      .json<unknown>();

    const authResponse = adaptAuth(response);

    const validatedResponse = validateResponse(
      authResponse,
      combinedAuthSchema
    );

    if ("token" in validatedResponse) {
      localStorage.setItem("auth_token", validatedResponse.token);
    } else {
      throw new Error(validatedResponse.message);
    }

    return validatedResponse;
  } catch (error) {
    throw handleApiError(error as any);
  }
}

export async function fetchCurrentUser(): Promise<CombinedAuthResponse | null> {
  try {
    const token = localStorage.getItem("auth_token");

    if (appConfig.IS_MOCK_MODE) {
      return mockAuthApi("demo");
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

      return validateResponse(authResponse, combinedAuthSchema);
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
