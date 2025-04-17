import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RoleManagementPage } from "@/pages/RoleManagementPage";
import { UserPage } from "@/pages/UserPage";
import { observer } from "mobx-react-lite";
import { Route, Switch } from "wouter";
import { APP_ROUTES } from "./routes";

export const Router = observer(() => {
  return (
    <Switch>
      <Route path={APP_ROUTES["/"]} component={RoleManagementPage} />
      <Route path={APP_ROUTES["/roles"]} component={RoleManagementPage} />
      <Route path={APP_ROUTES["/user/:id"]} component={UserPage} />
      <Route path={APP_ROUTES["/login"]} component={LoginPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
});
