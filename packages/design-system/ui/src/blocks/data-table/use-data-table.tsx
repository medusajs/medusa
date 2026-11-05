import {
  ColumnFilter,
  ColumnFiltersState,
  type ColumnSort,
  type ColumnOrderState,
  PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type Updater,
  useTable,
  type ColumnVisibilityState as VisibilityState,
} from "@tanstack/react-table"
import * as React from "react"
import { dataTableFeatures, DataTableFeatures } from "./data-table-features"
import {
  DataTableColumnDef,
  DataTableColumnFilter,
  DataTableCommand,
  DataTableDateComparisonOperator,
  DataTableEmptyState,
  DataTableFilter,
  DataTableFilteringState,
  DataTableFilterOption,
  DataTablePaginationState,
  DataTableRow,
  DataTableRowData,
  DataTableRowSelectionState,
  DataTableSortingState,
} from "./types"

interface DataTableOptions<TData extends DataTableRowData>
  extends Pick<TableOptions<DataTableFeatures, TData>, "data" | "getRowId"> {
  /**
   * The columns to use for the table.
   */
  columns: DataTableColumnDef<TData, any>[]
  /**
   * The filters which the user can apply to the table.
   */
  filters?: DataTableFilter[]
  /**
   * The commands which the user can apply to selected rows.
   */
  commands?: DataTableCommand[]
  /**
   * Whether the data for the table is currently being loaded.
   */
  isLoading?: boolean
  /**
   * The state and callback for the filtering.
   */
  filtering?: {
    state: DataTableFilteringState
    onFilteringChange: (state: DataTableFilteringState) => void
  }
  /**
   * The state and callback for the row selection.
   */
  rowSelection?: {
    state: DataTableRowSelectionState
    onRowSelectionChange: (state: DataTableRowSelectionState) => void
    enableRowSelection?:
      | boolean
      | ((row: DataTableRow<TData>) => boolean)
      | undefined
  }
  /**
   * The state and callback for the sorting.
   */
  sorting?: {
    state: DataTableSortingState | null
    onSortingChange: (state: DataTableSortingState) => void
  }
  /**
   * The state and callback for the search, with optional debounce.
   */
  search?: {
    state: string
    onSearchChange: (state: string) => void
    /**
     * Debounce time in milliseconds for the search callback.
     * @default 300
     */
    debounce?: number
  }
  /**
   * The state and callback for the pagination.
   */
  pagination?: {
    state: DataTablePaginationState
    onPaginationChange: (state: DataTablePaginationState) => void
  }
  /**
   * The function to execute when a row is clicked.
   */
  onRowClick?: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: TData
  ) => void
  /**
   * The total count of rows. When working with pagination, this will be the total
   * number of rows available, not the number of rows currently being displayed.
   */
  rowCount?: number
  /**
   * Whether the page index should be reset the filtering, sorting, or pagination changes.
   *
   * @default true
   */
  autoResetPageIndex?: boolean
  /**
   * The state and callback for the column visibility.
   */
  columnVisibility?: {
    state: VisibilityState
    onColumnVisibilityChange: (state: VisibilityState) => void
  }
  /**
   * The state and callback for the column order.
   */
  columnOrder?: {
    state: ColumnOrderState
    onColumnOrderChange: (state: ColumnOrderState) => void
  }
}

interface UseDataTableReturn<TData extends DataTableRowData>
  extends Pick<
    ReturnType<typeof useTable<DataTableFeatures, TData>>,
    | "getHeaderGroups"
    | "getRowModel"
    | "getCanNextPage"
    | "getCanPreviousPage"
    | "nextPage"
    | "previousPage"
    | "getPageCount"
    | "getAllColumns"
    | "setColumnVisibility"
    | "setColumnOrder"
  > {
  getSorting: () => DataTableSortingState | null
  setSorting: (
    sortingOrUpdater:
      | DataTableSortingState
      | ((prev: DataTableSortingState | null) => DataTableSortingState)
  ) => void
  getFilters: () => DataTableFilter[]
  getFilterOptions: <
    T extends string | string[] | DataTableDateComparisonOperator
  >(
    id: string
  ) => DataTableFilterOption<T>[] | null
  getFilterMeta: (id: string) => DataTableFilter | null
  getFiltering: () => DataTableFilteringState
  addFilter: (filter: DataTableColumnFilter) => void
  removeFilter: (id: string) => void
  clearFilters: () => void
  updateFilter: (filter: DataTableColumnFilter) => void
  getSearch: () => string
  onSearchChange: (search: string) => void
  getCommands: () => DataTableCommand[]
  getRowSelection: () => DataTableRowSelectionState
  onRowClick?: (
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: TData
  ) => void
  emptyState: DataTableEmptyState
  isLoading: boolean
  showSkeleton: boolean
  pageIndex: number
  pageSize: number
  rowCount: number
  enablePagination: boolean
  enableFiltering: boolean
  enableSorting: boolean
  enableSearch: boolean
  enableColumnVisibility: boolean
  enableColumnOrder: boolean
  columnOrder: ColumnOrderState
  setColumnOrderFromArray: (order: string[]) => void
}

