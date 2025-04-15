import { appConfig } from "../../config/appConfig";
import { apiClient } from "../api";
import { adaptOmicronData } from "./omicronAdapter";
import { mockFetchOmicronData } from "./omicronMocks";
import { OmicronData } from "./types";

export async function fetchOmicronData(): Promise<OmicronData[]> {
  if (appConfig.isDemo) {
    return mockFetchOmicronData();
  }

  const response = await apiClient.url("/omicron").get().json();

  return Array.isArray(response) ? response.map(adaptOmicronData) : [];
}
