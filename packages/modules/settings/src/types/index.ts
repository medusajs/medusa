import { Logger } from "@medusajs/framework/types"
import { EntityOverride } from "../utils/entity-overrides"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

/**
 * Options accepted by the Settings module.
 *
 * @example
 * // medusa-config.ts
 * module.exports = defineConfig({
 *   modules: [
 *     {
 *       resolve: "@medusajs/medusa/settings",
 *       options: {
 *         entityOverrides: [
 *           {
 *             entity: "Brand",
 *             defaultVisibleFields: ["name", "products_count"],
 *             fieldOrdering: { name: 100 },
 *             computedColumns: [
 *                {
 *                  id: "products_count",
 *                  name: "Product Count",
 *                  renderMode: "count",
 *                  requiredFields: ["products"],
 *                  entities: ["Brand"],
 *                },
 *              ],
 *           },
 *         ],
 *       },
 *     },
 *   ],
 * })
 */
export interface SettingsModuleOptions {
  /**
   * Entity overrides to merge into the override registry at startup, keyed by the entity name.
   * Merged with built-in overrides; provided values take precedence.
   */
  entityOverrides?: Record<string, EntityOverride>
}
