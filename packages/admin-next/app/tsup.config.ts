import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/root.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
})
