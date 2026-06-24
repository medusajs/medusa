import type { ComponentType, ReactNode } from "react"
import type { CORE_LAYOUT_IDS } from "./constants"

export type CoreLayoutId =
  (typeof CORE_LAYOUT_IDS)[keyof typeof CORE_LAYOUT_IDS]

export type WidgetRenderEntry = {
  order: number
  Component: ComponentType
}
export type SectionWidgetMap = Record<string, WidgetRenderEntry[]>

export type LayoutDefinition = {
  id: string
  sections: LayoutSection[]
  Component: ComponentType<LayoutComponentProps>
}

export type LayoutSection = {
  id: string
}

export type LayoutComponentProps = {
  sections: Record<string, ReactNode>
  data?: unknown
}

/**
 * Registry mapping each known layout id to the union of valid section names
 * for that layout. Plugins can augment this interface to add type-safe section
 * names for their custom layouts.
 *
 * @example
 * ```ts
 * declare module "@medusajs/dashboard/components" {
 *   interface LayoutSectionRegistry {
 *     "my-plugin:three-column": "main" | "left" | "right"
 *   }
 * }
 * ```
 */
export interface LayoutSectionRegistry {
  [CORE_LAYOUT_IDS.SINGLE_COLUMN]: "main"
  [CORE_LAYOUT_IDS.TWO_COLUMN]: "main" | "side"
}
