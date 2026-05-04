import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"
import {
  useViewConfigurations,
  useViewConfiguration,
} from "../use-view-configurations"
import { useEntityColumns } from "../api/views"
import { useFeatureFlag } from "../../providers/feature-flag-provider"
import { useColumnState } from "./columns/use-column-state"
import { useQueryParams } from "../use-query-params"
import { calculateRequiredFields } from "../../lib/table/field-utils"

export interface TableConfiguration {
  filters: Record<string, any>
  sorting: { id: string; desc: boolean } | null
  search: string
  visible_columns?: string[]
  column_order?: string[]
}

export interface UseTableConfigurationOptions {
  entity: string
  pageSize?: number
  queryPrefix?: string
  filters?: Array<{ id: string }>
}

export interface UseTableConfigurationReturn {
  activeView: any
  createView: any
  updateView: any
  isViewConfigEnabled: boolean
  visibleColumns: Record<string, boolean>
  columnOrder: string[]
  currentColumns: {
    visible: string[]
    order: string[]
  }
  setColumnOrder: (order: string[]) => void
  handleColumnVisibilityChange: (visibility: Record<string, boolean>) => void
  currentConfiguration: TableConfiguration
  hasConfigurationChanged: boolean
  handleClearConfiguration: () => void
  apiColumns: HttpTypes.AdminColumn[] | undefined
  isLoadingColumns: boolean
  queryParams: Record<string, any>
  requiredFields: string
}

function parseSortingState(value: string) {
  return value.startsWith("-")
    ? { id: value.slice(1), desc: true }
    : { id: value, desc: false }
}

