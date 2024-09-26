import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/app.tsx"],
  format: ["cjs", "esm"],
  external: [
    "virtual:medusa/config",
    "virtual:medusa/routes",
    "virtual:medusa/links",
  ],
  tsconfig: "tsconfig.build.json",
  clean: true,
})
