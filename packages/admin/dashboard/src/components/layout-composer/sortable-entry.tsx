import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DotsSix, Eye, EyeSlash } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"

type SortableEntryProps = {
  widgetId: string
  order: number
  hidden: boolean
  onToggleHidden: () => void
  children: ReactNode
}

export function SortableEntry({
  widgetId,
  order,
  hidden,
  onToggleHidden,
  children,
}: SortableEntryProps) {
  const { t } = useTranslation()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widgetId })

  // `CSS.Translate.toString` applies translate only, dropping the strategy's
  // scaleX/scaleY (which would stretch the dragged item to match the swapped
  // neighbor's box). The actual dragged ghost is rendered separately via
  // <DragOverlay>.
  const style = {
    transform: CSS.Translate.toString(transform),
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
          sections) these resolve to the content height, so they're inert.

          `peer` exposes the content's `:empty` state to the placeholder
          sibling below, which stands in when this entry currently renders
          nothing (e.g. a section that only appears while an edit is pending) —
          keeping it a visible, draggable card instead of a 0-height row. */}
      <div className="peer flex h-full flex-col [&>*]:h-full">{children}</div>
      {/* Shown (via `peer-[:empty]`) only when the content above renders no DOM,
          marking the slot as currently empty (the overlay already names it).
          Hidden the moment real content returns, so idle/edit layouts match. */}
      <div
        aria-hidden
        className="text-ui-fg-muted border-ui-border-strong hidden min-h-16 items-center justify-center rounded-lg border border-dashed px-2 text-center text-xs peer-[:empty]:flex"
      >
        {t("layout.empty")}
      </div>
      {/* Overlay rendered after children so it stacks above them by DOM order —
          no z-index needed, which keeps Radix portal dropdowns above us. */}
      <div className="bg-ui-bg-base shadow-elevation-card-rest absolute right-2 top-2 flex items-center gap-x-1 rounded-md p-1">
        <span className="text-ui-fg-muted px-1 font-mono text-xs">
          {widgetId} ({order})
        </span>
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
