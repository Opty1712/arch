import { appConfig } from "@/config/appConfig";
import { validateResponse } from "@/utils/validateResponse";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { mockRolesApi } from "./mockRolesApi";
import { RolesSchema } from "./mocks/roles.mock.schema";
import { Role } from "./types";

export async function getRoles(): Promise<Role[]> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockRolesApi();
    }

    const response = await apiClient.url("/roles").get().json<unknown>();

    return validateResponse(response, RolesSchema);
  } catch (error) {
    throw handleApiError(error as any);
  }
}
