import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// In dev rulam la radacina (/); la build folosim base-ul de GitHub Pages
// (proiectul e servit la /finco/).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/finco/" : "/",
  plugins: [react()],
  server: {
    port: 7070,
  },
}));
