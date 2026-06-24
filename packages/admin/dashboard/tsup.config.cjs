import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    // `@zjedene-medusa/dashboard`
    app: "./src/app.tsx",
    // `@zjedene-medusa/dashboard/components`
    components: "./src/exports/components.ts",
    // `@zjedene-medusa/dashboard/hooks`
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
