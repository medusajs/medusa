import {
  Children,
  ComponentType,
  Fragment,
  ReactElement,
  ReactNode,
  isValidElement,
} from "react"
import { CORE_CONTENT_ORDER } from "./constants"
import { LayoutPreference } from "./types"

export type DisplayEntry = {
  widgetId: string
  Component: ComponentType
  order: number
  hidden: boolean
  isCore: boolean
}

export type RawEntry = {
  widgetId: string
  Component: ComponentType
  order: number
  isCore: boolean
  naturalSection: string
}

// Core entries render their content via `elementById`, not via their
// `Component`, so the field only exists to satisfy the shared entry shape. A
// single shared no-op stands in for all of them rather than minting one per
// entry.
const CORE_PLACEHOLDER: ComponentType = () => null

/** Derives a stable string identifier from a React element's component type. */
function getElementName(element: ReactElement): string {
  const { type } = element
  if (typeof type === "string") return type
  return (
    (type as ComponentType).displayName ??
    (type as ComponentType).name ??
    "unknown"
  )
}

/**
 * Resolves the identity segment for a core element. Prefers an explicit
 * `layoutId` prop so an entry's id can survive component renames and
 * production minification (which mangles `Component.name`); otherwise falls
 * back to the component's display/function name.
 */
export function getCoreEntryKey(element: ReactElement): string {
  const explicit = (element.props as { layoutId?: unknown } | null)?.layoutId
  if (typeof explicit === "string" && explicit.length > 0) {
    return explicit
  }
  return getElementName(element)
}

export type BuiltCoreEntries = {
  entries: RawEntry[]
  /** Maps each entry's widgetId back to the element it should render. */
  elementById: Map<string, ReactElement>
}

export function buildCoreEntries(
  sectionName: string,
  elements: ReactElement[],
  // Tracks how many times each base id has been used so duplicates (same
  // component/name, or two anonymous elements) get distinct, deterministic ids
  // instead of silently colliding on keys, drag ids, and preference lookups.
  // The id intentionally omits the section, so a widget keeps its identity (and
  // saved preference) when its natural section changes in code — which means
  // dedup must be shared across sections by the caller to catch same-named
  // entries that live in different sections.
  seen: Map<string, number> = new Map()
): BuiltCoreEntries {
  const entries: RawEntry[] = []
  const elementById = new Map<string, ReactElement>()

  elements.forEach((el, i) => {
    const name = getCoreEntryKey(el)
    const base = `core:${name}`
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const widgetId = count === 0 ? base : `${base}#${count + 1}`

    entries.push({
      Component: CORE_PLACEHOLDER,
      widgetId,
      order: CORE_CONTENT_ORDER + i,
      isCore: true,
      naturalSection: sectionName,
    })
    elementById.set(widgetId, el)
  })

  return { entries, elementById }
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
 *
 * `validSections` is the set of section ids the active layout actually renders.
 * A stored `section` override that points at a section which no longer exists
 * (layout switched, section renamed/removed) is ignored so the entry falls back
 * to its natural section instead of vanishing into an unrendered bucket.
 */
export function buildDisplayEntries(
  raw: RawEntry[],
  preference: LayoutPreference,
  validSections: Set<string>
): Record<string, DisplayEntry[]> {
  const result: Record<string, DisplayEntry[]> = {}
  for (const entry of raw) {
    const pref = preference.widgets[entry.widgetId]
    const overrideSection =
      pref?.section && validSections.has(pref.section)
        ? pref.section
        : undefined
    const effectiveSection = overrideSection ?? entry.naturalSection
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

/** Order value that appends an entry to the end of a section. */
export function appendOrder(entries: DisplayEntry[]): number {
  return entries.length > 0 ? Math.max(...entries.map((e) => e.order)) + 1 : 1
}

/**
 * Order value that inserts an entry just before the entry identified by
 * `overId` within `entries`. Falls back to appending when `overId` isn't a
 * member of `entries` (e.g. a drop on the section body/tail).
 */
export function insertOrderBefore(
  entries: DisplayEntry[],
  overId: string
): number {
  const overIndex = entries.findIndex((e) => e.widgetId === overId)
  if (overIndex === -1) {
    return appendOrder(entries)
  }
  const before = overIndex > 0 ? entries[overIndex - 1] : null
  const after = entries[overIndex]
  return before ? (before.order + after.order) / 2 : after.order - 1
}
