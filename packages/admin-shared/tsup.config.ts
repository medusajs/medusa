import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
})
