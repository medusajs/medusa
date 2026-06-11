import type { Linter } from "eslint"
import { ruleId } from "../constants"
import { buildRecommended } from "./recommended"

/**
 * Strict preset — superset of `recommended` plus rules that require TypeScript
 * type information (`parserOptions.project` / `projectService` must be set on
 * the consumer's ESLint config). These are slower to run, which is why they
 * are not in `recommended`.
 */
export function buildStrict(plugin: unknown): Linter.Config[] {
  return [
    ...buildRecommended(plugin),
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        [ruleId("no-workflow-call-without-container")]: "warn",
      },
    },
    {
      files: ["src/workflows/**/*.{ts,tsx}", "**/workflows/**/*.{ts,tsx}"],
      rules: {
        [ruleId("no-non-serializable-step-return")]: "error",
      },
    },
  ]
}
