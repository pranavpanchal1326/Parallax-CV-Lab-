import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    fs: { allow: [fileURLToPath(new URL("../../", import.meta.url))] },
    proxy: Object.fromEntries(
      ["/design", "/prototype", "/spatial"].map((path) => [
        path,
        "http://127.0.0.1:4180",
      ]),
    ),
  },
});
