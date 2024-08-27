import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5173",
    proxy: {
      "/api": {
        target: "http://localhost:5051",
        changeOrigin: true,
        rewrite: (path) => path.replace("/^/api", ""),
      },
    },
  },
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
});
