import {
  Children,
  ComponentType,
  Fragment,
  ReactElement,
  ReactNode,
  isValidElement,
} from "react"
import { CORE_CONTENT_ORDER, LayoutPreference } from "@medusajs/admin-shared"

export type DisplayEntry = {
  widgetId: string
  Component: ComponentType
  order: number
  hidden: boolean
  isCore: boolean
}

export type CoreEntry = {
  Component: ComponentType
  widgetId: string
  order: number
  isCore: true
  naturalSection: string
}

export type RawEntry = {
  widgetId: string
  Component: ComponentType
  order: number
  isCore: boolean
  naturalSection: string
}

/** Derives a stable string identifier from a React element's component type. */
export function getElementName(element: ReactElement): string {
  const { type } = element
  if (typeof type === "string") return type
  return (
    (type as ComponentType).displayName ??
    (type as ComponentType).name ??
    "unknown"
  )
}

export function buildCoreEntries(
  sectionName: string,
  elements: ReactElement[]
): CoreEntry[] {
  return elements.map((el, i) => {
    const name = getElementName(el)
    const widgetId = `core:${sectionName}:${name}`
    function C(): null {
      return null
    }
    C.displayName = name
    return {
      Component: C,
      widgetId,
      order: CORE_CONTENT_ORDER + i,
      isCore: true as const,
      naturalSection: sectionName,
    }
  })
}

export function extractSectionElements(
  sections: Record<string, ReactNode>
): Record<string, ReactElement[]> {
  const result: Record<string, ReactElement[]> = {}
  for (const [sectionName, node] of Object.entries(sections)) {
    result[sectionName] = collectElements(node)
  }
  return result
}

/**
 * Flattens a section's children into individual ReactElements, unwrapping
 * fragments so each direct child component becomes its own customizer entry.
 */
export function collectElements(node: ReactNode): ReactElement[] {
  const elements: ReactElement[] = []
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return
    if (child.type === Fragment) {
      const fragmentChildren = (child.props as { children?: ReactNode })
        .children
      elements.push(...collectElements(fragmentChildren))
      return
    }
    elements.push(child)
  })
  return elements
}

/**
 * Merges all entries (core + widgets) and applies a preference, returning a
 * map of effective-section → DisplayEntry[] sorted by order. Includes hidden
 * entries (with `hidden: true`) so the renderer can ghost them in edit mode.
 */
export function buildDisplayEntries(
  raw: RawEntry[],
  preference: LayoutPreference
): Record<string, DisplayEntry[]> {
  const result: Record<string, DisplayEntry[]> = {}
  for (const entry of raw) {
    const pref = preference.widgets[entry.widgetId]
    const effectiveSection = pref?.section ?? entry.naturalSection
    const effectiveOrder = pref?.order ?? entry.order
    const hidden = pref?.hidden ?? false
    if (!result[effectiveSection]) result[effectiveSection] = []
    result[effectiveSection].push({
      widgetId: entry.widgetId,
      Component: entry.Component,
      order: effectiveOrder,
      hidden,
      isCore: entry.isCore,
    })
  }
  for (const k of Object.keys(result)) {
    result[k].sort((a, b) => a.order - b.order)
  }
  return result
}
