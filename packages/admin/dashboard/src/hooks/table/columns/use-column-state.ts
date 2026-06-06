import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { HttpTypes } from "@zjedene-medusa/types"

type ViewConfiguration =
  HttpTypes.AdminViewConfigurationResponse["view_configuration"]

interface ColumnState {
  visibility: Record<string, boolean>
  order: string[]
}

interface UseColumnStateReturn {
  visibleColumns: Record<string, boolean>
  columnOrder: string[]
  columnState: ColumnState
  currentColumns: {
    visible: string[]
    order: string[]
  }
  setVisibleColumns: (visibility: Record<string, boolean>) => void
  setColumnOrder: (order: string[]) => void
  handleColumnVisibilityChange: (visibility: Record<string, boolean>) => void
  handleViewChange: (
    view: ViewConfiguration | null,
    apiColumns: HttpTypes.AdminColumn[]
  ) => void
  initializeColumns: (apiColumns: HttpTypes.AdminColumn[]) => void
}

export function useColumnState(
  apiColumns: HttpTypes.AdminColumn[] | undefined,
  activeView?: ViewConfiguration | null
): UseColumnStateReturn {
  // Initialize state lazily to avoid unnecessary re-renders
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => {
      if (apiColumns?.length && activeView?.configuration) {
        // If there's an active view, initialize with its configuration
        const visibility: Record<string, boolean> = {}
        apiColumns.forEach((column) => {
          visibility[column.field] =
            activeView.configuration.visible_columns?.includes(column.field) ||
            false
        })
        return visibility
      } else if (apiColumns?.length) {
        return getInitialColumnVisibility(apiColumns)
      }
      return {}
    }
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    if (activeView?.configuration?.column_order) {
      // If there's an active view, use its column order
      return activeView.configuration.column_order
    } else if (apiColumns?.length) {
      return getInitialColumnOrder(apiColumns)
    }
    return []
  })

  const columnState = useMemo<ColumnState>(
    () => ({
      visibility: visibleColumns,
      order: columnOrder,
    }),
    [visibleColumns, columnOrder]
  )

  const currentColumns = useMemo(() => {
    const visible = Object.entries(visibleColumns)
      .filter(([_, isVisible]) => isVisible)
      .map(([field]) => field)

    return {
      visible,
      order: columnOrder,
    }
  }, [visibleColumns, columnOrder])

  const handleColumnVisibilityChange = useCallback(
    (visibility: Record<string, boolean>) => {
      setVisibleColumns(visibility)
    },
    []
  )

  const handleViewChange = useCallback(
    (view: ViewConfiguration | null, apiColumns: HttpTypes.AdminColumn[]) => {
      if (view?.configuration) {
        // Apply view configuration
        const newVisibility: Record<string, boolean> = {}
        apiColumns.forEach((column) => {
          newVisibility[column.field] =
            view.configuration.visible_columns?.includes(column.field) || false
        })
        setVisibleColumns(newVisibility)
        setColumnOrder(view.configuration.column_order || [])
      } else {
        // Reset to default visibility when no view is selected
        setVisibleColumns(getInitialColumnVisibility(apiColumns))
        setColumnOrder(getInitialColumnOrder(apiColumns))
      }
    },
    []
  )

  const initializeColumns = useCallback(
    (apiColumns: HttpTypes.AdminColumn[]) => {
      // Only initialize if we don't already have column state
      if (Object.keys(visibleColumns).length === 0) {
        setVisibleColumns(getInitialColumnVisibility(apiColumns))
      }
      if (columnOrder.length === 0) {
        setColumnOrder(getInitialColumnOrder(apiColumns))
      }
    },
    []
  )

  // Track previous active view to detect changes
  const prevActiveViewRef = useRef<ViewConfiguration | null | undefined>()

  // Sync local state when active view changes
  useEffect(() => {
    if (apiColumns?.length) {
      // Check if this is a different view or an update to the same view
      const viewChanged = prevActiveViewRef.current?.id !== activeView?.id
      const viewUpdated =
        activeView &&
        prevActiveViewRef.current?.id === activeView.id &&
        prevActiveViewRef.current.updated_at !== activeView.updated_at

      if (viewChanged || viewUpdated) {
        if (activeView?.configuration) {
          // Apply the active view's configuration
          const newVisibility: Record<string, boolean> = {}
          apiColumns.forEach((column) => {
            newVisibility[column.field] =
              activeView.configuration?.visible_columns?.includes(
                column.field
              ) || false
          })
          setVisibleColumns(newVisibility)
          setColumnOrder(activeView.configuration?.column_order || [])
        } else {
          // No active view - reset to defaults
          setVisibleColumns(getInitialColumnVisibility(apiColumns))
          setColumnOrder(getInitialColumnOrder(apiColumns))
        }
      }
    }

    prevActiveViewRef.current = activeView
  }, [activeView, apiColumns])

  return {
    visibleColumns,
    columnOrder,
    columnState,
    currentColumns,
    setVisibleColumns,
    setColumnOrder,
    handleColumnVisibilityChange,
    handleViewChange,
    initializeColumns,
  }
}

// Utility functions

const DEFAULT_COLUMN_ORDER = 500

/**
 * Gets the initial column visibility state from API columns
 */
function getInitialColumnVisibility(
  apiColumns: HttpTypes.AdminColumn[]
): Record<string, boolean> {
  if (!apiColumns || apiColumns.length === 0) {
    return {}
  }

  const visibility: Record<string, boolean> = {}

  apiColumns.forEach((column) => {
    visibility[column.field] = column.default_visible ?? true
  })

  return visibility
}

/**
 * Gets the initial column order from API columns
 */
function getInitialColumnOrder(apiColumns: HttpTypes.AdminColumn[]): string[] {
  if (!apiColumns || apiColumns.length === 0) {
    return []
  }

  const sortedColumns = [...apiColumns].sort((a, b) => {
    const orderA = a.default_order ?? DEFAULT_COLUMN_ORDER
    const orderB = b.default_order ?? DEFAULT_COLUMN_ORDER
    return orderA - orderB
  })

  return sortedColumns.map((col) => col.field)
}
