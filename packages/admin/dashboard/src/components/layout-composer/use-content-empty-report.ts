import { useLayoutEffect, useRef } from "react"

/**
 * Reports whether an entry's rendered content is empty (renders no DOM).
 *
 * Core entries are derived statically from a section's JSX children — one per
 * child component, by name — but whether a given component actually renders
 * anything is dynamic (e.g. a section that returns `null` until an order edit
 * is pending). We can only know after render, so we measure the content node's
 * children on every commit and report changes up to the owner, which decides
 * whether the entry should participate in the layout at all.
 */
export function useContentEmptyReport(
  widgetId: string,
  onEmptyChange: (widgetId: string, isEmpty: boolean) => void
) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    onEmptyChange(widgetId, ref.current?.childNodes.length === 0)
  })

  return ref
}
