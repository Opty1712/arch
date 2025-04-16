import { appConfig } from "../../config/appConfig";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { RawUser, User } from "./types";
import { adaptUser } from "./userAdapter";
import { mockFetchUser } from "./userMocks";

export async function getUser(userId: number): Promise<User> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockFetchUser(userId);
    }

    const response = (await apiClient
      .url(`/users/${userId}`)
      .get()
      .json()) as RawUser;
    return adaptUser(response);
  } catch (error) {
    throw handleApiError(error as any);
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return Promise.all([
        mockFetchUser(1),
        mockFetchUser(2),
        mockFetchUser(3),
      ]);
    }

    const response = await apiClient.url("/users").get().json();
    return Array.isArray(response) ? response.map(adaptUser) : [];
  } catch (error) {
    throw handleApiError(error as any);
  }
}

export async function updateUserRoles(
  userId: number,
  roleIds: number[]
): Promise<User> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      const user = await mockFetchUser(userId);
      user.roleIds = roleIds;
      return user;
    }

    const response = (await apiClient
      .url(`/users/${userId}/roles`)
      .put({ roleIds })
      .json()) as RawUser;

    return adaptUser(response);
  } catch (error) {
    throw handleApiError(error as any);
  }
}
