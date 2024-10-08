import { VIRTUAL_MODULES } from "@medusajs/admin-shared"
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/app.tsx"],
  format: ["cjs", "esm"],
  external: [...VIRTUAL_MODULES, "virtual:config"],
  tsconfig: "tsconfig.build.json",
  clean: true,
})
