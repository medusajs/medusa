import React, { useEffect, useState, useRef } from "react"
import {
  Badge,
  usePrompt,
  toast,
  DropdownMenu,
} from "@medusajs/ui"
import {
  Trash,
  PencilSquare,
  ArrowUturnLeft,
} from "@medusajs/icons"
import { useViewConfigurations, useViewConfiguration } from "../../../hooks/use-view-configurations"
import type { ViewConfiguration } from "../../../hooks/use-view-configurations"
import { SaveViewDialog } from "../save-view-dialog"
import { useTranslation } from "react-i18next"

interface ViewPillsProps {
  entity: string
  currentColumns?: {
    visible: string[]
    order: string[]
  }
  currentConfiguration?: {
    filters?: Record<string, unknown>
    sorting?: { id: string; desc: boolean } | null
    search?: string
  }
}

export const ViewPills: React.FC<ViewPillsProps> = ({
  entity,
  currentColumns,
  currentConfiguration,
}) => {
  const {
    listViews,
    activeView,
    setActiveView,
    isDefaultViewActive,
  } = useViewConfigurations(entity)
  const { t } = useTranslation()

  const views = listViews?.view_configurations || []

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [editingView, setEditingView] = useState<ViewConfiguration | null>(null)
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [deletingViewId, setDeletingViewId] = useState<string | null>(null)
  const prompt = usePrompt()

  const currentActiveView = activeView?.view_configuration || null

  // Get delete mutation for the current deleting view
  const { deleteView } = useViewConfiguration(entity, deletingViewId || '')

  const handleViewSelect = async (viewId: string | null) => {
    try {
      if (viewId === null) {
        // Select default view - clear the active view
        await setActiveView.mutateAsync(null)
        return
      }

      const view = views.find(v => v.id === viewId)
      if (view) {
        await setActiveView.mutateAsync(viewId)
      }
    } catch (error) {
      console.error("Error in handleViewSelect:", error)
    }
  }

  const handleDeleteView = async (view: ViewConfiguration) => {
    const result = await prompt({
      title: t("views.prompts.deleteView.title"),
      description: t("views.prompts.deleteView.description", {
        view: view.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (result) {
      setDeletingViewId(view.id)
      // The actual deletion will happen in the effect below
    }
  }

  // Handle deletion when deletingViewId is set
  useEffect(() => {
    if (deletingViewId && deleteView.mutateAsync) {
      deleteView.mutateAsync().then(() => {
        setDeletingViewId(null)
      }).catch(() => {
        setDeletingViewId(null)
        // Error is handled by the hook
      })
    }
  }, [deletingViewId, deleteView.mutateAsync])

  const handleEditView = (view: ViewConfiguration) => {
    setEditingView(view)
    setSaveDialogOpen(true)
  }

  const handleResetSystemDefault = async (systemDefaultView: ViewConfiguration) => {
    const result = await prompt({
      title: t("views.prompts.resetSystemDefault.title"),
      description: t("views.prompts.resetSystemDefault.description"),
      confirmText: t("actions.reset"),
      cancelText: t("actions.cancel"),
    })

    if (result) {
      setDeletingViewId(systemDefaultView.id)
      // The actual deletion will happen in the effect above
    }
  }

  const systemDefaultView = views.find(v => v.is_system_default)
  const personalViews = views.filter(v => !v.is_system_default)

  // Determine if we're showing default
  const isDefaultActive = isDefaultViewActive
  const defaultLabel = t("fields.default")

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Default view badge (either code-level or system default) */}
        <div className="relative inline-block">
          <Badge
            color={isDefaultActive ? "blue" : "grey"}
            size="xsmall"
            className="cursor-pointer"
            onClick={() => handleViewSelect(null)}
            onContextMenu={(e) => {
              e.preventDefault()
              if (systemDefaultView) {
                setContextMenuPosition({ x: e.clientX, y: e.clientY })
                setContextMenuOpen('default')
              }
            }}
          >
            {defaultLabel}
          </Badge>
          {systemDefaultView && contextMenuOpen === 'default' && (
            <DropdownMenu
              open={true}
              onOpenChange={(open) => {
                if (!open) setContextMenuOpen(null)
              }}
            >
              <DropdownMenu.Trigger asChild>
                <div
                  style={{
                    position: 'fixed',
                    left: contextMenuPosition.x,
                    top: contextMenuPosition.y,
                    width: 0,
                    height: 0
                  }}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start" sideOffset={0}>
                <DropdownMenu.Item
                  onClick={() => {
                    handleResetSystemDefault(systemDefaultView)
                    setContextMenuOpen(null)
                  }}
                  className="flex items-center gap-x-2"
                >
                  <ArrowUturnLeft className="text-ui-fg-subtle" />
                  <span>{t("views.resetToCodeDefaults")}</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          )}
        </div>

        {/* Separator */}
        {personalViews.length > 0 && <div className="text-ui-fg-muted">|</div>}

        {/* Personal view badges */}
        {personalViews.map((view) => (
          <div key={view.id} className="relative inline-block">
            <Badge
              color={currentActiveView?.id === view.id ? "blue" : "grey"}
              size="xsmall"
              className="cursor-pointer"
              onClick={() => handleViewSelect(view.id)}
              onContextMenu={(e) => {
                e.preventDefault()
                setContextMenuPosition({ x: e.clientX, y: e.clientY })
                setContextMenuOpen(view.id)
              }}
            >
              {view.name}
            </Badge>
            {contextMenuOpen === view.id && (
              <DropdownMenu
                open={true}
                onOpenChange={(open) => {
                  if (!open) setContextMenuOpen(null)
                }}
              >
                <DropdownMenu.Trigger asChild>
                  <div
                    style={{
                      position: 'fixed',
                      left: contextMenuPosition.x,
                      top: contextMenuPosition.y,
                      width: 0,
                      height: 0
                    }}
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start" sideOffset={0}>
                  <DropdownMenu.Item
                    onClick={() => {
                      handleEditView(view)
                      setContextMenuOpen(null)
                    }}
                    className="flex items-center gap-x-2"
                  >
                    <PencilSquare className="text-ui-fg-subtle" />
                    <span>{t("views.editName")}</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => {
                      handleDeleteView(view)
                      setContextMenuOpen(null)
                    }}
                    className="flex items-center gap-x-2 text-ui-fg-error"
                  >
                    <Trash />
                    <span>{t("actions.delete")}</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
          </div>
        ))}

      </div>

      {saveDialogOpen && (
        <SaveViewDialog
          entity={entity}
          currentColumns={currentColumns}
          currentConfiguration={currentConfiguration}
          editingView={editingView}
          onClose={() => {
            setSaveDialogOpen(false)
            setEditingView(null)
          }}
          onSaved={async (newView) => {
            setSaveDialogOpen(false)
            setEditingView(null)
            toast.success(t("views.success", { view: newView.name }))
            // The view is already set as active in SaveViewDialog
          }}
        />
      )}
    </>
  )
}
