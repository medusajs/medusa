import { VIRTUAL_MODULES } from "@medusajs/admin-shared"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  external: [...VIRTUAL_MODULES, "virtual:medusa/extensions"],
  tsconfig: "tsconfig.build.json",
  clean: true,
})
