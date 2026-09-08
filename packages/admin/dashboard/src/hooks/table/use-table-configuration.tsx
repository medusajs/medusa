import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"
import { DataTableFilter } from "@medusajs/ui"
import {
  useViewConfigurations,
  useViewConfiguration,
} from "../use-view-configurations"
import { useEntityColumns } from "../api/views"
import { useFeatureFlag } from "../../providers/feature-flag-provider"
import { useColumnState } from "./columns/use-column-state"
import { useQueryParams } from "../use-query-params"
import { calculateRequiredFields } from "../../lib/table/field-utils"
import {
  generateFiltersFromColumns,
  getRelationshipFilterConfigs,
} from "../../lib/table/filter-utils"
import {
  RelationshipFilterConfig,
  useRelationshipFilterOptions,
} from "./use-relationship-filter-options"
import { TableAdapter } from "../../lib/table/table-adapters"

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
  transformColumns?: TableAdapter<unknown>["transformColumns"]
  /**
   * Extra client-side columns to append to the API columns (e.g. the virtual
   * actions column). They participate in column state like any other column.
   */
  extraColumns?: HttpTypes.AdminColumn[]
  /**
   * Default filters (filter id -> value) applied only when there is no saved
   * view configuration active. Once a view is active, its filters are used
   * instead. Acts as the baseline for "unsaved changes" detection.
   */
  defaultFilters?: Record<string, any>
  /**
   * Key under which saved view configurations are stored/looked up. Columns
   * always come from the real `entity`, but views are keyed independently so
   * that multiple tables of the SAME entity each get their own views without
   * clobbering each other. Defaults to `entity`.
   */
  viewConfigurationKey?: string
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
  filters: DataTableFilter[]
  isLoadingColumns: boolean
  isLoadingFilterOptions: boolean
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
  transformColumns,
  extraColumns,
  defaultFilters,
  viewConfigurationKey,
}: UseTableConfigurationOptions): UseTableConfigurationReturn {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")
  const [_, setSearchParams] = useSearchParams()

  const viewConfigKey = viewConfigurationKey ?? entity

  // Seed the adapter's default filters into the URL params. Used when no saved
  // view is active, both on initial sync and when clearing.
  const applyDefaultFilters = useCallback(
    (params: URLSearchParams) => {
      if (!defaultFilters) {
        return
      }
      Object.entries(defaultFilters).forEach(([key, value]) => {
        params.set(`${queryPrefix}_${key}`, JSON.stringify(value))
      })
    },
    [defaultFilters, queryPrefix]
  )

  const { activeView, createView } = useViewConfigurations(viewConfigKey)
  const currentActiveView = activeView?.view_configuration || null
  const { updateView } = useViewConfiguration(
    viewConfigKey,
    currentActiveView?.id || ""
  )

  const { columns: rawApiColumns, isLoading: isLoadingColumns } =
    useEntityColumns(entity, {
      enabled: isViewConfigEnabled,
    })

  const apiColumns = useMemo(() => {
    if (!rawApiColumns) {
      return undefined
    }
    const transformed = transformColumns
      ? transformColumns(rawApiColumns)
      : rawApiColumns
    return extraColumns?.length
      ? [...transformed, ...extraColumns]
      : transformed
  }, [rawApiColumns, transformColumns, extraColumns])

  // Extract relationship filter configs from filterable columns only
  const relationshipFilterConfigs = useMemo(() => {
    if (!apiColumns) {
      return []
    }

    const filterableColumns = apiColumns.filter(
      (column) => column.filter?.enabled
    )
    return getRelationshipFilterConfigs(filterableColumns)
  }, [apiColumns])

  const { options: relationshipOptions, isLoading: isLoadingFilterOptions } =
    useRelationshipFilterOptions(
      relationshipFilterConfigs as RelationshipFilterConfig[]
    )

  const resolvedFilters = useMemo(() => {
    if (!apiColumns) {
      return []
    }
    const filterableColumns = apiColumns.filter(
      (column) => column.filter?.enabled
    )
    return generateFiltersFromColumns(filterableColumns, relationshipOptions)
  }, [apiColumns, relationshipOptions])

  const queryParams = useQueryParams(
    ["q", "order", "offset", "limit", ...resolvedFilters.map((f) => f.id)],
    queryPrefix
  )

  const columnsToRender = useMemo(() => {
    return apiColumns?.filter((column) => column.context !== "filter")
  }, [apiColumns])

  // Column state
  const {
    visibleColumns,
    columnOrder,
    currentColumns,
    setColumnOrder,
    handleColumnVisibilityChange,
    handleViewChange: originalHandleViewChange,
  } = useColumnState(columnsToRender, currentActiveView)

  // Re-sync only when the content of the active view or the column set changes
  const activeViewSignature = currentActiveView
    ? `${currentActiveView.id}:${JSON.stringify(
        currentActiveView.configuration
      )}`
    : ""
  const columnsSignature = columnsToRender
    ? columnsToRender
        .map((column) => column.field)
        .sort()
        .join(",")
    : ""

  // Sync view configuration with URL and column state
  useEffect(() => {
    if (!columnsToRender) {
      return
    }
    originalHandleViewChange(currentActiveView, columnsToRender)
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
      } else {
        // No saved view: fall back to the adapter's default filters.
        applyDefaultFilters(prev)
      }

      return prev
    })
    // Intentionally keyed on value signatures, not object identity: re-sync
    // only when the active view or the column set actually changes. Must NOT
    // depend on setSearchParams (its identity changes on every URL change) or
    // on the raw columnsToRender/currentActiveView objects (their identity can
    // churn every render), or it re-runs on each render and clears the
    // just-applied filter. applyDefaultFilters is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewSignature, columnsSignature])

  // Current configuration from URL
  const currentConfiguration = useMemo(() => {
    const currentFilters: Record<string, any> = {}
    resolvedFilters.forEach((filter) => {
      if (queryParams[filter.id] !== undefined) {
        currentFilters[filter.id] = JSON.parse(queryParams[filter.id] || "")
      }
    })

    return {
      filters: currentFilters,
      sorting: queryParams.order ? parseSortingState(queryParams.order) : null,
      search: queryParams.q || "",
    }
  }, [resolvedFilters, queryParams])

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
      // Check filters against the adapter's default filters (the baseline when
      // no view is saved), not against "no filters".
      const baselineFilters = defaultFilters ?? {}
      const filterKeys = new Set([
        ...Object.keys(currentFilters),
        ...Object.keys(baselineFilters),
      ])
      for (const key of filterKeys) {
        if (
          JSON.stringify(currentFilters[key]) !==
          JSON.stringify(baselineFilters[key])
        ) {
          return true
        }
      }
      if (currentSorting !== null) {
        return true
      }
      if (currentSearch !== "") {
        return true
      }

      if (columnsToRender) {
        const currentVisibleSet = new Set(currentVisibleColumns)
        const defaultVisibleSet = new Set(
          columnsToRender
            .filter((col) => col.default_visible)
            .map((col) => col.field)
        )

        if (
          currentVisibleSet.size !== defaultVisibleSet.size ||
          [...currentVisibleSet].some((field) => !defaultVisibleSet.has(field))
        ) {
          return true
        }

        const defaultOrder = [...columnsToRender]
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
    columnsToRender,
    defaultFilters,
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
    if (columnsToRender) {
      originalHandleViewChange(currentActiveView, columnsToRender)
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
      } else {
        // No saved view: clear back to the adapter's default filters.
        applyDefaultFilters(prev)
      }

      return prev
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentActiveView, columnsToRender, queryPrefix])

  // Calculate required fields based on visible columns
  const requiredFields = useMemo(() => {
    return calculateRequiredFields(columnsToRender || [], visibleColumns)
  }, [columnsToRender, visibleColumns])

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
    apiColumns: columnsToRender,
    filters: resolvedFilters,
    isLoadingColumns,
    isLoadingFilterOptions,
    queryParams,
    requiredFields,
  }
}
