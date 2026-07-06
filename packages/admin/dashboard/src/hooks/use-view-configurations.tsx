import { useMemo } from "react"
import { toast } from "@medusajs/ui"
import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { useFeatureFlag } from "../providers/feature-flag-provider"
import {
  useViewConfigurations as useViewConfigurationsBase,
  useActiveViewConfiguration as useActiveViewConfigurationBase,
  useCreateViewConfiguration as useCreateViewConfigurationBase,
  useUpdateViewConfiguration as useUpdateViewConfigurationBase,
  useDeleteViewConfiguration as useDeleteViewConfigurationBase,
  useSetActiveViewConfiguration as useSetActiveViewConfigurationBase,
} from "./api/views"

export type ViewConfiguration = NonNullable<
  HttpTypes.AdminViewConfigurationResponse["view_configuration"]
>

// Common error handler
const handleError = (error: Error, message?: string) => {
  let errorMessage = message
  if (!errorMessage) {
    if (error instanceof FetchError) {
      errorMessage = error.message
    } else if (error.message) {
      errorMessage = error.message
    } else {
      errorMessage = "An error occurred"
    }
  }

  toast.error(errorMessage)
}

export const useViewConfigurations = (entity: string) => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  // List views
  const listViews = useViewConfigurationsBase(
    entity,
    { limit: 100 },
    {
      enabled: isViewConfigEnabled && !!entity,
    }
  )

  // Active view
  const activeView = useActiveViewConfigurationBase(entity, {
    enabled: isViewConfigEnabled && !!entity,
  })

  // Create view mutation
  const createView = useCreateViewConfigurationBase(entity, {
    onSuccess: () => {
      toast.success(`View created`)
    },
    onError: (error) => {
      handleError(error, "Failed to create view")
    },
  })

  // Set active view mutation
  const setActiveView = useSetActiveViewConfigurationBase(entity, {
    onSuccess: () => {},
    onError: (error) => {
      handleError(error, "Failed to update active view")
    },
  })

  return useMemo(
    () => ({
      isViewConfigEnabled,
      listViews,
      activeView,
      createView,
      setActiveView,
      isDefaultViewActive: activeView?.is_default_active ?? true,
    }),
    [isViewConfigEnabled, listViews, activeView, createView, setActiveView]
  )
}

// Hook for update/delete operations on a specific view
export const useViewConfiguration = (entity: string, viewId: string) => {
  const updateView = useUpdateViewConfigurationBase(entity, viewId, {
    onSuccess: () => {
      toast.success(`View updated`)
    },
    onError: (error) => {
      handleError(error, "Failed to update view")
    },
  })

  const deleteView = useDeleteViewConfigurationBase(entity, viewId, {
    onSuccess: () => {
      toast.success("View deleted successfully")
    },
    onError: (error) => {
      handleError(error, "Failed to delete view")
    },
  })

  return {
    updateView,
    deleteView,
  }
}