export function useTableConfiguration({
  entity,
  queryPrefix = "",
  filters = [],
}: UseTableConfigurationOptions): UseTableConfigurationReturn {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")
  const [_, setSearchParams] = useSearchParams()

  const { activeView, createView } = useViewConfigurations(entity)
  const currentActiveView = activeView?.view_configuration || null
  const { updateView } = useViewConfiguration(
    entity,
    currentActiveView?.id || ""
  )

  const { columns: apiColumns, isLoading: isLoadingColumns } = useEntityColumns(
    entity,
    {
      enabled: isViewConfigEnabled,
    }
  )

  const queryParams = useQueryParams(
    ["q", "order", "offset", "limit", ...filters.map((f) => f.id)],
    queryPrefix
  )

  // Column state
  const {
    visibleColumns,
    columnOrder,
    currentColumns,
    setColumnOrder,
    handleColumnVisibilityChange,
    handleViewChange: originalHandleViewChange,
  } = useColumnState(apiColumns, currentActiveView)

  // Sync view configuration with URL and column state
  useEffect(() => {
    if (!apiColumns) {
      return
    }
    originalHandleViewChange(currentActiveView, apiColumns)
    setSearchParams((prev) => {
      // Clear existing query params
      const keysToDelete = Array.from(prev.keys()).filter(
        (key) =>
          key.startsWith(queryPrefix + "_") ||
          key === queryPrefix + "_q" ||
          key === queryPrefix + "_order"
      )
      keysToDelete.forEach((key) => prev.delete(key))

      // Apply view configuration
      if (currentActiveView) {
        const viewConfig = currentActiveView.configuration

        if (viewConfig.filters) {
          Object.entries(viewConfig.filters).forEach(([key, value]) => {
            prev.set(`${queryPrefix}_${key}`, JSON.stringify(value))
          })
        }

        if (viewConfig.sorting) {
          const sortValue = viewConfig.sorting.desc
            ? `-${viewConfig.sorting.id}`
            : viewConfig.sorting.id
          prev.set(`${queryPrefix}_order`, sortValue)
        }

        if (viewConfig.search) {
          prev.set(`${queryPrefix}_q`, viewConfig.search)
        }
      }

      return prev
    })
  }, [currentActiveView, apiColumns])

  // Current configuration from URL
  const currentConfiguration = useMemo(() => {
    const currentFilters: Record<string, any> = {}
    filters.forEach((filter) => {
      if (queryParams[filter.id] !== undefined) {
        currentFilters[filter.id] = JSON.parse(queryParams[filter.id] || "")
      }
    })

    return {
      filters: currentFilters,
      sorting: queryParams.order ? parseSortingState(queryParams.order) : null,
      search: queryParams.q || "",
    }
  }, [filters, queryParams])

  // Check if configuration has changed from view
  const [debouncedHasConfigChanged, setDebouncedHasConfigChanged] =
    useState(false)

  const hasConfigurationChanged = useMemo(() => {
    const currentFilters = currentConfiguration.filters
    const currentSorting = currentConfiguration.sorting
    const currentSearch = currentConfiguration.search
    const currentVisibleColumns = Object.entries(visibleColumns)
      .filter(([_, isVisible]) => isVisible)
      .map(([field]) => field)
      .sort()

    if (currentActiveView) {
      const viewFilters = currentActiveView.configuration.filters || {}
      const viewSorting = currentActiveView.configuration.sorting
      const viewSearch = currentActiveView.configuration.search || ""
      const viewVisibleColumns = [
        ...(currentActiveView.configuration.visible_columns || []),
      ].sort()
      const viewColumnOrder = currentActiveView.configuration.column_order || []

      // Check filters
      const filterKeys = new Set([
        ...Object.keys(currentFilters),
        ...Object.keys(viewFilters),
      ])
      for (const key of filterKeys) {
        if (
          JSON.stringify(currentFilters[key]) !==
          JSON.stringify(viewFilters[key])
        ) {
          return true
        }
      }

      // Check sorting
      const normalizedCurrentSorting = currentSorting || undefined
      const normalizedViewSorting = viewSorting || undefined
      if (
        JSON.stringify(normalizedCurrentSorting) !==
        JSON.stringify(normalizedViewSorting)
      ) {
        return true
      }

      // Check search
      if (currentSearch !== viewSearch) {
        return true
      }

      // Check visible columns
      if (
        JSON.stringify(currentVisibleColumns) !==
        JSON.stringify(viewVisibleColumns)
      ) {
        return true
      }

      // Check column order
      if (JSON.stringify(columnOrder) !== JSON.stringify(viewColumnOrder)) {
        return true
      }
    } else {
      // Check against defaults
      if (Object.keys(currentFilters).length > 0) {
        return true
      }
      if (currentSorting !== null) {
        return true
      }
      if (currentSearch !== "") {
        return true
      }

      if (apiColumns) {
        const currentVisibleSet = new Set(currentVisibleColumns)
        const defaultVisibleSet = new Set(
          apiColumns
            .filter((col) => col.default_visible)
            .map((col) => col.field)
        )

        if (
          currentVisibleSet.size !== defaultVisibleSet.size ||
          [...currentVisibleSet].some((field) => !defaultVisibleSet.has(field))
        ) {
          return true
        }

        const defaultOrder = apiColumns
          .sort((a, b) => (a.default_order ?? 500) - (b.default_order ?? 500))
          .map((col) => col.field)

        if (JSON.stringify(columnOrder) !== JSON.stringify(defaultOrder)) {
          return true
        }
      }
    }

    return false
  }, [
    currentActiveView,
    visibleColumns,
    columnOrder,
    currentConfiguration,
    apiColumns,
  ])

  // Debounce configuration change detection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHasConfigChanged(hasConfigurationChanged)
    }, 50)

    return () => clearTimeout(timer)
  }, [hasConfigurationChanged])

  // Clear configuration handler
  const handleClearConfiguration = useCallback(() => {
    if (apiColumns) {
      originalHandleViewChange(currentActiveView, apiColumns)
    }

    setSearchParams((prev) => {
      const keysToDelete = Array.from(prev.keys()).filter(
        (key) =>
          key.startsWith(queryPrefix + "_") ||
          key === queryPrefix + "_q" ||
          key === queryPrefix + "_order"
      )
      keysToDelete.forEach((key) => prev.delete(key))

      if (currentActiveView?.configuration) {
        const viewConfig = currentActiveView.configuration

        if (viewConfig.filters) {
          Object.entries(viewConfig.filters).forEach(([key, value]) => {
            prev.set(`${queryPrefix}_${key}`, JSON.stringify(value))
          })
        }

        if (viewConfig.sorting) {
          const sortValue = viewConfig.sorting.desc
            ? `-${viewConfig.sorting.id}`
            : viewConfig.sorting.id
          prev.set(`${queryPrefix}_order`, sortValue)
        }

        if (viewConfig.search) {
          prev.set(`${queryPrefix}_q`, viewConfig.search)
        }
      }

      return prev
    })
  }, [currentActiveView, apiColumns, queryPrefix])

  // Calculate required fields based on visible columns
  const requiredFields = useMemo(() => {
    return calculateRequiredFields(entity, apiColumns, visibleColumns)
  }, [entity, apiColumns, visibleColumns])

  return {
    activeView: currentActiveView,
    createView,
    updateView,
    isViewConfigEnabled,
    visibleColumns,
    columnOrder,
    currentColumns,
    setColumnOrder,
    handleColumnVisibilityChange,
    currentConfiguration,
    hasConfigurationChanged: debouncedHasConfigChanged,
    handleClearConfiguration,
    apiColumns,
    isLoadingColumns,
    queryParams,
    requiredFields,
  }
}
