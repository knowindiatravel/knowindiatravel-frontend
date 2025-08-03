import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.mp4"], // For video file support
  base: "/", // Sets base URL for production builds
  build: {
    outDir: "../backend/client/dist", // Ensure this matches your Express static path
  },

  // Optional: Proxy API requests to avoid CORS in development
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
