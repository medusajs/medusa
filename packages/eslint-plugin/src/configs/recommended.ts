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
      files: ["**/*.{ts,tsx}"],
      rules: {
        [ruleId("no-async-workflow-constructor")]: "error",
        [ruleId("no-conditional-expressions-in-workflow")]: "error",
        [ruleId("no-console-log-in-workflow")]: "warn",
        [ruleId("no-direct-variable-mutation-in-workflow")]: "error",
        [ruleId("no-if-in-workflow-constructor")]: "error",
        [ruleId("no-loops-in-workflow")]: "error",
        [ruleId("no-new-date-in-workflow")]: "error",
        [ruleId("no-spread-in-workflow")]: "error",
        [ruleId("no-throw-in-transform")]: "error",
        [ruleId("no-try-catch-in-workflow")]: "error",
        [ruleId("link-create-keys-modules-enum")]: "warn",
        [ruleId("prefer-link-over-remote-link")]: "warn",
        [ruleId("step-id-kebab-case")]: "warn",
        [ruleId("step-must-return-step-response")]: "error",
        [ruleId("workflow-id-matches-export-or-filename")]: "warn",
        [ruleId("workflow-must-return-workflow-response")]: "error",
      },
    },
    {
      files: ["src/modules/**/*.{ts,tsx}", "**/modules/**/*.{ts,tsx}"],
      rules: {
        [ruleId("medusa-context-on-context-param")]: "warn",
        [ruleId("service-constructor-must-call-super")]: "error",
        [ruleId("service-methods-must-be-async")]: "error",
        [ruleId("use-inject-manager-on-public-methods")]: "warn",
      }
    },
    {
      files: [
        "src/modules/**/index.{ts,js}",
        "**/modules/**/index.{ts,js}",
      ],
      rules: {
        [ruleId("module-name-snake-case")]: "error",
      },
    },
    {
      files: [
        "src/modules/**/loaders/**/*.{ts,tsx,js,mjs,cjs}",
        "**/modules/**/loaders/**/*.{ts,tsx,js,mjs,cjs}",
      ],
      rules: {
        [ruleId("loader-must-be-exported-in-module-definition")]: "warn",
      },
    },
    {
      files: [
        "src/modules/**/models/**/*.{ts,js}",
        "**/modules/**/models/**/*.{ts,js}",
      ],
      rules: {
        [ruleId("data-model-table-name-snake-case")]: "warn",
        [ruleId("link-no-cross-module-relationship")]: "error",
        [ruleId("no-reserved-default-properties-in-model")]: "error",
      },
    },
    {
      files: [
        "src/links/**/*.{ts,tsx,js,mjs,cjs}",
        "**/src/links/**/*.{ts,tsx,js,mjs,cjs}",
      ],
      rules: {
        [ruleId("link-uses-linkable-properties")]: "warn",
        [ruleId("read-only-link-requires-field")]: "error",
      },
    },
  ]
}
