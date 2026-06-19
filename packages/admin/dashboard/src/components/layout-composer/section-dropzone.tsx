import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Text, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import type { LayoutSection } from "./types"
import { getSectionTailId } from "./entries"

type SectionTailProps = {
  sectionId: string
  className?: string
}

/**
 * A persistent drop area at the end of a section. Without it the only place to
 * drop something "at the end" is the few pixels past the last entry, with no
 * visual cue that a cross-section move landed. This gives a generous, clearly
 * marked target that highlights while hovered.
 */
function SectionTail({ sectionId, className }: SectionTailProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: getSectionTailId(sectionId),
  })
  const { t } = useTranslation()

  return (
    <div
      ref={setNodeRef}
      className={clx(
        "text-ui-fg-muted flex min-h-16 items-center justify-center rounded-lg border border-dashed transition-colors",
        isOver
          ? "border-ui-border-interactive bg-ui-bg-highlight text-ui-fg-subtle"
          : "border-ui-border-strong",
        className
      )}
      // Faint diagonal stripes mark this as a drop area rather than content.
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, rgb(212 212 216 / 0.12), rgb(212 212 216 / 0.12) 10px, transparent 10px, transparent 20px)",
      }}
    >
      <Text size="small" leading="compact">
        {t("layout.dropToSectionEnd")}
      </Text>
    </div>
  )
}

type SectionDropzoneProps = {
  section: LayoutSection
  items: string[]
  children: ReactNode
}

/**
 * Renders the droppable/sortable area for a single layout section in edit
 * mode. The visual treatment branches on `section.ordering`:
 *
 * - `"list"`: we own a flex-column container (matches idle-mode stacking),
 *   sorted with `verticalListSortingStrategy`.
 * - `"grid"`: we stay out of the way with `display: contents` so the
 *   `SortableEntry` wrappers become direct children of whatever grid (or
 *   other) container the `LayoutComponent` defines for this section,
 *   preserving its column count/gaps/breakpoints. Sorted with
 *   `rectSortingStrategy`, which computes swaps from real 2D rects instead
 *   of assuming a single vertical axis. When the section is empty there's no
 *   element to anchor the droppable to, so we render a full-width placeholder
 *   box instead.
 * - `"horizontal"`: owns a single, non-wrapping flex row (like `"list"` owns a
 *   column), sorted with `horizontalListSortingStrategy`. `[&>*]:flex-1` gives
 *   each entry an equal share of the width and `[&>*]:min-w-0` lets them shrink
 *   so wide content truncates instead of forcing unequal widths. Owning the
 *   container (rather than delegating via `display: contents` like `"grid"`)
 *   is deliberate: the `[&>*]` utilities are applied by the entries' direct
 *   parent, so they actually reach them in edit mode. No `SectionTail` — a
 *   width-filling row has no end gap; reordering past the last item covers end
 *   placement.
 *
 * `"list"` and `"grid"` render a `SectionTail` last as a generous
 * end-of-section drop target.
 */
export function SectionDropzone({
  section,
  items,
  children,
}: SectionDropzoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: section.id })

  if (section.ordering === "grid") {
    return (
      <SortableContext items={items} strategy={rectSortingStrategy}>
        {items.length === 0 ? (
          <div
            ref={setNodeRef}
            className={clx(
              "col-span-full min-h-10 w-full rounded-md transition-colors",
              isOver && "bg-ui-bg-highlight"
            )}
          />
        ) : (
          // `display: contents` keeps the SortableEntry wrappers as direct
          // children of the author's grid, so this node has no box of its own.
          // Drops onto the grid are covered by the entries and the SectionTail.
          <div className="contents">{children}</div>
        )}
        <SectionTail sectionId={section.id} className="col-span-full" />
      </SortableContext>
    )
  }

  if (section.ordering === "horizontal") {
    return (
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={clx(
            "flex min-h-10 flex-row items-stretch gap-x-3 rounded-md transition-colors [&>*]:min-w-0 [&>*]:flex-1",
            isOver && items.length === 0 && "bg-ui-bg-highlight"
          )}
        >
          {children}
        </div>
      </SortableContext>
    )
  }

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div
        ref={setNodeRef}
        className={clx(
          "flex min-h-10 flex-col gap-y-3 rounded-md transition-colors",
          isOver && items.length === 0 && "bg-ui-bg-highlight"
        )}
      >
        {children}
        <SectionTail sectionId={section.id} />
      </div>
    </SortableContext>
  )
}
