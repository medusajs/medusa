import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    // `@medusajs/dashboard`
    app: "./src/app.tsx",
    // `@medusajs/dashboard/components`
    components: "./src/exports/components.ts",
    // `@medusajs/dashboard/hooks`
    hooks: "./src/exports/hooks.ts",
  },
  format: ["cjs", "esm"],
  external: [
    "virtual:medusa/forms",
    "virtual:medusa/displays",
    "virtual:medusa/routes",
    "virtual:medusa/links",
    "virtual:medusa/menu-items",
    "virtual:medusa/widgets",
    "virtual:medusa/i18n",
    "virtual:medusa/layouts",
  ],
  tsconfig: "tsconfig.build.json",
  dts: {
    entry: {
      index: "./src/index.ts",
      components: "./src/exports/components.ts",
      hooks: "./src/exports/hooks.ts",
    },
  },
  clean: true,
})
