import {
  Children,
  ComponentType,
  Fragment,
  ReactElement,
  ReactNode,
  isValidElement,
} from "react"
import { LayoutPreference } from "./types"

// Both core entries and widgets carry a `render` thunk so the rest of the
// composer treats them uniformly: core entries return their prebuilt element
// (ignoring `data`), widgets render their component with the page `data`. The
// thunk is what keeps `data` out of the layout-model memo — rendering is
// deferred to call time rather than baked into the entry.
export type EntryRenderer = (data: unknown) => ReactNode

export type DisplayEntry = {
  widgetId: string
  render: EntryRenderer
  order: number
  hidden: boolean
}

export type RawEntry = {
  widgetId: string
  render: EntryRenderer
  naturalSection: string
}

/** Derives a stable string identifier from a React element's component type. */
function getElementName(element: ReactElement): string {
  const { type } = element
  if (typeof type === "string") {
    return type
  }
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
function getCoreEntryKey(element: ReactElement): string {
  const explicit = (element.props as { layoutId?: unknown } | null)?.layoutId
  if (typeof explicit === "string" && explicit.length > 0) {
    return explicit
  }
  return getElementName(element)
}

/**
 * Builds a core entry for every element across all sections, in source order.
 * Each entry renders its own prebuilt element.
 *
 * Duplicate ids (same component/name, or two anonymous elements) are
 * disambiguated with a `#n` suffix via a single `seen` map shared across all
 * sections — so two same-named entries in different sections still get distinct,
 * deterministic ids and don't collide on keys, drag ids, or preference lookups.
 * The id intentionally omits the section, so an entry keeps its identity (and
 * saved preference) when its natural section changes in code.
 */
export function buildCoreEntries(
  elementsBySection: Record<string, ReactElement[]>
): RawEntry[] {
  const entries: RawEntry[] = []
  const seen = new Map<string, number>()

  for (const [sectionName, elements] of Object.entries(elementsBySection)) {
    for (const el of elements) {
      const name = getCoreEntryKey(el)
      const base = `core:${name}`
      const count = seen.get(base) ?? 0
      seen.set(base, count + 1)
      const widgetId = count === 0 ? base : `${base}#${count + 1}`

      entries.push({
        widgetId,
        render: () => el,
        naturalSection: sectionName,
      })
    }
  }

  return entries
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
function collectElements(node: ReactNode): ReactElement[] {
  const elements: ReactElement[] = []
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) {
      return
    }
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
    // Entries with no saved order share order 0; their relative placement
    // (widgets before core, each group in source order) comes from insertion
    // order preserved by the stable sort below.
    const effectiveOrder = pref?.order ?? 0
    const hidden = pref?.hidden ?? false
    if (!result[effectiveSection]) {
      result[effectiveSection] = []
    }
    result[effectiveSection].push({
      widgetId: entry.widgetId,
      render: entry.render,
      order: effectiveOrder,
      hidden,
    })
  }
  for (const k of Object.keys(result)) {
    result[k].sort((a, b) => a.order - b.order)
  }
  return result
}

export const SECTION_TAIL_SUFFIX = "::tail"

export const isSectionTailId = (id: string) => id.endsWith(SECTION_TAIL_SUFFIX)

export const getSectionIdFromTailId = (id: string) =>
  id.slice(0, -SECTION_TAIL_SUFFIX.length)

// A section's trailing drop zone gets its own droppable id, derived from the
// section id, so the drag handlers can tell "dropped at the end of a section"
// apart from "dropped onto a specific entry". Kept here next to the component
// that renders it.
export const getSectionTailId = (sectionId: string) =>
  `${sectionId}${SECTION_TAIL_SUFFIX}`
