import { DndContext, DragOverlay } from "@dnd-kit/core"
import { Badge, Button, usePrompt } from "@medusajs/ui"
import {
  ComponentType,
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import {
  useLayoutCustomizerActiveEditor,
  useLayoutCustomizerTriggerHost,
  useLayoutEditRequest,
} from "../../hooks/use-layout-customizer-trigger-host"
import {
  DisplayEntry,
  RawEntry,
  buildCoreEntries,
  buildDisplayEntries,
  extractSectionElements,
} from "./entries"
import { type LayoutEditContextValue } from "../../providers/layout-edit-provider/layout-edit-context"
import { LayoutEditProvider } from "../../providers/layout-edit-provider/layout-edit-provider"
import { LayoutEntry } from "./entry"
import { SectionDropzone } from "./section-dropzone"
import { EntryContent, SortableEntry } from "./sortable-entry"
import type {
  LayoutPreference,
  LayoutControlSize,
  SectionNameFor,
  Layouts,
  WidgetPreference,
} from "./types"
import { useLayoutDnd } from "../../hooks/use-layout-dnd"
import {
  useLayoutPreference,
  type LayoutScope,
} from "../../hooks/use-layout-preference"
import { CUSTOMIZE_IDS, LAYOUT_CONTROLS_LOCATION } from "./constants"

export type LayoutComposerProps<TLayoutId extends Layouts, TData> = {
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
  /**
   * Stable id of the host this composer customizes (see `CUSTOMIZE_IDS`). The
   * central `CustomizerMenu` lists it and, when chosen, drives this composer
   * into edit mode. Composers for different hosts must use distinct ids; only
   * one composer per id is mounted at a time.
   *
   * @default CUSTOMIZE_IDS.PAGE
   */
  customizeId?: string
  /**
   * Visual density of each entry's edit-mode overlay.
   * @default "default"
   */
  controlSize?: LayoutControlSize
  /**
   * Skip widget injection zones entirely: no registered widgets are resolved
   * for `widgetsZonePrefix`, so only the core `sections` entries are composed.
   * Used by surfaces that are purely reorderable nav (e.g. the sidebars) where
   * extensions shouldn't inject content.
   *
   * @default false
   */
  disableWidgets?: boolean
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
    if (!!aw?.hidden !== !!bw?.hidden) {
      return false
    }
    if (aw?.order !== bw?.order) {
      return false
    }
    if (aw?.section !== bw?.section) {
      return false
    }
  }
  return true
}

