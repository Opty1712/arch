import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/utils/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import {
  mockCurrentUserApi,
  mockUpdateCurrentUser,
} from "./mockCurrentUserApi";
import { CurrentUserSchema } from "./mocks/currentUser.mock.schema";
import { User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockCurrentUserApi();
    }

    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const response = await apiClient
      .url("/users/me")
      .auth(`Bearer ${token}`)
      .get()
      .json<unknown>();

    return validateResponse(response, CurrentUserSchema);
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export async function updateCurrentUserProfile(profileData: {
  name?: string;
  email?: string;
}): Promise<User> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockUpdateCurrentUser(profileData);
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient
      .url("/users/me")
      .auth(`Bearer ${token}`)
      .put(profileData)
      .json<unknown>();

    return validateResponse(response, CurrentUserSchema);
  } catch (error) {
    throw handleApiError(error as any);
  }
}
