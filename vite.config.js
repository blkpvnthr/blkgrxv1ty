import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Pin dev + preview to http://localhost:5173 so the URL always matches
// (strictPort makes Vite fail loudly if 5173 is taken instead of silently
// hopping to 5174/5175, which would break Firebase authorized-domain assumptions).
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "localhost",
    port: 5173,
    strictPort: true,
  },
});
