import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/app.tsx"],
  format: ["cjs", "esm"],
  external: [
    "medusa-admin:settings/pages",
    "medusa-admin:routes/pages",
    "medusa-admin:widgets/promotion/list/after",
    "medusa-admin:widgets/promotion/list/before",
    "medusa-admin:widgets/promotion/details/after",
    "medusa-admin:widgets/promotion/details/before",
    "medusa-admin:widgets/product/list/after",
    "medusa-admin:widgets/product/list/before",
    "medusa-admin:widgets/product/details/after",
    "medusa-admin:widgets/product/details/before",
    "medusa-admin:widgets/product/details/side/after",
    "medusa-admin:widgets/product/details/side/before",
    "medusa-admin:routes/links",
  ],
  tsconfig: "tsconfig.build.json",
  clean: true,
})
