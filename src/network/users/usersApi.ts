import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/utils/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { UserSchema } from "./mocks/user.mock.schema";
import { UsersSchema } from "./mocks/users.mock.schema";
import { mockUserApi, mockUsersApi } from "./mockUserApi";
import { User } from "./types";

export async function getUser(userId: number): Promise<User> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockUserApi(userId);
    }

    const response = await apiClient
      .url(`/users/${userId}`)
      .get()
      .json<unknown>();
    return validateResponse(response, UserSchema);
  } catch (error) {
    throw handleApiError(error as any);
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockUsersApi();
    }

    const response = await apiClient.url("/users").get().json<unknown>();
    return validateResponse(response, UsersSchema);
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
      const user = await mockUserApi(userId);
      const updatedUser = { ...user, roleIds };
      return validateResponse(updatedUser, UserSchema);
    }

    const response = await apiClient
      .url(`/users/${userId}/roles`)
      .put({ roleIds })
      .json<unknown>();

    return validateResponse(response, UserSchema);
  } catch (error) {
    throw handleApiError(error as any);
  }
}
