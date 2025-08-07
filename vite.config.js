import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// ✅ Load local .env file only during local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const API_BASE_URL = process.env.VITE_API_BASE_URL;

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp4"], // Support video files
  base: "/", // Set base path for deployment
  build: {
    outDir: "../backend/client/dist", // Output directory for production build
  },
  server: {
    proxy: {
      "/api": {
        target: API_BASE_URL,          // ✅ Uses env variable
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
