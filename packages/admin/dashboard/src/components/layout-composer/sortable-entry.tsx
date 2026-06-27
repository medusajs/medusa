import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DotsSix, Eye, EyeSlash } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import type { LayoutControlSize } from "./types"

/**
 * An entry's rendered content plus a placeholder that appears (via the
 * `peer`/`:empty` pair) only when that content produces no DOM — e.g. a section
 * that exists solely while an edit is pending. Keeps such an entry a visible,
 * labeled card rather than collapsing to a 0-height row. Shared by the in-place
 * `SortableEntry` and the `DragOverlay` ghost so the two never drift.
 *
 * `empty:hidden` collapses the content box when it renders nothing so it stops
 * reserving height — otherwise a layout that stretches the entry (e.g. a grid
 * equalizing row heights) would size the empty content to the full cell and
 * stack the placeholder below it, showing two boxes for one empty entry.
 */
export function EntryContent({
  children,
  className,
  placeholderClassName,
}: {
  children: ReactNode
  className?: string
  placeholderClassName?: string
}) {
  const { t } = useTranslation()
  return (
    <>
      <div className={clx("peer flex flex-col empty:hidden", className)}>
        {children}
      </div>
      <div
        aria-hidden
        className={clx(
          "text-ui-fg-muted hidden min-h-16 items-center justify-center px-2 text-center text-xs peer-[:empty]:flex",
          placeholderClassName
        )}
      >
        {t("layout.empty")}
      </div>
    </>
  )
}

type SortableEntryProps = {
  widgetId: string
  order: number
  hidden: boolean
  onToggleHidden: () => void
  children: ReactNode
  controlSize?: LayoutControlSize
}

export function SortableEntry({
  widgetId,
  order,
  hidden,
  onToggleHidden,
  children,
  controlSize = "default",
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

  const xsmall = controlSize === "xsmall"
  const small = controlSize === "small"
  const showLabel = controlSize === "default"

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
      <EntryContent
        className="h-full [&>*]:h-full"
        placeholderClassName="border-ui-border-strong h-full rounded-lg border border-dashed"
      >
        {children}
      </EntryContent>
      {/* Overlay rendered after children so it stacks above them by DOM order */}
      <div
        className={clx(
          "bg-ui-bg-base shadow-elevation-card-rest absolute flex items-center rounded-md",
          xsmall && "right-0 top-0 flex-col gap-y-0.5 p-0 opacity-50",
          small && "right-1.5 top-1.5 gap-x-0.5 p-0.5",
          showLabel && "right-2 top-2 gap-x-1 p-1"
        )}
      >
        {showLabel && (
          <span className="text-ui-fg-muted px-1 font-mono text-xs">
            {widgetId} ({order})
          </span>
        )}
        <IconButton
          size="2xsmall"
          variant="transparent"
          onClick={onToggleHidden}
          aria-label={hidden ? t("actions.show") : t("actions.hide")}
          className={clx(xsmall && "h-3 w-3 p-0", small && "h-3.5 w-3.5 p-0.5")}
        >
          {hidden ? <EyeSlash /> : <Eye />}
        </IconButton>
        <button
          type="button"
          className={clx(
            "text-ui-fg-muted cursor-grab touch-none rounded focus:outline-none",
            xsmall && "p-0",
            small && "p-0.5",
            showLabel && "p-1"
          )}
          {...attributes}
          {...listeners}
          aria-label={t("layout.dragToReorder")}
        >
          <DotsSix />
        </button>
      </div>
    </div>
  )
}
