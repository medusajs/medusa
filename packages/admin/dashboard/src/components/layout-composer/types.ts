import type { ComponentType, ReactNode } from "react"
import type {
  LayoutSection,
  Layouts,
  SectionNameFor,
} from "@medusajs/admin-shared"

export type { LayoutSection, Layouts, SectionNameFor }

export type LayoutComponentProps = {
  sections: Record<string, ReactNode>
  data?: unknown
}

export type LayoutControlSize = "default" | "small" | "xsmall"

export type LayoutDefinition = {
  id: string
  sections: LayoutSection[]
  Component: ComponentType<LayoutComponentProps>
}

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
  Component: ComponentType
  widgetId: string
}
export type SectionWidgetMap = Record<string, WidgetRenderEntry[]>
