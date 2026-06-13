import { useSortable } from "@dnd-kit/sortable"
import { DotsSix, Eye, EyeSlash } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import { useContentEmptyReport } from "./use-content-empty-report"

type SortableEntryProps = {
  widgetId: string
  hidden: boolean
  onToggleHidden: () => void
  onEmptyChange: (widgetId: string, isEmpty: boolean) => void
  children: ReactNode
}

export function SortableEntry({
  widgetId,
  hidden,
  onToggleHidden,
  onEmptyChange,
  children,
}: SortableEntryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId })

  // Keep measuring our content: if it stops rendering anything (e.g. a section
  // that only shows while an edit is pending) we report empty and the owner
  // swaps us for a non-sortable probe so we don't leave a bare control row.
  const contentRef = useContentEmptyReport(widgetId, onEmptyChange)

  // Strip the strategy's scaleX/scaleY (which would stretch the dragged item
  // to match the swapped neighbor's box) and apply translate only. The actual
  // dragged ghost is rendered separately via <DragOverlay>.
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clx(
        // `min-w-0` lets the entry shrink below its content's intrinsic width
        // when a layout stretches it into equal grid/flex tracks. The author's
        // container can't set this via `[&>*]` because the `display: contents`
        // SortableContext wrapper hides its children from the `>` combinator.
        "ring-ui-border-base relative min-w-0 rounded-lg ring-1 transition-opacity",
        // Hidden entries are clearly de-emphasized during edit mode so the
        // user can tell at a glance which ones won't render at idle.
        hidden && "opacity-30 grayscale",
        // Hide the original while it's being dragged — the DragOverlay shows
        // the moving copy. Visibility (not display:none) keeps the layout box
        // in place so neighbors can shift against it.
        isDragging && "invisible"
      )}
    >
      {/* `flex flex-col` makes the rendered content a flex item again (as it
          is in idle mode), so it re-establishes its own block formatting
          context and contains any trailing margins of its children — without
          this, a child's bottom margin escapes through these plain wrapper
          divs and inflates this box past the content's background.

          `h-full` + `[&>*]:h-full` let the content fill the wrapper when a
          layout stretches the entry to a fixed height (e.g. a grid section
          equalizing row heights). When the wrapper height is auto (list
          sections) these resolve to the content height, so they're inert. */}
      <div ref={contentRef} className="flex h-full flex-col [&>*]:h-full">
        {children}
      </div>
      {/* Overlay rendered after children so it stacks above them by DOM order —
          no z-index needed, which keeps Radix portal dropdowns above us. */}
      <div className="bg-ui-bg-base shadow-elevation-card-rest absolute right-2 top-2 flex items-center gap-x-1 rounded-md p-1">
        <IconButton
          size="2xsmall"
          variant="transparent"
          onClick={onToggleHidden}
          aria-label={hidden ? "Show" : "Hide"}
        >
          {hidden ? <EyeSlash /> : <Eye />}
        </IconButton>
        <button
          type="button"
          className="text-ui-fg-muted cursor-grab touch-none rounded p-1 focus:outline-none"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <DotsSix />
        </button>
      </div>
    </div>
  )
}
