import { appConfig } from "../../config/appConfig";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { adaptRoles } from "./roleAdapter";
import { mockFetchRoles } from "./roleMocks";
import { Role } from "./types";

export async function getRoles(): Promise<Role[]> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockFetchRoles();
    }

    const response = await apiClient.url("/roles").get().json();
    return adaptRoles(Array.isArray(response) ? response : []);
  } catch (error) {
    throw handleApiError(error as any);
  }
}
