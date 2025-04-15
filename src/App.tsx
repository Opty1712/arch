import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { appConfig, initDemoModeFromLocation } from "./config/appConfig";
import { Router } from "./router/Router";
import { userStore } from "./stores/userStore";

function AppComponent() {
  useEffect(() => {
    initDemoModeFromLocation();

    if (appConfig.isDemo && !userStore.isAuthenticated) {
      userStore.login("DemoUser");
    }
  }, []);

  return (
    <>
      <Layout>
        <Router />
      </Layout>
    </>
  );
}

export const App = observer(AppComponent);
