import type { ESLint, Linter } from "eslint"
import { rules } from "./rules"
import { buildRecommended } from "./configs/recommended"
import { buildStrict } from "./configs/strict"
import { PLUGIN_NAME } from "./constants"

const plugin = {
  meta: { name: PLUGIN_NAME },
  rules,
  configs: {} as {
    recommended: Linter.Config[]
    strict: Linter.Config[]
  },
} satisfies ESLint.Plugin

plugin.configs.recommended = buildRecommended(plugin)
plugin.configs.strict = buildStrict(plugin)

export default plugin
export const { meta, configs } = plugin
export { rules }
