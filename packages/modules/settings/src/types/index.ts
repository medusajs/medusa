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
 *         entityOverrides: {
 *           Brand: {
 *             defaultVisibleFields: ["name", "products_count"],
 *             defaultFieldOrdering: { name: 100 },
 *             computedColumns: [
 *                {
 *                  id: "products_count",
 *                  name: "Product Count",
 *                  renderMode: "count",
 *                  requiredFields: ["products"],
 *                },
 *              ],
 *           },
 *         },
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

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/settings": SettingsModuleOptions
    "@medusajs/medusa/settings": SettingsModuleOptions
  }
}
