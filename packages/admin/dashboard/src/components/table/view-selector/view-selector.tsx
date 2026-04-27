import React, { useEffect, useState } from "react"
import { Button, Tooltip, DropdownMenu, usePrompt } from "@medusajs/ui"
import {
  Eye,
  Plus,
  Trash,
  PencilSquare,
  Star,
  CheckCircleSolid,
  ArrowUturnLeft,
} from "@medusajs/icons"
import {
  useViewConfigurations,
  useViewConfiguration,
} from "../../../hooks/use-view-configurations"
import type { ViewConfiguration } from "../../../hooks/use-view-configurations"
import { SaveViewDialog } from "../save-view-dialog"

interface ViewSelectorProps {
  entity: string
  onViewChange?: (view: ViewConfiguration | null) => void
  currentColumns?: {
    visible: string[]
    order: string[]
  }
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  entity,
  onViewChange,
  currentColumns,
}) => {
  const { listViews, activeView, setActiveView } = useViewConfigurations(entity)

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [editingView, setEditingView] = useState<ViewConfiguration | null>(null)
  const [deletingViewId, setDeletingViewId] = useState<string | null>(null)
  const prompt = usePrompt()

  const views = (listViews as any).data?.view_configurations || []
  const currentActiveView = (activeView as any).data?.view_configuration || null

  // Get delete mutation for the current deleting view
  const { deleteView } = useViewConfiguration(entity, deletingViewId || "")

  // Load views and active view
  useEffect(() => {
    if (activeView.isSuccess && onViewChange) {
      onViewChange(currentActiveView)
    }
  }, [activeView.isSuccess, currentActiveView, onViewChange])

  const handleViewSelect = async (viewId: string) => {
    const view = views.find((v: ViewConfiguration) => v.id === viewId)
    if (view) {
      await setActiveView.mutateAsync(viewId)
      if (onViewChange) {
        onViewChange(view)
      }
    }
  }

  const handleDeleteView = async (view: ViewConfiguration) => {
    const result = await prompt({
      title: "Delete view",
      description: `Are you sure you want to delete "${view.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (result) {
      setDeletingViewId(view.id)
    }
  }

  // Handle deletion when deletingViewId is set
  useEffect(() => {
    if (deletingViewId && deleteView.mutateAsync) {
      deleteView
        .mutateAsync()
        .then(() => {
          if (currentActiveView?.id === deletingViewId) {
            if (onViewChange) {
              onViewChange(null)
            }
          }
          setDeletingViewId(null)
        })
        .catch(() => {
          setDeletingViewId(null)
        })
    }
  }, [
    deletingViewId,
    deleteView.mutateAsync,
    currentActiveView?.id,
    onViewChange,
  ])

  const handleSaveView = () => {
    setSaveDialogOpen(true)
    setEditingView(null)
  }

  const handleEditView = (view: ViewConfiguration) => {
    setEditingView(view)
    setSaveDialogOpen(true)
  }

  const handleResetSystemDefault = async (
    systemDefaultView: ViewConfiguration
  ) => {
    const result = await prompt({
      title: "Reset system default",
      description:
        "This will delete the saved system default and revert to the original code-level defaults. All users will be affected. Are you sure?",
      confirmText: "Reset",
      cancelText: "Cancel",
    })

    if (result) {
      setDeletingViewId(systemDefaultView.id)
    }
  }

  const systemDefaultView = views.find(
    (v: ViewConfiguration) => v.is_system_default
  )
  const personalViews = views.filter(
    (v: ViewConfiguration) => !v.is_system_default
  )

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="small">
              <Eye className="h-4 w-4" />
              {currentActiveView ? currentActiveView.name : "Default View"}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-[260px]">
            {systemDefaultView && (
              <>
                <DropdownMenu.Label>System Default</DropdownMenu.Label>
                <DropdownMenu.Item
                  onClick={() => handleViewSelect(systemDefaultView.id)}
                  className="group justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    {systemDefaultView.name || "System Default"}
                  </span>
                  <div className="flex items-center gap-1">
                    {currentActiveView?.id === systemDefaultView.id && (
                      <CheckCircleSolid className="text-ui-fg-positive h-4 w-4" />
                    )}
                    <div className="opacity-0 group-hover:opacity-100">
                      <Tooltip content="Reset to code defaults">
                        <Button
                          variant="transparent"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleResetSystemDefault(systemDefaultView)
                          }}
                        >
                          <ArrowUturnLeft className="h-3 w-3" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </DropdownMenu.Item>
                {personalViews.length > 0 && <DropdownMenu.Separator />}
              </>
            )}

            {personalViews.length > 0 && (
              <>
                <DropdownMenu.Label>Personal Views</DropdownMenu.Label>
                {personalViews.map((view: ViewConfiguration) => (
                  <DropdownMenu.Item
                    key={view.id}
                    onClick={() => handleViewSelect(view.id)}
                    className="group justify-between"
                  >
                    <span className="flex-1">{view.name}</span>
                    <div className="flex items-center gap-1">
                      {currentActiveView?.id === view.id && (
                        <CheckCircleSolid className="text-ui-fg-positive h-4 w-4" />
                      )}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <Tooltip content="Edit view">
                          <Button
                            variant="transparent"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditView(view)
                            }}
                          >
                            <PencilSquare className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete view">
                          <Button
                            variant="transparent"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteView(view)
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </>
            )}

            <DropdownMenu.Separator />
            <DropdownMenu.Item
              onClick={handleSaveView}
              className="text-ui-fg-interactive"
            >
              <Plus className="h-4 w-4" />
              Save current view
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>

      {saveDialogOpen && (
        <SaveViewDialog
          entity={entity}
          currentColumns={currentColumns}
          editingView={editingView}
          onClose={() => {
            setSaveDialogOpen(false)
            setEditingView(null)
          }}
          onSaved={(newView) => {
            setSaveDialogOpen(false)
            setEditingView(null)
            if (onViewChange) {
              onViewChange(newView)
            }
          }}
        />
      )}
    </>
  )
}
