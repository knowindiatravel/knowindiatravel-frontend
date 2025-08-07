import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { resolve } from "path";

// Load env vars from .env file
dotenv.config();

// Access the environment variable
const API_BASE_URL = process.env.VITE_API_BASE_URL;

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp4"],
  base: "/",
  build: {
    outDir: "../backend/client/dist",
  },
  server: {
    proxy: {
      "/api": {
        target: API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
