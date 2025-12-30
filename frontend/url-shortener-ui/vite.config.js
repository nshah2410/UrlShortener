import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],     // enable React plugin
  server: {
    proxy: {
      "/api": "http://localhost:8080",  // backend proxy
    },
  },
});