const useDataTable = <TData extends DataTableRowData>({
  rowCount = 0,
  filters,
  commands,
  rowSelection,
  sorting,
  filtering,
  pagination,
  search,
  onRowClick,
  autoResetPageIndex = true,
  isLoading = false,
  columnVisibility,
  columnOrder,
  ...options
}: DataTableOptions<TData>): UseDataTableReturn<TData> => {
  const { state: sortingState, onSortingChange } = sorting ?? {}
  const { state: filteringState, onFilteringChange } = filtering ?? {}
  const { state: paginationState, onPaginationChange } = pagination ?? {}
  const {
    state: rowSelectionState,
    onRowSelectionChange,
    enableRowSelection,
  } = rowSelection ?? {}
  const { state: columnVisibilityState, onColumnVisibilityChange } = columnVisibility ?? {}
  const { state: columnOrderState, onColumnOrderChange } = columnOrder ?? {}
  
  // Store filter metadata like openOnMount

  const autoResetPageIndexHandler = React.useCallback(() => {
    return autoResetPageIndex
      ? () =>
          paginationState &&
          onPaginationChange?.({ ...paginationState, pageIndex: 0 })
      : undefined
  }, [autoResetPageIndex, paginationState, onPaginationChange])

  const sortingStateHandler = React.useCallback(() => {
    return onSortingChange
      ? (updaterOrValue: Updater<SortingState>) => {
          autoResetPageIndexHandler()?.()
          onSortingChangeTransformer(
            onSortingChange,
            sortingState
          )(updaterOrValue)
        }
      : undefined
  }, [onSortingChange, sortingState, autoResetPageIndexHandler])

  const rowSelectionStateHandler = React.useCallback(() => {
    return onRowSelectionChange
      ? (updaterOrValue: Updater<RowSelectionState>) => {
          onRowSelectionChangeTransformer(
            onRowSelectionChange,
            rowSelectionState
          )(updaterOrValue)
        }
      : undefined
  }, [onRowSelectionChange, rowSelectionState, autoResetPageIndexHandler])

  const filteringStateHandler = React.useCallback(() => {
    return onFilteringChange
      ? (updaterOrValue: Updater<ColumnFiltersState>) => {
          autoResetPageIndexHandler()?.()
          onFilteringChangeTransformer(
            onFilteringChange,
            filteringState
          )(updaterOrValue)
        }
      : undefined
  }, [onFilteringChange, filteringState, autoResetPageIndexHandler])

  const paginationStateHandler = React.useCallback(() => {
    return onPaginationChange
      ? onPaginationChangeTransformer(onPaginationChange, paginationState)
      : undefined
  }, [onPaginationChange, paginationState])

  const columnVisibilityStateHandler = React.useCallback(() => {
    return onColumnVisibilityChange
      ? (updaterOrValue: Updater<VisibilityState>) => {
          const value =
            typeof updaterOrValue === "function"
              ? updaterOrValue(columnVisibilityState ?? {})
              : updaterOrValue

          onColumnVisibilityChange(value)
        }
      : undefined
  }, [onColumnVisibilityChange, columnVisibilityState])

  const columnOrderStateHandler = React.useCallback(() => {
    return onColumnOrderChange
      ? (updaterOrValue: Updater<ColumnOrderState>) => {
          const value =
            typeof updaterOrValue === "function"
              ? updaterOrValue(columnOrderState ?? [])
              : updaterOrValue

          onColumnOrderChange(value)
        }
      : undefined
  }, [onColumnOrderChange, columnOrderState])

  const instance = useTable({
    ...options,
    features: dataTableFeatures,
    state: {
      rowSelection: (rowSelectionState ?? {}) as RowSelectionState,
      sorting: sortingState ? [sortingState] : undefined,
      columnFilters: Object.entries(filteringState ?? {}).map(
        ([id, filter]) => ({
          id,
          value: filter,
        })
      ),
      pagination: paginationState,
      columnVisibility: columnVisibilityState ?? {},
      columnOrder: columnOrderState ?? [],
    },
    enableRowSelection,
    rowCount,
    onColumnFiltersChange: filteringStateHandler(),
    onRowSelectionChange: rowSelectionStateHandler(),
    onSortingChange: sortingStateHandler(),
    onPaginationChange: paginationStateHandler(),
    onColumnVisibilityChange: columnVisibilityStateHandler(),
    onColumnOrderChange: columnOrderStateHandler(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
  })

  const getSorting = React.useCallback(() => {
    return instance.state.sorting?.[0] ?? null
  }, [instance])

  const setSorting = React.useCallback(
    (
      sortingOrUpdater: ColumnSort | ((prev: ColumnSort | null) => ColumnSort)
    ) => {
      const currentSort = instance.state.sorting?.[0] ?? null
      const newSorting =
        typeof sortingOrUpdater === "function"
          ? sortingOrUpdater(currentSort)
          : sortingOrUpdater

      autoResetPageIndexHandler()?.()
      instance.setSorting([newSorting])
    },
    [instance, autoResetPageIndexHandler]
  )

  const getFilters = React.useCallback(() => {
    return filters ?? []
  }, [filters])

  const getFilterOptions = React.useCallback(
    <T extends string | string[] | DataTableDateComparisonOperator>(
      id: string
    ) => {
      const filter = getFilters().find((filter) => filter.id === id)

      if (!filter) {
        return null
      }

      return ((filter as any).options as DataTableFilterOption<T>[]) || null
    },
    [getFilters]
  )

  const getFilterMeta = React.useCallback(
    (id: string) => {
      return getFilters().find((filter) => filter.id === id) || null
    },
    [getFilters]
  )

  const getFiltering = React.useCallback(() => {
    const state = instance.state.columnFilters ?? []
    return Object.fromEntries(state.map((filter) => [filter.id, filter.value]))
  }, [instance])

  const addFilter = React.useCallback(
    (filter: DataTableColumnFilter) => {
      const currentFilters = getFiltering()
      const newFilters = { ...currentFilters, [filter.id]: filter.value }
      autoResetPageIndexHandler()?.()
      onFilteringChange?.(newFilters)
    },
    [onFilteringChange, getFiltering, autoResetPageIndexHandler]
  )

  const removeFilter = React.useCallback(
    (id: string) => {
      const currentFilters = getFiltering()
      delete currentFilters[id]
      autoResetPageIndexHandler()?.()
      onFilteringChange?.(currentFilters)
    },
    [onFilteringChange, getFiltering, autoResetPageIndexHandler]
  )

  const clearFilters = React.useCallback(() => {
    autoResetPageIndexHandler()?.()
    onFilteringChange?.({})
  }, [onFilteringChange, autoResetPageIndexHandler])

  const updateFilter = React.useCallback(
    (filter: ColumnFilter) => {
      addFilter(filter)
    },
    [addFilter]
  )

  const { state: searchState, onSearchChange, debounce = 300 } = search ?? {}

  const [localSearch, setLocalSearch] = React.useState(searchState ?? "")
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  React.useEffect(() => {
    setLocalSearch(searchState ?? "")
  }, [searchState])

  const getSearch = React.useCallback(() => {
    return localSearch
  }, [localSearch])

  const debouncedSearchChange = React.useMemo(() => {
    if (!onSearchChange) {
      return undefined
    }

    return (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (debounce <= 0) {
        autoResetPageIndexHandler()?.()
        onSearchChange(value)
        return
      }

      timeoutRef.current = setTimeout(() => {
        autoResetPageIndexHandler()?.()
        onSearchChange(value)
      }, debounce)
    }
  }, [onSearchChange, debounce, autoResetPageIndexHandler])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const onSearchChangeHandler = React.useCallback(
    (search: string) => {
      setLocalSearch(search)
      debouncedSearchChange?.(search)
    },
    [debouncedSearchChange]
  )

  const getCommands = React.useCallback(() => {
    return commands ?? []
  }, [commands])

  const getRowSelection = React.useCallback(() => {
    return instance.state.rowSelection
  }, [instance])

  const rows = instance.getRowModel().rows

  const emptyState = React.useMemo(() => {
    const hasRows = rows.length > 0
    const hasSearch = Boolean(searchState)
    const hasFilters = Object.keys(filteringState ?? {}).length > 0

    if (hasRows) {
      return DataTableEmptyState.POPULATED
    }

    if (hasSearch || hasFilters) {
      return DataTableEmptyState.FILTERED_EMPTY
    }

    return DataTableEmptyState.EMPTY
  }, [rows, searchState, filteringState])

  const showSkeleton = React.useMemo(() => {
    return isLoading === true && rows.length === 0
  }, [isLoading, rows])

  const enablePagination: boolean = !!pagination
  const enableFiltering: boolean = !!filtering
  const enableSorting: boolean = !!sorting
  const enableSearch: boolean = !!search
  const enableColumnVisibility: boolean = !!columnVisibility
  const enableColumnOrder: boolean = !!columnOrder

  const setColumnOrderFromArray = React.useCallback((order: string[]) => {
    instance.setColumnOrder(order)
  }, [instance])

  return {
    // Table
    getHeaderGroups: instance.getHeaderGroups,
    getRowModel: instance.getRowModel,
    getAllColumns: instance.getAllColumns,
    setColumnVisibility: instance.setColumnVisibility,
    setColumnOrder: instance.setColumnOrder,
    // Pagination
    enablePagination,
    getCanNextPage: instance.getCanNextPage,
    getCanPreviousPage: instance.getCanPreviousPage,
    nextPage: instance.nextPage,
    previousPage: instance.previousPage,
    getPageCount: instance.getPageCount,
    pageIndex: instance.state.pagination?.pageIndex ?? 0,
    pageSize: instance.state.pagination?.pageSize ?? 10,
    rowCount,
    // Search
    enableSearch,
    getSearch,
    onSearchChange: onSearchChangeHandler,
    // Sorting
    enableSorting,
    getSorting,
    setSorting,
    // Filtering
    enableFiltering,
    getFilters,
    getFilterOptions,
    getFilterMeta,
    getFiltering,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
    // Commands
    getCommands,
    getRowSelection,
    // Handlers
    onRowClick,
    // Empty State
    emptyState,
    // Loading
    isLoading,
    showSkeleton,
    // Column Visibility
    enableColumnVisibility,
    // Column Order
    enableColumnOrder,
    columnOrder: instance.state.columnOrder,
    setColumnOrderFromArray,
  }
}

function onSortingChangeTransformer(
  onSortingChange: (state: ColumnSort) => void,
  state?: ColumnSort | null
) {
  return (updaterOrValue: Updater<SortingState>) => {
    const value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(state ? [state] : [])
        : updaterOrValue
    const columnSort = value[0]

    onSortingChange(columnSort)
  }
}

function onRowSelectionChangeTransformer(
  onRowSelectionChange: (state: DataTableRowSelectionState) => void,
  state?: DataTableRowSelectionState
) {
  return (updaterOrValue: Updater<RowSelectionState>) => {
    const value =
      typeof updaterOrValue === "function"
        ? updaterOrValue((state ?? {}) as RowSelectionState)
        : updaterOrValue

    onRowSelectionChange(value)
  }
}

function onFilteringChangeTransformer(
  onFilteringChange: (state: DataTableFilteringState) => void,
  state?: DataTableFilteringState
) {
  return (updaterOrValue: Updater<ColumnFiltersState>) => {
    const value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(
            Object.entries(state ?? {}).map(([id, filter]) => ({
              id,
              value: filter,
            }))
          )
        : updaterOrValue

    const transformedValue = Object.fromEntries(
      value.map((filter) => [filter.id, filter.value])
    )

    onFilteringChange(transformedValue)
  }
}

function onPaginationChangeTransformer(
  onPaginationChange: (state: PaginationState) => void,
  state?: PaginationState
) {
  return (updaterOrValue: Updater<PaginationState>) => {
    const value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(state ?? { pageIndex: 0, pageSize: 10 })
        : updaterOrValue

    onPaginationChange(value)
  }
}

export { useDataTable }
export type { DataTableOptions, UseDataTableReturn }
