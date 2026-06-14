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
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { AdjustmentsDone } from "@medusajs/icons"
import { Badge, Button, IconButton, usePrompt } from "@medusajs/ui"
import {
  ComponentType,
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import { useLayoutCustomizerTriggerHost } from "./customizer-host"
import { EntryProbe } from "./entry-probe"
import {
  DisplayEntry,
  RawEntry,
  appendOrder,
  buildCoreEntries,
  buildDisplayEntries,
  extractSectionElements,
  insertOrderBefore,
} from "./entries"
import {
  SectionDropzone,
  getSectionIdFromTailId,
  isSectionTailId,
} from "./section-dropzone"
import { SortableEntry } from "./sortable-entry"
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

/** Whether a drop landed on a section body/tail (i.e. "append to end") rather
 * than on a specific entry. */
function isEndDropTarget(overId: string, sectionIds: Set<string>): boolean {
  return sectionIds.has(overId) || isSectionTailId(overId)
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
  // Entries whose content currently renders nothing. Core entries are derived
  // statically from each section's JSX children, but some of those components
  // conditionally render `null` — keeping them in the sortable set would leave
  // bare 0-height control rows in edit mode. They report their emptiness from
  // the DOM (see `useContentEmptyReport`) and we drop them from the layout
  // until they have content again.
  const [emptyWidgetIds, setEmptyWidgetIds] = useState<Set<string>>(new Set())

  const reportEmptiness = useCallback((widgetId: string, isEmpty: boolean) => {
    setEmptyWidgetIds((prev) => {
      if (prev.has(widgetId) === isEmpty) {
        return prev
      }
      const next = new Set(prev)
      if (isEmpty) {
        next.add(widgetId)
      } else {
        next.delete(widgetId)
      }
      return next
    })
  }, [])

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

  const elementsBySection = extractSectionElements(
    sections as Record<string, ReactNode>
  )

  const naturalWidgets = getWidgetsForSections(
    widgetsZonePrefix,
    layout?.sections?.map((s) => s.id) ?? []
  )

  // Build raw entries (core + widgets) at their natural sections/orders.
  const rawEntries: RawEntry[] = []
  const coreElementMap = new Map<string, ReactElement>()
  // Shared so duplicate ids are deduped across the whole page rather than
  // per-section (ids no longer carry their section).
  const coreSeen = new Map<string, number>()
  for (const [sectionName, elements] of Object.entries(elementsBySection)) {
    const { entries, elementById } = buildCoreEntries(
      sectionName,
      elements,
      coreSeen
    )
    for (const ce of entries) {
      rawEntries.push({ ...ce })
    }
    for (const [id, el] of elementById) {
      coreElementMap.set(id, el)
    }
  }
  for (const [naturalSection, widgets] of Object.entries(naturalWidgets)) {
    for (const w of widgets) {
      rawEntries.push({
        widgetId: w.widgetId,
        Component: w.Component,
        order: w.order,
        isCore: false,
        naturalSection,
      })
    }
  }

  // Apply the active preference (draft when editing, persisted otherwise),
  // keeping hidden entries with `hidden: true` so we can ghost them in edit mode.
  const validSectionIds = new Set(layout?.sections.map((s) => s.id) ?? [])
  const entriesBySection = buildDisplayEntries(
    rawEntries,
    activePreference,
    validSectionIds
  )

  // Maps each entry's widgetId to the section it currently renders in. Shared by
  // the collision detection and drag handlers to resolve the active/over
  // sections of a move.
  const widgetSectionMap: Record<string, string> = {}
  for (const [sectionId, entries] of Object.entries(entriesBySection)) {
    for (const e of entries) {
      widgetSectionMap[e.widgetId] = sectionId
    }
  }

  function renderEntryContent(entry: DisplayEntry): ReactNode {
    if (entry.isCore) {
      const el = coreElementMap.get(entry.widgetId)
      return el ?? null
    }
    const WidgetComponent = entry.Component as ComponentType<{
      data?: unknown
    }>
    return <WidgetComponent data={data as unknown} />
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

  function updateDraftWidget(widgetId: string, update: WidgetPreference) {
    setDraft((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        widgets: {
          ...prev.widgets,
          [widgetId]: { ...prev.widgets[widgetId], ...update },
        },
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
        title: t("layout.saveForEveryoneTitle", "Save layout for everyone"),
        description: t(
          "layout.saveForEveryoneDescription",
          "This updates the default layout for this page for all users who haven't customized it themselves. Are you sure?"
        ),
        confirmText: t("layout.saveForEveryone", "Save for everyone"),
        cancelText: t("actions.cancel", "Cancel"),
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
   * Cursor-first collision detection with sticky fallback.
   *
   * 1. `pointerWithin` resolves the droppable the cursor is literally over —
   *    immune to overlay-rect drift.
   * 2. If the cursor is in dead space (column gutter, padding) `pointerWithin`
   *    returns nothing. Rather than letting `rectIntersection` /
   *    `closestCenter` pick whichever widget the overlay happens to mostly
   *    cover (which flickers with tiny pointer movements), we reuse the last
   *    valid over-id from this drag.
   * 3. If we have no history yet (drag just started in dead space), fall back
   *    through `rectIntersection` then `closestCenter`.
   *
   * Section dropzones are de-prioritized in favor of widgets so the slot
   * anchors to a real entry whenever one is in range.
   */
  const collisionDetection: CollisionDetection = (args) => {
    // Section bodies and their tail drop zones are container targets — prefer a
    // real entry over them whenever one is in range so the insertion slot
    // anchors to a widget rather than the whole column or the end zone.
    const isContainerId = (id: string) =>
      validSectionIds.has(id) || isSectionTailId(id)
    const preferWidget = (
      collisions: ReturnType<typeof closestCenter>
    ): ReturnType<typeof closestCenter> => {
      const widget = collisions.find((c) => !isContainerId(c.id as string))
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

    const rect = rectIntersection(args)
    if (rect.length > 0) {
      const chosen = preferWidget(rect)
      if (chosen.length > 0) {
        lastOverIdRef.current = chosen[0].id as string
      }
      return chosen
    }

    const closest = preferWidget(closestCenter(args))
    if (closest.length > 0) {
      lastOverIdRef.current = closest[0].id as string
    }
    return closest
  }

  /**
   * Fires continuously while dragging. When the cursor crosses into a
   * different section, we move the dragged item into that section's
   * `SortableContext` immediately so the items there shift to make room
   * *before* release. `handleDragEnd` still covers cross-section moves as a
   * fallback for keyboard-driven drags that never fire `onDragOver`.
   */
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeWidgetId = active.id as string
    const overId = over.id as string

    const activeSection = widgetSectionMap[activeWidgetId]
    const overSection = resolveOverSection(
      overId,
      validSectionIds,
      widgetSectionMap
    )
    if (!activeSection || !overSection) return
    if (activeSection === overSection) return

    const targetEntries = entriesBySection[overSection] ?? []
    const newOrder = insertOrderBefore(targetEntries, overId)

    // Pin the absolute section, not a delta against the current natural
    // section. The widget's stored preference then fully determines its
    // placement, so a later change to its registered zone (natural section)
    // can't drag a user-placed widget out from under them.
    updateDraftWidget(activeWidgetId, {
      order: newOrder,
      section: overSection,
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    lastOverIdRef.current = null
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeWidgetId = active.id as string
    const overId = over.id as string

    const activeSection = widgetSectionMap[activeWidgetId]
    const overSection = resolveOverSection(
      overId,
      validSectionIds,
      widgetSectionMap
    )
    if (!activeSection || !overSection) return

    const targetEntries = entriesBySection[overSection] ?? []

    // Always pin the absolute section the widget ends up in (see `handleDragOver`)
    // so dragging — even a same-section reorder — anchors the widget there
    // regardless of later changes to its registered zone.
    if (activeSection === overSection) {
      // Dropped on the section body or its tail zone — move to the end.
      if (isEndDropTarget(overId, validSectionIds)) {
        updateDraftWidget(activeWidgetId, {
          order: appendOrder(targetEntries),
          section: activeSection,
        })
        return
      }

      const oldIndex = targetEntries.findIndex(
        (e) => e.widgetId === activeWidgetId
      )
      const newIndex = targetEntries.findIndex((e) => e.widgetId === overId)
      if (oldIndex === -1 || newIndex === -1) return

      const moved = targetEntries[oldIndex]
      const target = targetEntries[newIndex]
      const before = targetEntries[newIndex - (newIndex > oldIndex ? 0 : 1)]
      const after = targetEntries[newIndex + (newIndex > oldIndex ? 1 : 0)]

      let newOrder: number
      if (!before || before.widgetId === moved.widgetId) {
        newOrder = target.order - 1
      } else if (!after || after.widgetId === moved.widgetId) {
        newOrder = target.order + 1
      } else {
        newOrder = (before.order + after.order) / 2
      }

      updateDraftWidget(activeWidgetId, {
        order: newOrder,
        section: activeSection,
      })
    } else {
      updateDraftWidget(activeWidgetId, {
        order: insertOrderBefore(targetEntries, overId),
        section: overSection,
      })
    }
  }

  const LayoutComponent = layout?.Component
  if (!LayoutComponent) {
    return null
  }

  const renderedSections: Record<string, ReactNode> = {}
  for (const section of layout.sections) {
    const entries = entriesBySection[section.id] ?? []
    const visibleEntries = editMode ? entries : entries.filter((e) => !e.hidden)

    const renderedItems = visibleEntries.map((entry) => {
      const content = renderEntryContent(entry)
      if (!editMode) {
        return <Fragment key={entry.widgetId}>{content}</Fragment>
      }
      // Entries that currently render nothing stay mounted as a probe — no
      // chrome, no sortable — so they neither show a bare control row nor act
      // as an invisible drop target, but can return if their content comes back.
      if (emptyWidgetIds.has(entry.widgetId)) {
        return (
          <EntryProbe
            key={entry.widgetId}
            widgetId={entry.widgetId}
            onEmptyChange={reportEmptiness}
          >
            {content}
          </EntryProbe>
        )
      }
      return (
        <SortableEntry
          key={entry.widgetId}
          widgetId={entry.widgetId}
          hidden={entry.hidden}
          onToggleHidden={() => toggleHidden(entry.widgetId)}
          onEmptyChange={reportEmptiness}
        >
          {content}
        </SortableEntry>
      )
    })

    if (editMode) {
      renderedSections[section.id] = (
        <SectionDropzone
          section={section}
          items={visibleEntries
            .filter((e) => !emptyWidgetIds.has(e.widgetId))
            .map((e) => e.widgetId)}
        >
          {renderedItems}
        </SectionDropzone>
      )
    } else {
      renderedSections[section.id] = renderedItems
    }
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
          {t("layout.personalView", "Personal")}
        </Badge>
        <Badge
          size="xsmall"
          color={editScope === "default" ? "blue" : "grey"}
          className="cursor-pointer"
          onClick={() => switchScope("default")}
        >
          {t("layout.defaultView", "Default")}
        </Badge>
      </div>
      <Button size="small" variant="secondary" onClick={cancelEdit}>
        {t("actions.cancel", "Cancel")}
      </Button>
      <Button size="small" variant="primary" onClick={commitEdit}>
        {editScope === "default" && hasChanges
          ? t("layout.saveForEveryone", "Save for everyone")
          : t("actions.save", "Save")}
      </Button>
    </div>
  ) : (
    <IconButton
      size="small"
      variant="transparent"
      onClick={enterEdit}
      aria-label={t("layout.customizeWidgets", "Customize widgets")}
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
              <div className="bg-ui-bg-base shadow-elevation-flyout ring-ui-border-base rounded-lg ring-1">
                {renderEntryContent(activeEntry)}
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
