import { writeFile } from "fs/promises"
import path from "path"
import { defineConfig } from "tsup"

import { generateThemeCSS } from "./src/theme-css"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  tsconfig: path.resolve(__dirname, "tsconfig.json"),
  dts: true,
  clean: true,
  onSuccess: () =>
    writeFile(path.resolve(__dirname, "dist/theme.css"), generateThemeCSS()),
})
