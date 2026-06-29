import { DndContext, DragOverlay } from "@dnd-kit/core"
import { Adjustments, AdjustmentsDone } from "@medusajs/icons"
import { Badge, Button, IconButton, Tooltip, usePrompt } from "@medusajs/ui"
import {
  ComponentType,
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { Outlet } from "react-router-dom"
import { useExtension } from "../../providers/extension-provider/use-extension"
import { useLayoutCustomizerTriggerHost } from "../../hooks/use-layout-customizer-trigger-host"
import {
  DisplayEntry,
  RawEntry,
  buildCoreEntries,
  buildDisplayEntries,
  extractSectionElements,
} from "./entries"
import { LayoutEntry } from "./entry"
import { SectionDropzone } from "./section-dropzone"
import { EntryContent, SortableEntry } from "./sortable-entry"
import type {
  LayoutPreference,
  SectionNameFor,
  Layouts,
  WidgetPreference,
} from "./types"
import { useLayoutDnd } from "../../hooks/use-layout-dnd"
import {
  useLayoutPreference,
  type LayoutScope,
} from "../../hooks/use-layout-preference"

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
}: LayoutComposerProps<TLayoutId, TData>) => {
  const { getWidgetsForSections, getLayout } = useExtension()
  const {
    personalPreference,
    defaultPreference,
    activeScope,
    definedScope,
    setPreference,
    isSaving,
  } = useLayoutPreference(widgetsZonePrefix)
  const triggerHost = useLayoutCustomizerTriggerHost()
  const { t } = useTranslation()
  const prompt = usePrompt()

  const [editMode, setEditMode] = useState(false)
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
      const naturalWidgets = getWidgetsForSections(
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
        >
          {content}
        </SortableEntry>
      )
    },
    [data, editMode]
  )

  function toggleHidden(widgetId: string) {
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
  }

  function enterEdit() {
    setEditScope(activeScope)
    setDraft(preferenceForScope(activeScope))
    setEditMode(true)
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
      return
    }

    setPreference(
      draft,
      { asDefault: editScope === "default" },
      {
        onSuccess: () => {
          setEditMode(false)
          setDraft(null)
        },
      }
    )
  }

  function cancelEdit() {
    setEditMode(false)
    setDraft(null)
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

  // Idle trigger tooltip: always explains the action, and when a layout has
  // been defined for this zone, adds whose layout the user is currently seeing.
  const triggerTooltip = definedScope ? (
    <div className="flex flex-col gap-y-0.5">
      <span>{t("layout.customizeLayout")}</span>
      <span className="text-ui-fg-subtle">
        {t(
          definedScope === "personal"
            ? "layout.viewingPersonalLayout"
            : "layout.viewingSystemLayout"
        )}
      </span>
    </div>
  ) : (
    t("layout.customizeLayout")
  )

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
  ) : (
    <Tooltip content={triggerTooltip}>
      <IconButton
        size="small"
        variant="transparent"
        onClick={enterEdit}
        aria-label={t("layout.customizeLayout")}
        className="text-ui-fg-muted hover:text-ui-fg-subtle"
      >
        {/* The "done" icon carries a blue accent dot — reserve it for zones
            that actually have a saved layout, otherwise show the plain icon. */}
        {definedScope ? <AdjustmentsDone /> : <Adjustments />}
      </IconButton>
    </Tooltip>
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

export const LayoutComposer = Object.assign(LayoutComposerRoot, {
  Entry: LayoutEntry,
})
