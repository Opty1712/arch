/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_IS_MOCK_MODE: string; // или boolean, если конвертируешь заранее
  // добавляй сюда все переменные, которые используешь
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
