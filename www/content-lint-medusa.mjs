import medusa from "@medusajs/eslint-plugin"

const astScopedRules = [
  "link-create-keys-modules-enum",
  "link-uses-linkable-properties",
  "medusa-context-on-context-param",
  "module-name-snake-case",
  "no-async-workflow-constructor",
  "no-conditional-expressions-in-workflow",
  "no-console-log-in-workflow",
  "no-deprecated-remote-query-config",
  "no-direct-variable-mutation-in-workflow",
  "no-duplicate-step-id-in-workflow",
  "no-if-in-workflow-constructor",
  "no-loops-in-workflow",
  "no-mikroorm-direct-import",
  "no-nested-when-in-workflow",
  "no-new-date-in-workflow",
  "no-spread-in-workflow",
  "no-throw-in-transform",
  "no-throw-in-workflow-constructor",
  "no-try-catch-in-workflow",
  "no-wildcard-with-specific-fields",
  "prefer-container-registration-keys",
  "prefer-link-over-remote-link",
  "prefer-modules-enum",
  "prices-in-major-units",
  "read-only-link-requires-field",
  "service-constructor-must-call-super",
  "service-methods-must-be-async",
  "step-must-return-step-response",
  "use-inject-manager-on-public-methods",
  "when-block-must-have-name",
  "workflow-must-return-workflow-response",
]

const pathScopedRules = [
  {
    // `@medusajs/framework/*` is server-side only. Storefront and admin code
    // are browser bundles and import from the standalone `@medusajs/types` /
    // `@medusajs/js-sdk` packages instead, so this rule has to stay off both —
    // the plugin's own `recommended` preset likewise excludes `src/admin/**`.
    paths: ["**/*.{md,mdx}/**/*.{js,jsx,ts,tsx}"],
    ignores: [
      "**/storefront-development/**",
      "**/nextjs-starter/**",
      "**/storefront/page.mdx/**",
      "**/*.{md,mdx}/**/src/admin/**",
      "**/*.{md,mdx}/**/src/app/**",
      "**/*.{md,mdx}/**/src/lib/**",
      "**/*.{md,mdx}/**/src/types/**",
      "**/*.{md,mdx}/**/src/modules/**/components/**",
      "**/*.{md,mdx}/**/src/modules/**/templates/**",
    ],
    rules: ["import-from-framework-not-internal"],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/**/*.{ts,js}"],
    ignores: ["**/*.{md,mdx}/**/src/admin/**"],
    rules: ["zod-import-source"],
  },
  {
    // Server-side code only. The docs also carry Next.js storefront examples
    // under `src/lib/**` and `src/modules/*/components/**`, where a plain
    // `Error` is correct and `MedusaError` is not available.
    paths: [
      "**/*.{md,mdx}/**/src/api/**/*.{ts,tsx}",
      "**/*.{md,mdx}/**/src/workflows/**/*.{ts,js}",
      "**/*.{md,mdx}/**/src/subscribers/**/*.{ts,js}",
      "**/*.{md,mdx}/**/src/jobs/**/*.{ts,js}",
      "**/*.{md,mdx}/**/src/links/**/*.{ts,js}",
      "**/*.{md,mdx}/**/src/modules/**/service.{ts,js}",
      "**/*.{md,mdx}/**/src/modules/**/loaders/**/*.{ts,js}",
    ],
    rules: ["use-medusa-error-not-generic-error"],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/api/**/*.{ts,tsx}"],
    rules: [
      "authenticate-flag-name-and-type",
      "no-service-mutations-in-api-route",
      "route-handler-exports-uppercase",
      "route-params-must-be-defined",
      "use-validated-body-or-query",
    ],
  },
  {
    paths: [
      "**/*.{md,mdx}/**/src/api/**/*.{ts,tsx}",
      "**/*.{md,mdx}/**/src/admin/routes/**/*.{ts,tsx}",
    ],
    rules: ["route-dynamic-folder-syntax"],
  },
  {
    paths: [
      "**/*.{md,mdx}/**/middleware.{ts,js}",
      "**/*.{md,mdx}/**/middlewares.{ts,js}",
    ],
    rules: ["middleware-must-call-next", "no-trailing-slash-in-route-matcher"],
  },
  {
    // Data models. A page explaining one property type shows a `model.define`
    // with just that property, so the model-shape rules only make sense where
    // the block claims to be a real model file.
    paths: ["**/*.{md,mdx}/**/src/modules/**/models/**/*.{ts,js}"],
    rules: [
      "data-model-table-name-snake-case",
      "link-no-cross-module-relationship",
      "no-reserved-default-properties-in-model",
      "primary-key-required",
    ],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/links/**/*.{ts,tsx,js,mjs,cjs}"],
    rules: ["link-uses-linkable-properties", "read-only-link-requires-field"],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/subscribers/*.{ts,js}"],
    rules: [
      "prefer-workflow-event-over-module-event",
      "subscriber-default-export-must-be-async",
    ],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/jobs/*.{ts,js}"],
    rules: [
      "scheduled-job-default-export-async",
      "scheduled-job-schedule-valid-cron",
    ],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/admin/**/*.{ts,tsx,js,jsx}"],
    rules: ["admin-env-vars-import-meta", "admin-no-medusa-utils-import"],
  },
  {
    paths: [
      "**/*.{md,mdx}/**/src/admin/widgets/**/*.{tsx,jsx}",
      "**/*.{md,mdx}/**/src/admin/routes/**/page.{tsx,jsx}",
    ],
    rules: [
      "admin-component-must-be-arrow-function",
      "widget-zone-must-be-string-literal",
    ],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/admin/routes/**/*.{tsx,jsx}"],
    rules: ["ui-route-file-name-page-tsx"],
  },
  {
    paths: ["**/*.{md,mdx}/**/src/admin/routes/**/page.{tsx,jsx}"],
    rules: [
      "no-config-on-dynamic-ui-route",
      "ui-route-config-via-define-route-config",
    ],
  },
]

const withoutFixer = (rule) => ({
  ...rule,
  meta: { ...rule.meta, fixable: undefined, hasSuggestions: false },
  create(context) {
    const proxy = Object.create(context, {
      report: {
        value: (descriptor) => {
          const { fix, suggest, ...rest } = descriptor
          context.report(rest)
        },
      },
    })
    return rule.create(proxy)
  },
})

const usedRules = new Set([
  ...astScopedRules,
  ...pathScopedRules.flatMap(({ rules }) => rules),
])

const plugin = {
  ...medusa,
  rules: Object.fromEntries(
    [...usedRules].map((name) => [name, withoutFixer(medusa.rules[name])])
  ),
}

const asWarnings = (rules) =>
  Object.fromEntries(rules.map((name) => [`@medusajs/${name}`, "error"]))

export const medusaContentConfigs = [
  {
    files: ["**/*.{md,mdx}/**/*.{js,jsx,ts,tsx}"],
    plugins: { "@medusajs": plugin },
    rules: asWarnings(astScopedRules),
  },
  ...pathScopedRules.map(({ paths, ignores, rules }) => ({
    files: paths,
    ...(ignores ? { ignores } : {}),
    rules: asWarnings(rules),
  })),
]

export default medusaContentConfigs
