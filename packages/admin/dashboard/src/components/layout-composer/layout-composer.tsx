import {
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { AdjustmentsDone } from "@medusajs/icons"
import { Badge, Button, IconButton, usePrompt } from "@medusajs/ui"
import {
  ComponentType,
  Fragment,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import { useLayoutCustomizerTriggerHost } from "./customizer-host"
import {
  DisplayEntry,
  RawEntry,
  buildCoreEntries,
  buildDisplayEntries,
  extractSectionElements,
} from "./entries"
import {
  SectionDropzone,
  getSectionIdFromTailId,
  isSectionTailId,
} from "./section-dropzone"
import { EntryContent, SortableEntry } from "./sortable-entry"
import type {
  LayoutPreference,
  SectionNameFor,
  Layouts,
  WidgetPreference,
} from "./types"
import { useLayoutPreference, type LayoutScope } from "./use-layout-preference"

type LayoutComposerProps<TLayoutId extends Layouts, TData> = {
  /**
   * The prefix used to derive widget injection zones, typically corresponds to the page.
   * E.g. `"login"`, `"product.list"`, `"product.details"` etc.
   */
  widgetsZonePrefix: string
  /**
   * The id of the layout that should be used to render the page. E.g `"core:two-column"` or `"core:single-column"`.
   */
  preferredLayoutId: TLayoutId
  /**
   * The content to render in each section of the layout, keyed by the
   * section names valid for `preferredLayoutId`.
   */
  sections: Record<SectionNameFor<TLayoutId>, ReactNode>
  /**
   * Data passed to the layout components(core + widgets) as props
   */
  data?: TData
  /**
   * Whether to render an `Outlet` after the layout, used to render modals such as drawers and dialogs.
   *
   * @default true
   */
  hasOutlet?: boolean
}

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

/**
 * Whether two preferences describe the same layout. A widget with no
 * meaningful overrides is treated as absent so that toggling a setting and
 * back — or simply switching between scopes without editing — doesn't register
 * as a change.
 */
function isSamePreference(a: LayoutPreference, b: LayoutPreference): boolean {
  const keys = new Set([...Object.keys(a.widgets), ...Object.keys(b.widgets)])
  for (const key of keys) {
    const aw = a.widgets[key]
    const bw = b.widgets[key]
    if (!!aw?.hidden !== !!bw?.hidden) return false
    if (aw?.order !== bw?.order) return false
    if (aw?.section !== bw?.section) return false
  }
  return true
}

export const LayoutComposer = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
}: LayoutComposerProps<TLayoutId, TData>) => {
  const { getWidgetsForSections, getLayout } = useExtension()
  const { personalPreference, defaultPreference, activeScope, setPreference } =
    useLayoutPreference(widgetsZonePrefix)
  const triggerHost = useLayoutCustomizerTriggerHost()
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<LayoutPreference | null>(null)
  // Which configuration the current edit session is targeting: the user's
  // personal layout or the zone's shared default.
  const [editScope, setEditScope] = useState<LayoutScope>("personal")
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  // Last valid collision id during the current drag. Used to stabilize the
  // over-id when the cursor briefly leaves all droppables (column gutter,
  // padding, etc.) so the insertion slot doesn't flicker.
  const lastOverIdRef = useRef<string | null>(null)

  function preferenceForScope(scope: LayoutScope): LayoutPreference {
    return scope === "default" ? defaultPreference : personalPreference
  }

  const activePreference: LayoutPreference =
    editMode && draft ? draft : preferenceForScope(activeScope)

  // Whether the current draft actually differs from the persisted preference
  // for the scope being edited. Switching between scopes without making edits
  // leaves this false, so saving is a no-op confirmation we can streamline.
  const hasChanges =
    editMode && draft
      ? !isSamePreference(draft, preferenceForScope(editScope))
      : false

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // TODO: Implement switching between compatible layouts
  const layoutId = preferredLayoutId

  const layout = getLayout(layoutId)

  // Derive the layout model: core + widget entries placed into their effective
  // sections with the active preference applied. Memoized so it isn't rebuilt
  // on unrelated re-renders (e.g. drag start) — only when the sections,
  // registered widgets, or active preference actually change.
  const { entriesBySection, widgetSectionMap, validSectionIds } =
    useMemo(() => {
      const elementsBySection = extractSectionElements(
        sections as Record<string, ReactNode>
      )
      const naturalWidgets = getWidgetsForSections(
        widgetsZonePrefix,
        layout?.sections?.map((s) => s.id) ?? []
      )

      // Build raw entries (core + widgets) at their natural sections. Relative
      // placement before any user preference comes purely from the order they
      // are pushed here, preserved by the stable sort in `buildDisplayEntries`.
      // Widgets are pushed before core entries so they render first by default —
      // and so a newly added widget or core entry (which has no saved order)
      // surfaces at the top.
      const rawEntries: RawEntry[] = []
      for (const [naturalSection, widgets] of Object.entries(naturalWidgets)) {
        for (const w of widgets) {
          const WidgetComponent = w.Component as ComponentType<{
            data?: unknown
          }>
          rawEntries.push({
            widgetId: w.widgetId,
            render: (data) => <WidgetComponent data={data} />,
            naturalSection,
          })
        }
      }
      rawEntries.push(...buildCoreEntries(elementsBySection))

      // Apply the active preference (draft when editing, persisted otherwise),
      // keeping hidden entries with `hidden: true` so we can ghost them in edit
      // mode.
      const validSectionIds = new Set(layout?.sections.map((s) => s.id) ?? [])
      const entriesBySection = buildDisplayEntries(
        rawEntries,
        activePreference,
        validSectionIds
      )

      // Maps each entry's widgetId to the section it currently renders in.
      // Shared by collision detection and the drag handlers to resolve the
      // active/over sections of a move.
      const widgetSectionMap: Record<string, string> = {}
      for (const [sectionId, entries] of Object.entries(entriesBySection)) {
        for (const e of entries) {
          widgetSectionMap[e.widgetId] = sectionId
        }
      }

      return {
        entriesBySection,
        widgetSectionMap,
        validSectionIds,
      }
    }, [sections, widgetsZonePrefix, layout, activePreference, getWidgetsForSections])

  // Renders a single entry for the current mode: plain content at idle, a
  // sortable wrapper with chrome in edit mode. An entry that currently renders
  // nothing stays a sortable card showing a placeholder (see `SortableEntry`),
  // so it remains visible and placeable rather than collapsing to a bare row.
  function renderEntry(entry: DisplayEntry): ReactNode {
    const content = entry.render(data)
    if (!editMode) {
      return <Fragment key={entry.widgetId}>{content}</Fragment>
    }
    return (
      <SortableEntry
        key={entry.widgetId}
        widgetId={entry.widgetId}
        order={entry.order}
        hidden={entry.hidden}
        onToggleHidden={() => toggleHidden(entry.widgetId)}
      >
        {content}
      </SortableEntry>
    )
  }

  function toggleHidden(widgetId: string) {
    setDraft((prev) => {
      if (!prev) return prev
      const current = prev.widgets[widgetId] ?? {}
      const nextWidget: WidgetPreference = {
        ...current,
        hidden: !current.hidden,
      }
      return {
        ...prev,
        widgets: { ...prev.widgets, [widgetId]: nextWidget },
      }
    })
  }

  function enterEdit() {
    setEditScope(activeScope)
    setDraft(preferenceForScope(activeScope))
    setEditMode(true)
  }

  function switchScope(scope: LayoutScope) {
    if (scope === editScope) return
    setEditScope(scope)
    setDraft(preferenceForScope(scope))
  }

  async function commitEdit() {
    if (editScope === "default" && hasChanges) {
      const confirmed = await prompt({
        title: t("layout.saveForEveryoneTitle"),
        description: t("layout.saveForEveryoneDescription"),
        confirmText: t("layout.saveForEveryone"),
        cancelText: t("actions.cancel"),
      })
      if (!confirmed) {
        return
      }
    }

    if (draft) setPreference(draft, { asDefault: editScope === "default" })
    // The saved scope is persisted as the active view server-side, so the
    // refetched configuration keeps showing it after exiting edit mode.
    setEditMode(false)
    setDraft(null)
  }

  function cancelEdit() {
    setEditMode(false)
    setDraft(null)
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string)
    lastOverIdRef.current = null
  }

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
      if (!prev) return prev
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
    if (!over || active.id === over.id) return null

    const activeWidgetId = active.id as string
    const overId = over.id as string
    const activeSection = widgetSectionMap[activeWidgetId]
    const overSection = resolveOverSection(
      overId,
      validSectionIds,
      widgetSectionMap
    )
    if (!activeSection || !overSection) return null

    return { activeWidgetId, overId, activeSection, overSection }
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
    if (!move || move.activeSection === move.overSection) return
    moveToSection(move.activeWidgetId, move.overSection, move.overId)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    lastOverIdRef.current = null

    const move = resolveMove(event)
    if (!move) return
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
    if (oldIndex === -1 || newIndex === -1) return

    reindexSection(activeSection, arrayMove(ids, oldIndex, newIndex))
  }

  const LayoutComponent = layout?.Component
  if (!LayoutComponent) {
    return null
  }

  const renderedSections: Record<string, ReactNode> = {}
  for (const section of layout.sections) {
    const entries = entriesBySection[section.id] ?? []
    const visibleEntries = editMode ? entries : entries.filter((e) => !e.hidden)
    const renderedItems = visibleEntries.map(renderEntry)

    renderedSections[section.id] = editMode ? (
      <SectionDropzone
        section={section}
        items={visibleEntries.map((e) => e.widgetId)}
      >
        {renderedItems}
      </SectionDropzone>
    ) : (
      renderedItems
    )
  }

  // Active drag entry, used by DragOverlay to render the moving ghost.
  const activeEntry = activeDragId
    ? Object.values(entriesBySection)
        .flat()
        .find((e) => e.widgetId === activeDragId)
    : null

  // Customizer controls — all live in the single top-bar portal slot.
  // Idle: the trigger icon. Editing: Personal/Default badges to switch which
  // configuration is being edited (active one highlighted), Cancel, and a Save
  // button that targets the active scope ("Save for everyone" for the default).
  const controls = editMode ? (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-1">
        <Badge
          size="xsmall"
          color={editScope === "personal" ? "blue" : "grey"}
          className="cursor-pointer"
          onClick={() => switchScope("personal")}
        >
          {t("layout.personalView")}
        </Badge>
        <Badge
          size="xsmall"
          color={editScope === "default" ? "blue" : "grey"}
          className="cursor-pointer"
          onClick={() => switchScope("default")}
        >
          {t("layout.defaultView")}
        </Badge>
      </div>
      <Button size="small" variant="secondary" onClick={cancelEdit}>
        {t("actions.cancel")}
      </Button>
      <Button size="small" variant="primary" onClick={commitEdit}>
        {editScope === "default" && hasChanges
          ? t("layout.saveForEveryone")
          : t("actions.save")}
      </Button>
    </div>
  ) : (
    <IconButton
      size="small"
      variant="transparent"
      onClick={enterEdit}
      aria-label={t("layout.customizeWidgets")}
      className="text-ui-fg-muted hover:text-ui-fg-subtle"
    >
      <AdjustmentsDone />
    </IconButton>
  )

  const layoutNode = <LayoutComponent sections={renderedSections} data={data} />

  return (
    <>
      {triggerHost ? createPortal(controls, triggerHost) : null}
      {editMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {layoutNode}
          <DragOverlay>
            {activeEntry ? (
              <div className="bg-ui-bg-base shadow-elevation-flyout ring-ui-border-base min-w-0 rounded-lg ring-1">
                <EntryContent>{activeEntry.render(data)}</EntryContent>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        layoutNode
      )}
      {hasOutlet && <Outlet />}
    </>
  )
}
