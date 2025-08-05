import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["core/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  skipNodeModulesBundle: true,
});
