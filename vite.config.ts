import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    root: path.resolve(__dirname, "src"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "src/index.html"),
        },
      },
    },
    define: {
      "process.env.IS_MOCK_MODE":
        mode === "production" ? JSON.stringify(false) : env.IS_MOCK_MODE ?? "",
    },
    base: "/",
    appType: "spa",
    server: {
      port: 5173,
      host: true,
      open: true,
      // В Vite 4.x работает из коробки для SPA, нужно просто явно указать
      cors: true,
    },
  };
});
