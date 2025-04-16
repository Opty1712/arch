import { appConfig } from "../../config/appConfig";
import { apiClient } from "../api";
import { handleApiError } from "../errorHandler";
import { adaptOmicronData } from "./omicronAdapter";
import { mockFetchOmicronData } from "./omicronMocks";
import { OmicronData } from "./types";

export async function getOmicronData(): Promise<OmicronData[]> {
  try {
    if (appConfig.IS_MOCK_MODE) {
      return mockFetchOmicronData();
    }

    const response = await apiClient.url("/omicron").get().json();
    return Array.isArray(response) ? response.map(adaptOmicronData) : [];
  } catch (error) {
    throw handleApiError(error as any);
  }
}
