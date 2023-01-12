import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { defineConfig } from "rollup"
import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"

const packageJson = require("./package.json")

export default defineConfig({
  input: "src/index.ts",
  external: ["@medusajs/medusa"],
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    terser(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
})
