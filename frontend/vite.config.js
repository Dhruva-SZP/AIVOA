import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/AIVOA/",
  server: {
    port: 5173,
  },
});