import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // GitHub project pages are hosted below the repository name, while local
  // development is served from the domain root.
  base: process.env.GITHUB_ACTIONS ? "/SEO-optimised-pipeline-project/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
