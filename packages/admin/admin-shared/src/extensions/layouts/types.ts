import type { ComponentType, ReactNode } from "react"
import type { CORE_LAYOUT_IDS } from "./constants"

export type CoreLayoutId =
  (typeof CORE_LAYOUT_IDS)[keyof typeof CORE_LAYOUT_IDS]

export type LayoutSection = {
  id: string
  ordering: "list" | "grid" | "horizontal"
}

export type LayoutComponentProps = {
  sections: Record<string, ReactNode>
  data?: unknown
}

export type LayoutDefinition = {
  id: string
  sections: LayoutSection[]
  Component: ComponentType<LayoutComponentProps>
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
  [CORE_LAYOUT_IDS.TWO_COLUMN]: "main" | "side"
}

export type Layouts = keyof LayoutSectionRegistry
/**
 * Resolves a layout id to its valid section-name union
 */
export type SectionNameFor<TLayoutId extends Layouts> =
  LayoutSectionRegistry[TLayoutId]

export type WidgetPreference = {
  hidden?: boolean
  /** Override which section this widget appears in */
  section?: string
  /** Override sort order within the section */
  order?: number
}

/** Per-zone user preferences for widget placement and visibility. */
export type LayoutPreference = {
  widgets: Record<string, WidgetPreference>
}

export type WidgetRenderEntry = {
  order: number
  Component: ComponentType
  widgetId: string
}
export type SectionWidgetMap = Record<string, WidgetRenderEntry[]>
