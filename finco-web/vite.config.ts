import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Alias-uri pentru importuri scurte (@components, @hooks, etc.) - tinute
// in sincron cu "paths" din tsconfig.app.json.
const alias = Object.fromEntries(
  [
    "components",
    "constants",
    "contexts",
    "features",
    "hooks",
    "mocks",
    "pages",
    "services",
    "surfaces",
    "types",
    "utils",
  ].map((name) => [
    `@${name}`,
    fileURLToPath(new URL(`./src/${name}`, import.meta.url)),
  ]),
);

// https://vite.dev/config/
// In dev rulam la radacina (/); la build folosim base-ul de GitHub Pages
// (proiectul e servit la /finco/).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/finco/" : "/",
  plugins: [react()],
  resolve: { alias },
  server: {
    port: 7070,
  },
}));
