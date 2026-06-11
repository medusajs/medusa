import type { Linter } from "eslint"

export function buildRecommended(plugin: unknown): Linter.Config[] {
  return [
    {
      ignores: [
        ".medusa/**",
        ".yalc/**",
        "dist/**",
        "build/**",
        "node_modules/**",
        "coverage/**",
        ".cache/**",
        "**/*.generated.ts",
      ],
    },
    {
      files: ["**/*.{ts,tsx}"],
      plugins: { "@medusajs": plugin as never },
      languageOptions: {
        parser: require("@typescript-eslint/parser"),
        parserOptions: { project: true, sourceType: "module" },
      },
      rules: {},
    },
  ]
}
