import { ReactNode } from "react"
import { useContentEmptyReport } from "./use-content-empty-report"

type EntryProbeProps = {
  widgetId: string
  onEmptyChange: (widgetId: string, isEmpty: boolean) => void
  children: ReactNode
}

/**
 * Stand-in for an entry whose content currently renders nothing.
 *
 * It registers no sortable, so it is never a drag handle nor a drop target —
 * keeping phantom 0-height rows out of edit mode. It renders with
 * `display: contents` so it adds no box of its own (no flex/grid slot, no
 * gap), yet still mounts `children` so we keep measuring them: the moment the
 * content starts rendering again it reports non-empty and the owner promotes
 * it back to a real `SortableEntry`.
 */
export function EntryProbe({
  widgetId,
  onEmptyChange,
  children,
}: EntryProbeProps) {
  const ref = useContentEmptyReport(widgetId, onEmptyChange)

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  )
}