const LayoutComposerRoot = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
  customizeId = CUSTOMIZE_IDS.PAGE,
  controlSize = "default",
  disableWidgets = false,
}: LayoutComposerProps<TLayoutId, TData>) => {
  const { getWidgetsForSections, getLayout } = useExtension()
  const {
    personalPreference,
    defaultPreference,
    activeScope,
    setPreference,
    isSaving,
  } = useLayoutPreference(widgetsZonePrefix)
  const controlsHost = useLayoutCustomizerTriggerHost(LAYOUT_CONTROLS_LOCATION)
  const { activeEditor, setActiveEditor } = useLayoutCustomizerActiveEditor()
  const { editRequest, requestEdit } = useLayoutEditRequest()
  const editorId = useId()
  const { t } = useTranslation()
  const prompt = usePrompt()

  // Another composer is mid-edit; lock this one's trigger so the two don't both
  // try to drive the shared top-bar controls slot at once.
  const locked = activeEditor !== null && activeEditor !== editorId

  const [editMode, setEditMode] = useState(false)
  useEffect(() => {
    return () => {
      setActiveEditor(null)
    }
  }, [setActiveEditor])

  // Consume an edit request aimed at this host. Clearing it first makes this a
  // one-shot: it won't re-fire on later renders. `enterEdit` no-ops while
  // another composer is editing (`locked`), so a stray request is safely
  // dropped rather than queued.
  useEffect(() => {
    if (editRequest === customizeId && !editMode) {
      requestEdit(null)
      enterEdit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRequest, customizeId, editMode])

  const [draft, setDraft] = useState<LayoutPreference | null>(null)
  // Which configuration the current edit session is targeting: the user's
  // personal layout or the zone's shared default.
  const [editScope, setEditScope] = useState<LayoutScope>("personal")

  const preferenceForScope = useCallback(
    (scope: LayoutScope): LayoutPreference => {
      return scope === "default" ? defaultPreference : personalPreference
    },
    [defaultPreference, personalPreference]
  )

  const activePreference: LayoutPreference = useMemo(() => {
    return editMode && draft ? draft : preferenceForScope(activeScope)
  }, [editMode, draft, preferenceForScope, activeScope])

  // Whether the current draft actually differs from the persisted preference
  // for the scope being edited. Switching between scopes without making edits
  // leaves this false, so saving is a no-op confirmation we can streamline.
  const hasChanges = useMemo(() => {
    return editMode && draft
      ? !isSamePreference(draft, preferenceForScope(editScope))
      : false
  }, [editMode, draft, preferenceForScope, editScope])

  // TODO: Implement switching between compatible layouts
  const layoutId = preferredLayoutId

  const layout = getLayout(layoutId)

  // Derive the layout model: core + widget entries placed into their effective
  // sections with the active preference applied. Memoized so it isn't rebuilt
  // on unrelated re-renders (e.g. drag start) — only when the sections,
  // registered widgets, or active preference actually change.
  const { entriesBySection, widgetSectionMap, validSectionIds } =
    useMemo(() => {
      const coreElementsBySection = extractSectionElements(
        sections as Record<string, ReactNode>
      )
      const naturalWidgets = disableWidgets
        ? {}
        : getWidgetsForSections(
            widgetsZonePrefix,
            layout?.sections?.map((s) => s.id) ?? []
          )

      // Build raw entries (core + widgets) at their natural sections. Relative
      // placement before any user preference comes purely from the order they
      // are pushed here, preserved by the stable sort in `buildDisplayEntries`.
      // Widgets are pushed after core entries so they render after by default —
      // If a configuration has been saved, newly added widget or core entry
      // (which has no saved order) surfaces at the top, otherwise it will be
      // placed at the bottom of the section.
      const rawEntries: RawEntry[] = buildCoreEntries(coreElementsBySection)
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
    }, [
      sections,
      widgetsZonePrefix,
      layout,
      activePreference,
      getWidgetsForSections,
      disableWidgets,
    ])

  const {
    sensors,
    collisionDetection,
    activeEntry,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useLayoutDnd({
    entriesBySection,
    widgetSectionMap,
    validSectionIds,
    setDraft,
  })

  const isHidden = useCallback(
    (id: string): boolean => activePreference.widgets[id]?.hidden ?? false,
    [activePreference]
  )

  const toggleHidden = useCallback((widgetId: string) => {
    setDraft((prev) => {
      if (!prev) {
        return prev
      }
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
  }, [])

  // Renders a single entry for the current mode: plain content at idle, a
  // sortable wrapper with chrome in edit mode. An entry that currently renders
  // nothing stays a sortable card showing a placeholder (see `SortableEntry`),
  // so it remains visible and placeable rather than collapsing to a bare row.
  const renderEntry = useCallback(
    (entry: DisplayEntry): ReactNode => {
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
          controlSize={controlSize}
        >
          {content}
        </SortableEntry>
      )
    },
    [data, editMode, controlSize, toggleHidden]
  )

  // Nested-children ordering shared with entries via `LayoutEditContext`. Reads
  // order from the active preference (draft while editing, persisted otherwise)
  // and writes into the draft so nested moves ride the same save/cancel flow.
  const orderChildren = useCallback(
    <T,>(children: T[], getId: (child: T) => string): T[] =>
      [...children].sort(
        (a, b) =>
          (activePreference.widgets[getId(a)]?.order ?? 0) -
          (activePreference.widgets[getId(b)]?.order ?? 0)
      ),
    [activePreference]
  )

  const setChildrenOrder = useCallback((orderedIds: string[]) => {
    setDraft((prev) => {
      if (!prev) {
        return prev
      }
      const widgets = { ...prev.widgets }
      orderedIds.forEach((id, index) => {
        widgets[id] = { ...(widgets[id] ?? {}), order: index }
      })
      return { ...prev, widgets }
    })
  }, [])

  const editContextValue = useMemo<LayoutEditContextValue>(
    () => ({
      editMode,
      orderChildren,
      setChildrenOrder,
      isHidden,
      toggleHidden,
    }),
    [editMode, orderChildren, setChildrenOrder, isHidden, toggleHidden]
  )

  function enterEdit() {
    if (locked) {
      return
    }
    setEditScope(activeScope)
    setDraft(preferenceForScope(activeScope))
    setEditMode(true)
    setActiveEditor(editorId)
  }

  // When the user clicks a scope badge while editing:
  // - If there are unsaved edits, keep the draft so the changes aren't lost
  //   and just retarget which scope they'll be saved to.
  // - If the draft is clean (no edits vs. the current scope), load the saved
  //   preference for the new scope so the user sees its real state.
  function switchScope(scope: LayoutScope) {
    if (!hasChanges) {
      setDraft(preferenceForScope(scope))
    }
    setEditScope(scope)
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

    if (!draft) {
      setEditMode(false)
      setActiveEditor(null)
      return
    }

    setPreference(
      draft,
      { asDefault: editScope === "default" },
      {
        onSuccess: () => {
          setEditMode(false)
          setDraft(null)
          setActiveEditor(null)
        },
      }
    )
  }

  function cancelEdit() {
    setEditMode(false)
    setDraft(null)
    setActiveEditor(null)
  }

  const renderedSections: Record<string, ReactNode> = useMemo(() => {
    const sections: Record<string, ReactNode> = {}
    for (const section of layout?.sections ?? []) {
      const entries = entriesBySection[section.id] ?? []
      const visibleEntries = editMode
        ? entries
        : entries.filter((e) => !e.hidden)
      const renderedItems = visibleEntries.map(renderEntry)

      sections[section.id] = editMode ? (
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
    return sections
  }, [layout, entriesBySection, editMode, renderEntry])

  const LayoutComponent = layout?.Component
  if (!LayoutComponent) {
    return null
  }

  // Edit-mode controls, portaled into the single top-bar slot while this
  // composer is editing: Personal/Default badges to switch which configuration
  // is being edited (active one highlighted), Cancel, and a Save button that
  // targets the active scope ("Save for everyone" for the default). At idle the
  // composer renders no controls — the central `CustomizerMenu` is the trigger.
  const editControls = (
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
      <Button
        size="small"
        variant="secondary"
        onClick={cancelEdit}
        disabled={isSaving}
      >
        {t("actions.cancel")}
      </Button>
      <Button
        size="small"
        variant="primary"
        onClick={commitEdit}
        isLoading={isSaving}
      >
        {editScope === "default" && hasChanges
          ? t("layout.saveForEveryone")
          : t("actions.save")}
      </Button>
    </div>
  )
  const layoutNode = <LayoutComponent sections={renderedSections} data={data} />

  return (
    <LayoutEditProvider value={editContextValue}>
      {/* While editing, portal the Cancel/Save controls into the shared top-bar
       * slot — they take the place of the central trigger menu, which hides
       * itself for the duration. */}
      {editMode && controlsHost
        ? createPortal(editControls, controlsHost)
        : null}
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
    </LayoutEditProvider>
  )
}

export const LayoutComposer = Object.assign(LayoutComposerRoot, {
  Entry: LayoutEntry,
})
