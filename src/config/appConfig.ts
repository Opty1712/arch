export type appConfig = typeof appConfig;

const demoURL = "/demo";

const checkIsDemo = () => window.location.pathname.includes(demoURL);

export const appConfig = {
  apiBaseUrl: "/api",
  isDemo: checkIsDemo(),
  demoURL,
};

export function initDemoModeFromLocation(): void {
  appConfig.isDemo = checkIsDemo();
}
