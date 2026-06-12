import { INJECTION_ZONES } from "./constants"

export interface InjectionZoneRegistry
  extends Record<(typeof INJECTION_ZONES)[number], true> {}

/**
 * Plugins can register their own injection zones by augmenting
 * the {@link InjectionZoneRegistry} interface through declaration merging.
 * The new keys become available to `defineWidgetConfig` for autocompletion
 *
 * Define them in index.d.ts in the root of the plugin package
 * and add it to package.json:
 * ```json
 * "files": [
 *   ".medusa/server",
 *   "index.d.ts"
 * ],
 * "exports": {
 *   ".": {
 *     "types": "./index.d.ts"
 *   },
 * ```
 * @example
 * my-plugin/index.d.ts
 * declare module "@medusajs/admin-shared" {
 *   interface InjectionZoneRegistry {
 *     "my-plugin.product-page.before": true
 *     "my-plugin.product-page.after": true
 *   }
 * }
 */
export type InjectionZone = keyof InjectionZoneRegistry
