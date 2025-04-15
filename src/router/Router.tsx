import { appConfig } from "@/config/appConfig";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Route, Switch } from "wouter";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RoleManagementPage } from "../pages/RoleManagementPage";
import { UserPage } from "../pages/UserPage";
import { userStore } from "../stores/userStore";

type RoutePaths = (typeof routes)[number]["path"];

type AppRoutesType = Record<RoutePaths, RoutePaths>;

export let AppRoutes = {} as AppRoutesType;

const routes = [
  {
    path: "/roles",
    component: RoleManagementPage,
    exact: true,
  },
  {
    path: "/user/:id",
    component: UserPage,
    exact: true,
  },
  {
    path: "/",
    component: () => {
      // Redirect home to roles page
      window.location.replace(AppRoutes["/roles"]);
      return null;
    },
    exact: true,
  },
] as const;

AppRoutes = routes.reduce<AppRoutesType>((accumulator, current) => {
  accumulator[current.path] = current.path;
  return accumulator;
}, {} as AppRoutesType);

const RouterComponent = () => {
  if (!userStore.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Switch>
      {routes.map(({ path, component }) => (
        <Fragment key={path}>
          <Route path={path} component={component} />
          <Route path={`${appConfig.demoURL}${path}`} component={component} />
        </Fragment>
      ))}

      <Route component={NotFoundPage} />
    </Switch>
  );
};

export const Router = observer(RouterComponent);
