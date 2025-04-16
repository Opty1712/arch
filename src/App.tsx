import { Layout } from "@/components/Layout";
import { Router } from "@/router/Router";
import { observer } from "mobx-react-lite";

function AppComponent() {
  return (
    <Layout>
      <Router />
    </Layout>
  );
}

export const App = observer(AppComponent);
