/**
 * The flat-config plugin namespace under which all of this plugin's rules
 * are exposed to consumers (e.g. `"@medusajs/no-async-workflow-constructor"`).
 *
 * Consumers register the plugin under this key:
 *   plugins: { [PLUGIN_NAMESPACE]: plugin }
 *
 * Rule modules themselves are stored in `plugin.rules` under their bare
 * names (e.g. `"no-async-workflow-constructor"`) — ESLint joins the plugin
 * key with the bare rule key to form the fully-qualified id.
 */
export const PLUGIN_NAMESPACE = "@medusajs"

/** The npm package name; also used as `meta.name` on the plugin object. */
export const PLUGIN_NAME = `${PLUGIN_NAMESPACE}/eslint-plugin`

/** Build the fully-qualified rule id a consumer would use in their config. */
export const ruleId = (name: string): string => `${PLUGIN_NAMESPACE}/${name}`

/** Public entry-point sources that rules inspect imports from. */
export const FRAMEWORK_UTILS_SOURCE = "@medusajs/framework/utils"
export const WORKFLOWS_SDK_SOURCE = "@medusajs/framework/workflows-sdk"
export const FRAMEWORK_TYPES_SOURCE = "@medusajs/framework/types"
export const FRAMEWORK_HTTP_SOURCE = "@medusajs/framework/http"
export const LEGACY_TYPES_SOURCE = "@medusajs/types"
export const ADMIN_SDK_SOURCE = "@medusajs/admin-sdk"

/** All sources that expose Medusa type declarations. */
export const TYPES_SOURCES: ReadonlySet<string> = new Set([
  FRAMEWORK_TYPES_SOURCE,
  LEGACY_TYPES_SOURCE,
])
