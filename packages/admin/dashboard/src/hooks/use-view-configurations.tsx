import { useMemo } from "react"
import { toast } from "@medusajs/ui"
import { FetchError } from "@medusajs/js-sdk"
import { useFeatureFlag } from "../providers/feature-flag-provider"
import {
  useViewConfigurations as useViewConfigurationsBase,
  useActiveViewConfiguration as useActiveViewConfigurationBase,
  useCreateViewConfiguration as useCreateViewConfigurationBase,
  useUpdateViewConfiguration as useUpdateViewConfigurationBase,
  useDeleteViewConfiguration as useDeleteViewConfigurationBase,
  useSetActiveViewConfiguration as useSetActiveViewConfigurationBase,
} from "./api/views"
import { useTranslation } from "react-i18next"

// Common error handler
const handleError = (error: Error, fallbackMessage: string, message?: string) => {
  let errorMessage = message
  if (!errorMessage) {
    if (error instanceof FetchError) {
      errorMessage = error.message
    } else if (error.message) {
      errorMessage = error.message
    } else {
      errorMessage = fallbackMessage
    }
  }

  toast.error(errorMessage)
}

export const useViewConfigurations = (entity: string) => {
  const { t } = useTranslation()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  // List views
  const listViews = useViewConfigurationsBase(entity, { limit: 100 }, {
    enabled: isViewConfigEnabled && !!entity,
  })

  // Active view
  const activeView = useActiveViewConfigurationBase(entity, {
    enabled: isViewConfigEnabled && !!entity,
  })

  // Create view mutation
  const createView = useCreateViewConfigurationBase(entity, {
    onSuccess: () => {
      toast.success(t("views.creationSuccess"))
    },
    onError: (error) => {
      handleError(error, t("errorBoundary.defaultTitle"), t("views.errors.failedToCreateView"))
    },
  })

  // Set active view mutation
  const setActiveView = useSetActiveViewConfigurationBase(entity, {
    onSuccess: () => {
    },
    onError: (error) => {
      handleError(error, t("errorBoundary.defaultTitle"), t("views.errors.failedToUpdateActiveView"))
    },
  })

  return useMemo(() => ({
    isViewConfigEnabled,
    listViews,
    activeView,
    createView,
    setActiveView,
    isDefaultViewActive: activeView?.is_default_active ?? true,
  }), [
    isViewConfigEnabled,
    listViews,
    activeView,
    createView,
    setActiveView,
  ])
}

// Hook for update/delete operations on a specific view
export const useViewConfiguration = (entity: string, viewId: string ) => {
  const { t } = useTranslation()
  const updateView = useUpdateViewConfigurationBase(entity, viewId, {
    onSuccess: () => {
      toast.success(t("views.updateSuccess"))
    },
    onError: (error) => {
      handleError(error, t("errorBoundary.defaultTitle"), t("views.errors.failedToUpdateView"))
    },
  })

  const deleteView = useDeleteViewConfigurationBase(entity, viewId, {
    onSuccess: () => {
      toast.success(t("views.deleteSuccess"))
    },
    onError: (error) => {
      handleError(error, t("errorBoundary.defaultTitle"), t("views.errors.failedToDeleteView"))
    },
  })

  return {
    updateView,
    deleteView,
  }
}
