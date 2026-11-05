import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
