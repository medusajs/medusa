// Medusa-only ESLint config.
//
// Runs ONLY the `@medusajs/eslint-plugin` convention rules, using the exact
// scope and rules defined in the root `.eslintrc.js` — the root config stays the
// single source of truth, and this config follows it automatically. The style /
// prettier / @typescript-eslint overrides are filtered out so a run reports only
// Medusa rule violations.
//
// Used by the `lint:medusa` npm script (and CI):
//   eslint --no-eslintrc --config eslint.medusa.cjs --ignore-path .eslintignore --ext .js,.ts,.tsx .
const root = require("./.eslintrc.js")

// An override that only configures the parser (no `rules`) — kept so TypeScript
// files still parse.
const isRuleless = (o) => !o.rules || Object.keys(o.rules).length === 0

// An override whose every rule is a Medusa rule (`@medusajs/*`).
const isMedusaOverride = (o) =>
  o.rules &&
  Object.keys(o.rules).length > 0 &&
  Object.keys(o.rules).every((rule) => rule.startsWith("@medusajs/"))

const overrides = (root.overrides || []).filter(
  (o) => isRuleless(o) || isMedusaOverride(o)
)

module.exports = {
  root: true,
  // The root config gets JS parser settings from its (dropped) style overrides'
  // `extends`; supply modern defaults here so plain `.js`/`.mjs`/`.cjs`/`.jsx`
  // files still parse. TypeScript files are handled by the `*.ts`/`*.tsx` parser
  // override carried over from the root config.
  parserOptions: Object.assign({}, root.parserOptions, {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: Object.assign(
      {},
      root.parserOptions && root.parserOptions.ecmaFeatures,
      { jsx: true }
    ),
  }),
  env: root.env,
  // Reuse the same plugin registrations so rule references and any third-party
  // `eslint-disable` directives in linted files still resolve (no rules from
  // these plugins are enabled here).
  plugins: root.plugins,
  overrides,
}
