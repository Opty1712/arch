import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RoleManagementPage } from "@/pages/RoleManagementPage";
import { UserPage } from "@/pages/UserPage";
import { observer } from "mobx-react-lite";
import { Route, Switch } from "wouter";

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
    path: "/login",
    component: LoginPage,
    exact: true,
  },
  {
    path: "/",
    component: RoleManagementPage,
    exact: true,
  },
] as const;

AppRoutes = routes.reduce<AppRoutesType>((accumulator, current) => {
  accumulator[current.path] = current.path;
  return accumulator;
}, {} as AppRoutesType);

const RouterComponent = () => {
  return (
    <Switch>
      {routes.map(({ path, component }) => (
        <Route key={path} path={path} component={component} />
      ))}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export const Router = observer(RouterComponent);
