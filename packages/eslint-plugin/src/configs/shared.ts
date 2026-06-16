import type { Linter } from "eslint"
import { PLUGIN_NAMESPACE } from "../constants"

/**
 * The directories every preset ignores: build output, dependency trees, caches,
 * generated sources, and test scaffolding. Test files and fixtures aren't real
 * Medusa source — linting them produces false positives (e.g. treating a test
 * `medusa-config.js` fixture as a project config), so they're excluded here.
 */
export const ignoresBlock: Linter.Config = {
  ignores: [
    "**/.medusa/**",
    "**/.yalc/**",
    "**/dist/**",
    "**/build/**",
    "**/node_modules/**",
    "**/coverage/**",
    "**/.cache/**",
    "**/*.generated.ts",
    "**/__tests__/**",
    "**/__fixtures__/**",
    "**/__mocks__/**",
    "**/integration-tests/**",
    "**/*.spec.*",
    "**/*.test.*",
  ],
}

/**
 * Register the plugin globally (no `files` key) so that EVERY file ESLint
 * processes can resolve `@medusajs/*` rule references — including `.js`/`.mjs`/
 * `.cjs`/`.jsx` files matched by directory-scoped rule blocks, and the
 * `eslint.config.js` file itself. If this registration were scoped to
 * `.ts,.tsx` only, linting a matched `.js` file would fail with
 * `Could not find plugin "@medusajs" in configuration`.
 */
export function pluginBlock(plugin: unknown): Linter.Config {
  return { plugins: { [PLUGIN_NAMESPACE]: plugin as never } }
}

/**
 * Parse TypeScript source with the bundled `@typescript-eslint/parser`.
 *
 * `withProject` controls type-aware parsing:
 * - `true` sets `parserOptions.project` (required by type-aware rules; consumers
 *   must have a tsconfig that includes the linted files).
 * - `false` (the default) skips it, so the preset is zero-config — no rule in it
 *   needs type information, so there is nothing to gain from building a program.
 */
export function tsParserBlock(withProject = false): Linter.Config {
  return {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: withProject
        ? { project: true, sourceType: "module" }
        : { sourceType: "module" },
    },
    rules: {},
  }
}
