import type { CORE_LAYOUT_IDS } from "./constants"

export type LayoutSection = {
  id: string
  ordering: "list" | "grid" | "horizontal-stretched" | "horizontal-list"
}

/**
 * Registry mapping each known layout id to the union of valid section names
 * for that layout. `LayoutComposer`'s `sections` prop is keyed by this union,
 * so adding an entry here gives strict required-key typing and autocomplete
 * to consumers of the layout.
 *
 * ## Augmenting from a plugin
 * ```ts
 * // my-plugin/index.d.ts
 * import "@medusajs/admin-shared"
 *
 * declare module "@medusajs/admin-shared" {
 *   interface LayoutSectionRegistry {
 *     "my-plugin:three-column": "main" | "left" | "right"
 *     "my-plugin:hero": "hero" | "body"
 *   }
 * }
 * ```
 *
 * The registered ids and section names must match what the plugin actually
 * registers at runtime via `defineLayoutConfig` — TypeScript can only enforce
 * the keys/names against the registry, not against the live layout definition.
 */
export interface LayoutSectionRegistry {
  [CORE_LAYOUT_IDS.SINGLE_COLUMN]: "main"
  [CORE_LAYOUT_IDS.SINGLE_ROW]: "main"
  [CORE_LAYOUT_IDS.TWO_COLUMN]: "main" | "side"
  [CORE_LAYOUT_IDS.SETTINGS_SIDEBAR]:
    | "general"
    | "developer"
    | "myAccount"
    | "extensions"
}

export type Layouts = keyof LayoutSectionRegistry
/**
 * Resolves a layout id to its valid section-name union
 */
export type SectionNameFor<TLayoutId extends Layouts> =
  LayoutSectionRegistry[TLayoutId]
