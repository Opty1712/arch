const routes = ["/roles", "/user/:id", "/login", "/"] as const;

export const APP_ROUTES = Object.fromEntries(
  routes.map((route) => [route, route])
) as { [K in (typeof routes)[number]]: K };

export type AppRoutes = typeof APP_ROUTES;
