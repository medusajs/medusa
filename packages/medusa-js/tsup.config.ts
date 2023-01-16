import type { Options } from "tsup"

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  format: ["esm", "cjs", "iife"],
  tsconfig: "./tsconfig.json",
}

export default config
