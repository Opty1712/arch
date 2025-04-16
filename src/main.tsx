import { App } from "@/App";
import "@/i18n/i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import "./config/appConfig";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
