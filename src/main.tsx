import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { initDemoModeFromLocation } from "./config/appConfig";
import "./i18n/i18n";
import { queryClient } from "./network/queryClient";

initDemoModeFromLocation();

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div>Loading...</div>}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Suspense>
);
