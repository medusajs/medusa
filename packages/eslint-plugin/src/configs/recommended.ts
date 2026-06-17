import type { Linter } from "eslint"
import { ruleId } from "../constants"
import { ignoresBlock, pluginBlock, tsParserBlock } from "./shared"

export function buildRecommended(plugin: unknown): Linter.Config[] {
  return [
    ignoresBlock,
    pluginBlock(plugin),
    // Recommended rules don't need type information, but the parser is set up
    // with `project` so the type-aware `strict` preset (which extends this one)
    // has parser services available.
    tsParserBlock(true),
    {
      files: ["**/*.{ts,js}"],
      ignores: ["src/admin/**", "**/src/admin/**"],
      rules: {
        [ruleId("no-async-workflow-constructor")]: "error",
        [ruleId("no-conditional-expressions-in-workflow")]: "error",
        [ruleId("no-console-log-in-workflow")]: "warn",
        [ruleId("no-direct-variable-mutation-in-workflow")]: "error",
        [ruleId("no-duplicate-step-id-in-workflow")]: "error",
        [ruleId("no-if-in-workflow-constructor")]: "error",
        [ruleId("no-loops-in-workflow")]: "error",
        [ruleId("no-new-date-in-workflow")]: "error",
        [ruleId("no-spread-in-workflow")]: "error",
        [ruleId("no-throw-in-transform")]: "error",
        [ruleId("no-try-catch-in-workflow")]: "error",
        [ruleId("import-from-framework-not-internal")]: "warn",
        [ruleId("no-mikroorm-direct-import")]: "warn",
        [ruleId("use-medusa-error-not-generic-error")]: "warn",
        [ruleId("link-create-keys-modules-enum")]: "warn",
        [ruleId("prefer-container-registration-keys")]: "warn",
        [ruleId("prefer-link-over-remote-link")]: "warn",
        [ruleId("prefer-modules-enum")]: "warn",
        [ruleId("prices-in-major-units")]: "warn",
        [ruleId("step-id-kebab-case")]: "warn",
        [ruleId("use-query-context-utility")]: "warn",
        [ruleId("step-must-return-step-response")]: "error",
        [ruleId("workflow-id-matches-export-or-filename")]: "warn",
        [ruleId("workflow-must-return-workflow-response")]: "error",
        [ruleId("zod-import-source")]: "warn",
      },
    },
    {
      files: ["src/api/**/*.{ts,tsx}", "**/api/**/*.{ts,tsx}"],
      rules: {
        [ruleId("authenticate-flag-name-and-type")]: "error",
        [ruleId("no-deprecated-remote-query-config")]: "warn",
        [ruleId("no-service-mutations-in-api-route")]: "warn",
        [ruleId("route-file-naming")]: "error",
        [ruleId("route-handler-exports-uppercase")]: "error",
        [ruleId("route-params-must-be-defined")]: "error",
      },
    },
    {
      files: [
        "src/api/**/*.{ts,tsx}",
        "**/api/**/*.{ts,tsx}",
        "src/admin/routes/**/*.{ts,tsx}",
        "**/admin/routes/**/*.{ts,tsx}",
      ],
      rules: {
        [ruleId("route-dynamic-folder-syntax")]: "error",
      },
    },
    {
      files: ["**/middleware.{ts,js}", "**/middlewares.{ts,js}"],
      rules: {
        [ruleId("middleware-must-call-next")]: "warn",
        [ruleId("middlewares-file-location-and-name")]: "error",
        [ruleId("no-trailing-slash-in-route-matcher")]: "warn",
      },
    },
    {
      files: ["src/modules/**/*.{ts,tsx}", "**/modules/**/*.{ts,tsx}"],
      rules: {
        [ruleId("medusa-context-on-context-param")]: "warn",
        [ruleId("service-constructor-must-call-super")]: "error",
        [ruleId("service-methods-must-be-async")]: "error",
        [ruleId("use-inject-manager-on-public-methods")]: "warn",
      },
    },
    {
      files: ["src/modules/**/index.{ts,js}", "**/modules/**/index.{ts,js}"],
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
        [ruleId("primary-key-required")]: "warn",
      },
    },
    {
      // Whole admin-dashboard tree. Requires the `src/admin` segment pair so it
      // does not match API admin routes (`src/api/admin/**`), which are server
      // code where `process.env` is legitimate.
      files: [
        "src/admin/**/*.{ts,tsx,js,jsx}",
        "**/src/admin/**/*.{ts,tsx,js,jsx}",
      ],
      rules: {
        [ruleId("admin-env-vars-import-meta")]: "warn",
        [ruleId("admin-no-medusa-utils-import")]: "error",
      },
    },
    {
      files: [
        "src/admin/widgets/**/*.{tsx,jsx}",
        "**/admin/widgets/**/*.{tsx,jsx}",
        "src/admin/routes/**/page.{tsx,jsx}",
        "**/admin/routes/**/page.{tsx,jsx}",
      ],
      rules: {
        [ruleId("admin-component-must-be-arrow-function")]: "error",
        [ruleId("widget-zone-must-be-string-literal")]: "error",
      },
    },
    {
      files: [
        "src/admin/widgets/**/*.{tsx,jsx}",
        "**/admin/widgets/**/*.{tsx,jsx}",
      ],
      rules: {
        [ruleId("widget-must-export-config")]: "error",
        [ruleId("widget-must-have-default-export")]: "error",
      },
    },
    {
      files: [
        "src/admin/routes/**/*.{tsx,jsx}",
        "**/admin/routes/**/*.{tsx,jsx}",
      ],
      rules: {
        [ruleId("ui-route-file-name-page-tsx")]: "error",
      },
    },
    {
      files: [
        "src/admin/routes/**/page.{tsx,jsx}",
        "**/admin/routes/**/page.{tsx,jsx}",
      ],
      rules: {
        [ruleId("no-config-on-dynamic-ui-route")]: "warn",
        [ruleId("ui-route-config-via-define-route-config")]: "warn",
        [ruleId("ui-route-must-have-default-export")]: "error",
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
    {
      // Direct descendants of `subscribers/` only — Medusa loads a subscriber
      // from each file directly under this directory. Files in nested
      // subdirectories are treated as utilities, not subscribers, so they are
      // not subject to these rules.
      files: ["src/subscribers/*.{ts,js}", "**/src/subscribers/*.{ts,js}"],
      rules: {
        [ruleId("subscriber-config-export-required")]: "error",
        [ruleId("subscriber-default-export-must-be-async")]: "error",
        [ruleId("subscriber-default-export-required")]: "error",
      },
    },
    {
      // Direct descendants of `jobs/` only — Medusa loads a scheduled job from
      // each file directly under this directory. Files in nested subdirectories
      // are treated as utilities, not jobs, so they are not subject to these
      // rules.
      files: ["src/jobs/*.{ts,js}", "**/src/jobs/*.{ts,js}"],
      rules: {
        [ruleId("scheduled-job-config-required")]: "error",
        [ruleId("scheduled-job-default-export-async")]: "error",
        [ruleId("scheduled-job-default-export-required")]: "error",
        [ruleId("scheduled-job-schedule-valid-cron")]: "error",
      },
    },
  ]
}
