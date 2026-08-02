import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative asset paths: the built demo is served from an arbitrary sub-path
// inside the portfolio (an iframe on the case-study page), never from a
// domain root, so nothing may be linked absolutely.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
