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

/** The name of the `Modules` enum as imported from `@medusajs/framework/utils`. */
export const MODULES_ENUM = "Modules"

/**
 * Map of known `Modules.*` string values → enum member name.
 * Sourced from `packages/core/utils/src/modules-sdk/definition.ts`.
 *
 * Used by any rule that wants to recognize a built-in module string value and
 * suggest the corresponding `Modules.*` enum member (e.g.
 * `link-create-keys-modules-enum`, `prefer-modules-enum`).
 */
export const MODULES_BY_VALUE: Record<string, string> = {
  analytics: "ANALYTICS",
  auth: "AUTH",
  cache: "CACHE",
  cart: "CART",
  customer: "CUSTOMER",
  event_bus: "EVENT_BUS",
  inventory: "INVENTORY",
  link_modules: "LINK",
  payment: "PAYMENT",
  pricing: "PRICING",
  product: "PRODUCT",
  promotion: "PROMOTION",
  sales_channel: "SALES_CHANNEL",
  tax: "TAX",
  fulfillment: "FULFILLMENT",
  stock_location: "STOCK_LOCATION",
  user: "USER",
  workflows: "WORKFLOW_ENGINE",
  region: "REGION",
  order: "ORDER",
  api_key: "API_KEY",
  store: "STORE",
  currency: "CURRENCY",
  file: "FILE",
  notification: "NOTIFICATION",
  index: "INDEX",
  locking: "LOCKING",
  settings: "SETTINGS",
  caching: "CACHING",
  translation: "TRANSLATION",
  rbac: "RBAC",
}
