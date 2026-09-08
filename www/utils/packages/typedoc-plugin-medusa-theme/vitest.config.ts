import fs from "node:fs"
import path from "node:path"
import { defineConfig } from "vitest/config"

/**
 * The source uses NodeNext `.js` import specifiers (e.g. `./theme.js`). Under
 * Vitest we run the TypeScript sources directly, so rewrite relative `.js`
 * imports to the sibling `.ts` file when it exists.
 */
export default defineConfig({
  plugins: [
    {
      name: "resolve-js-to-ts",
      enforce: "pre",
      resolveId(source: string, importer?: string) {
        if (!importer || !source.startsWith(".") || !source.endsWith(".js")) {
          return null
        }
        const candidate = path.resolve(
          path.dirname(importer),
          `${source.slice(0, -3)}.ts`
        )
        return fs.existsSync(candidate) ? candidate : null
      },
    },
  ],
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
  },
})
