import type { Linter } from "eslint"
import { PLUGIN_NAMESPACE, ruleId } from "../constants"

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
      plugins: { [PLUGIN_NAMESPACE]: plugin as never },
      languageOptions: {
        parser: require("@typescript-eslint/parser"),
        parserOptions: { project: true, sourceType: "module" },
      },
      rules: {},
    },
    {
      files: ["src/workflows/**/*.{ts,tsx}", "**/workflows/**/*.{ts,tsx}"],
      rules: {
        [ruleId("no-async-workflow-constructor")]: "error",
        [ruleId("no-conditional-expressions-in-workflow")]: "error",
        [ruleId("no-console-log-in-workflow")]: "warn",
        [ruleId("no-direct-variable-mutation-in-workflow")]: "error",
        [ruleId("no-if-in-workflow-constructor")]: "error",
        [ruleId("no-loops-in-workflow")]: "error",
        [ruleId("no-spread-in-workflow")]: "error",
        [ruleId("no-try-catch-in-workflow")]: "error",
      },
    },
  ]
}
