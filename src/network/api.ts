import wretch from "wretch";
import { appConfig } from "../config/appConfig";

export const apiClient = wretch(appConfig.apiBaseUrl);
