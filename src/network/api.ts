import wretch from "wretch";
import { appConfig } from "../config/appConfig";

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
};

export const apiClient = wretch(appConfig.apiBaseUrl).errorType("json");
