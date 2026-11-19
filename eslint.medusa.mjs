// Runs ONLY the `@medusajs/eslint-plugin` convention rules, using the scope and
// rules defined in the root `eslint.config.mjs`, so a run reports only Medusa
// rule violations. Used by the `lint:medusa` script (and CI).
import root from "./eslint.config.mjs"

const isRuleless = (c) => !c.rules || Object.keys(c.rules).length === 0

const isMedusaBlock = (c) =>
  Object.keys(c.rules).every((rule) => rule.startsWith("@medusajs/"))

export default root.filter((c) => isRuleless(c) || isMedusaBlock(c))
