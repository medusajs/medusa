import {
  CollisionDetection,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { DisplayEntry } from "../components/layout-composer/entries"
import {
  getSectionIdFromTailId,
  isSectionTailId,
} from "../components/layout-composer/entries"
import type { LayoutPreference } from "../components/layout-composer/types"

/**
 * Resolves the section a drop landed in. `overId` may be a section body, a
 * section's tail drop zone, or a specific entry.
 */
function resolveOverSection(
  overId: string,
  sectionIds: Set<string>,
  widgetSectionMap: Record<string, string>
): string | undefined {
  if (sectionIds.has(overId)) {
    return overId
  }
  if (isSectionTailId(overId)) {
    const sectionId = getSectionIdFromTailId(overId)
    return sectionIds.has(sectionId) ? sectionId : undefined
  }
  return widgetSectionMap[overId]
}

/**
 * Whether `id` targets a section container — its body or trailing drop zone —
 * rather than a specific entry. Used both to de-prioritize containers during
 * collision detection and to detect an "append to end" drop.
 */
function isContainerTarget(id: string, sectionIds: Set<string>): boolean {
  return sectionIds.has(id) || isSectionTailId(id)
}

type UseLayoutDndOptions = {
  entriesBySection: Record<string, DisplayEntry[]>
  widgetSectionMap: Record<string, string>
  validSectionIds: Set<string>
  setDraft: Dispatch<SetStateAction<LayoutPreference | null>>
}

/**
 * Encapsulates the drag-and-drop behavior of the layout composer: sensors,
 * cursor-first collision detection, and the drag handlers that rewrite the
 * draft preference as entries are moved within and across sections.
 */
export function useLayoutDnd({
  entriesBySection,
  widgetSectionMap,
  validSectionIds,
  setDraft,
}: UseLayoutDndOptions) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  // Last valid collision id during the current drag. Used to stabilize the
  // over-id when the cursor briefly leaves all droppables (column gutter,
  // padding, etc.) so the insertion slot doesn't flicker.
  const lastOverIdRef = useRef<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Write sequential integer `order`s (0..n) for a section's entries into the
   * draft, pinning each to `sectionId`. Renumbering the whole section on every
   * move keeps orders as clean, collision-free integers. Pinning the absolute
   * section (rather than a delta against the natural section) means the stored
   * preference fully determines placement, so a later change to a widget's
   * registered zone can't drag a user-placed widget out from under it.
   */
  function reindexSection(sectionId: string, orderedWidgetIds: string[]) {
    setDraft((prev) => {
      if (!prev) {
        return prev
      }
      const widgets = { ...prev.widgets }
      orderedWidgetIds.forEach((id, index) => {
        widgets[id] = { ...widgets[id], section: sectionId, order: index }
      })
      return { ...prev, widgets }
    })
  }

  /**
   * Move a widget into `overSection`, inserting it just before `overId` — or at
   * the end when `overId` is the section body/tail (and thus not one of the
   * section's entries).
   */
  function moveToSection(
    activeWidgetId: string,
    overSection: string,
    overId: string
  ) {
    const ids = (entriesBySection[overSection] ?? []).map((e) => e.widgetId)
    const overIndex = ids.indexOf(overId)
    ids.splice(overIndex === -1 ? ids.length : overIndex, 0, activeWidgetId)
    reindexSection(overSection, ids)
  }

  /**
   * Cursor-first collision detection with sticky fallback.
   *
   * 1. `pointerWithin` resolves the droppable the cursor is literally over —
   *    immune to overlay-rect drift.
   * 2. If the cursor is in dead space (column gutter, padding) `pointerWithin`
   *    returns nothing. Rather than letting `closestCenter` pick whichever
   *    widget the overlay happens to mostly cover (which flickers with tiny
   *    pointer movements), we reuse the last valid over-id from this drag.
   * 3. If we have no history yet (drag just started in dead space), fall back
   *    to `closestCenter`.
   *
   * Section dropzones are de-prioritized in favor of widgets so the slot
   * anchors to a real entry whenever one is in range.
   */
  const collisionDetection: CollisionDetection = (args) => {
    // Section bodies and their tail drop zones are container targets — prefer a
    // real entry over them whenever one is in range so the insertion slot
    // anchors to a widget rather than the whole column or the end zone.
    const preferWidget = (
      collisions: ReturnType<typeof closestCenter>
    ): ReturnType<typeof closestCenter> => {
      const widget = collisions.find(
        (c) => !isContainerTarget(c.id as string, validSectionIds)
      )
      return widget ? [widget] : collisions
    }

    const pointer = pointerWithin(args)
    if (pointer.length > 0) {
      const chosen = preferWidget(pointer)
      if (chosen.length > 0) {
        lastOverIdRef.current = chosen[0].id as string
      }
      return chosen
    }

    if (lastOverIdRef.current !== null) {
      return [{ id: lastOverIdRef.current, data: { droppableContainer: null } }]
    }

    // No pointer hit and no history yet (drag just started in dead space) —
    // anchor to the closest entry so we still have a slot.
    const closest = preferWidget(closestCenter(args))
    if (closest.length > 0) {
      lastOverIdRef.current = closest[0].id as string
    }
    return closest
  }

  /**
   * Resolves a drag event into the move it describes, or `null` when there's
   * nothing actionable: no drop target, dropped onto itself, or a target whose
   * section can't be resolved. Shared by the live `onDragOver` and the
   * `onDragEnd` fallback.
   */
  function resolveMove(event: DragOverEvent | DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return null
    }

    const activeWidgetId = active.id as string
    const overId = over.id as string
    const activeSection = widgetSectionMap[activeWidgetId]
    const overSection = resolveOverSection(
      overId,
      validSectionIds,
      widgetSectionMap
    )
    if (!activeSection || !overSection) {
      return null
    }

    return { activeWidgetId, overId, activeSection, overSection }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string)
    lastOverIdRef.current = null
  }

  /**
   * Fires continuously while dragging. When the cursor crosses into a
   * different section, we move the dragged item into that section's
   * `SortableContext` immediately so the items there shift to make room
   * *before* release. `handleDragEnd` still covers cross-section moves as a
   * fallback for keyboard-driven drags that never fire `onDragOver`.
   */
  function handleDragOver(event: DragOverEvent) {
    const move = resolveMove(event)
    if (!move || move.activeSection === move.overSection) {
      return
    }
    moveToSection(move.activeWidgetId, move.overSection, move.overId)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    lastOverIdRef.current = null

    const move = resolveMove(event)
    if (!move) {
      return
    }
    const { activeWidgetId, overId, activeSection, overSection } = move

    // Cross-section moves are normally handled live by `handleDragOver`; this
    // covers keyboard-driven drags that never fire it. Pins the absolute
    // section the widget ends up in (see `moveToSection`).
    if (activeSection !== overSection) {
      moveToSection(activeWidgetId, overSection, overId)
      return
    }

    const ids = (entriesBySection[overSection] ?? []).map((e) => e.widgetId)
    const oldIndex = ids.indexOf(activeWidgetId)
    // Dropped on the section body/tail → move to the end; otherwise to the slot
    // of the entry under the cursor.
    const newIndex = isContainerTarget(overId, validSectionIds)
      ? ids.length - 1
      : ids.indexOf(overId)
    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    reindexSection(activeSection, arrayMove(ids, oldIndex, newIndex))
  }

  // Active drag entry, used by DragOverlay to render the moving ghost.
  const activeEntry = activeDragId
    ? Object.values(entriesBySection)
        .flat()
        .find((e) => e.widgetId === activeDragId)
    : null

  return {
    sensors,
    collisionDetection,
    activeDragId,
    activeEntry,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
