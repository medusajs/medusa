import type { Linter } from "eslint"
import { ruleId } from "../constants"
import { buildRecommended } from "./recommended"
import { tsParserBlock } from "./shared"

/**
 * Strict preset — superset of `recommended` plus rules that are too expensive
 * for the default preset: rules that require TypeScript type information
 * (this preset enables `parserOptions.project`, so the consumer must have a
 * tsconfig that includes the linted files), and cross-file rules whose cost
 * scales with project size. These are slower to run, which is why they are not
 * in `recommended`.
 */
export function buildStrict(plugin: unknown): Linter.Config[] {
  return [
    ...buildRecommended(plugin),
    // Enable type-aware parsing for the type-information rules below. This comes
    // after `recommended` so it overrides that preset's project-less parser
    // block.
    tsParserBlock(true),
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
    {
      files: ["src/api/**/route.{ts,tsx,js}", "**/api/**/route.{ts,tsx,js}"],
      rules: {
        [ruleId("use-validated-body-or-query")]: "warn",
      },
    },
    {
      // Cross-file uniqueness check: for each job file it reads and parses every
      // other job file under the same `jobs/` root, so cost scales with the
      // number of jobs squared. Strict-only for that reason.
      files: ["src/jobs/**/*.{ts,js}", "**/src/jobs/**/*.{ts,js}"],
      rules: {
        [ruleId("scheduled-job-name-unique")]: "error",
      },
    },
  ]
}
