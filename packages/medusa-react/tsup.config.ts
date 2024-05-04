import type { Options } from "tsup"
import { peerDependencies } from "./package.json"

const config: Options = {
  entry: ["src/**/*.ts"],
  dts: true,
  clean: true,
  minify: true,
  bundle: true,
  sourcemap: true,
  format: ["cjs", "esm"],
  target: "es2020",
  skipNodeModulesBundle: true,
  tsconfig: "./tsconfig.json",
  external: Object.keys(peerDependencies),
}

export default config
