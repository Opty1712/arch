export type appConfig = typeof appConfig;

const apiBaseUrl = "/api";

export const appConfig = {
  apiBaseUrl,
  IS_MOCK_MODE: process.env.IS_MOCK_MODE || false,
  IS_STORYBOOK: process.env.IS_STORYBOOK || false,
};
