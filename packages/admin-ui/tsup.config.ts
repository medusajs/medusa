import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  minify: true,
  clean: true,
  format: ["cjs", "esm"],
})
