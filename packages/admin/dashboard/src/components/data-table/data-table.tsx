import {
  DataTable as UiDataTable,
  useDataTable,
  DataTableColumnDef,
  DataTableCommand,
  DataTableEmptyStateProps,
  DataTableFilter,
  DataTableRow,
  DataTableRowSelectionState,
  Heading,
  Text,
  Button,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableSortingState,
} from "@medusajs/ui"
import React, { ReactNode, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { useQueryParams } from "../../hooks/use-query-params"
import { ActionMenu } from "../common/action-menu"
import { ViewPills } from "../table/view-selector"
import { useFeatureFlag } from "../../providers/feature-flag-provider"

// Types for column visibility and ordering
type VisibilityState = Record<string, boolean>
type ColumnOrderState = string[]

type DataTableActionProps = {
  label: string
  disabled?: boolean
} & (
  | {
      to: string
    }
  | {
      onClick: () => void
    }
)

type DataTableActionMenuActionProps = {
  label: string
  icon: ReactNode
  disabled?: boolean
} & (
  | {
      to: string
    }
  | {
      onClick: () => void
    }
)

type DataTableActionMenuGroupProps = {
  actions: DataTableActionMenuActionProps[]
}

type DataTableActionMenuProps = {
  groups: DataTableActionMenuGroupProps[]
}

interface DataTableProps<TData> {
  data?: TData[]
  columns: DataTableColumnDef<TData, any>[]
  filters?: DataTableFilter[]
  commands?: DataTableCommand[]
  action?: DataTableActionProps
  actions?: DataTableActionProps[]
  actionMenu?: DataTableActionMenuProps
  rowCount?: number
  getRowId: (row: TData) => string
  enablePagination?: boolean
  enableSearch?: boolean
  autoFocusSearch?: boolean
  enableFilterMenu?: boolean
  rowHref?: (row: TData) => string
  emptyState?: DataTableEmptyStateProps
  heading?: string
  headingLevel?: "h1" | "h2" | "h3"
  subHeading?: string
  prefix?: string
  pageSize?: number
  isLoading?: boolean
  rowSelection?: {
    state: DataTableRowSelectionState
    onRowSelectionChange: (value: DataTableRowSelectionState) => void
    enableRowSelection?: boolean | ((row: DataTableRow<TData>) => boolean)
  }
  layout?: "fill" | "auto"
  enableColumnVisibility?: boolean
  initialColumnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  columnOrder?: ColumnOrderState
  onColumnOrderChange?: (order: ColumnOrderState) => void
  enableViewSelector?: boolean
  entity?: string
  currentColumns?: {
    visible: string[]
    order: string[]
  }
  filterBarContent?: React.ReactNode
}

export const DataTable = <TData,>({
  data = [],
  columns,
  filters,
  commands,
  action,
  actions,
  actionMenu,
  getRowId,
  rowCount = 0,
  enablePagination = true,
  enableSearch = true,
  autoFocusSearch = false,
  enableFilterMenu,
  rowHref,
  heading,
  headingLevel = "h1",
  subHeading,
  prefix,
  pageSize = 10,
  emptyState,
  rowSelection,
  isLoading = false,
  layout = "auto",
  enableColumnVisibility = false,
  initialColumnVisibility = {},
  onColumnVisibilityChange,
  columnOrder,
  onColumnOrderChange,
  enableViewSelector = false,
  entity,
  currentColumns,
  filterBarContent,
}: DataTableProps<TData>) => {
  const { t } = useTranslation()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  // If view config is disabled, don't use column visibility features
  const effectiveEnableColumnVisibility =
    isViewConfigEnabled && enableColumnVisibility
  const effectiveEnableViewSelector = isViewConfigEnabled && enableViewSelector

  const enableFiltering = filters && filters.length > 0
  const showFilterMenu =
    enableFilterMenu !== undefined ? enableFilterMenu : enableFiltering
  const enableCommands = commands && commands.length > 0
  const enableSorting = columns.some((column) => column.enableSorting)

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)

  // Update column visibility when initial visibility changes
  React.useEffect(() => {
    // Deep compare to check if the visibility has actually changed
    const currentKeys = Object.keys(columnVisibility).sort()
    const newKeys = Object.keys(initialColumnVisibility).sort()

    const hasChanged =
      currentKeys.length !== newKeys.length ||
      currentKeys.some((key, index) => key !== newKeys[index]) ||
      Object.entries(initialColumnVisibility).some(
        ([key, value]) => columnVisibility[key] !== value
      )

    if (hasChanged) {
      setColumnVisibility(initialColumnVisibility)
    }
  }, [initialColumnVisibility])

  // Wrapper function to handle column visibility changes
  const handleColumnVisibilityChange = React.useCallback(
    (visibility: VisibilityState) => {
      setColumnVisibility(visibility)
      onColumnVisibilityChange?.(visibility)
    },
    [onColumnVisibilityChange]
  )

  // Extract filter IDs for query param management
  const filterIds = useMemo(() => filters?.map((f) => f.id) ?? [], [filters])
  const prefixedFilterIds = filterIds.map((id) => getQueryParamKey(id, prefix))

  const { offset, order, q, ...filterParams } = useQueryParams(
    [
      ...filterIds,
      ...(enableSorting ? ["order"] : []),
      ...(enableSearch ? ["q"] : []),
      ...(enablePagination ? ["offset"] : []),
    ],
    prefix
  )
  const [_, setSearchParams] = useSearchParams()

  const search = useMemo(() => {
    return q ?? ""
  }, [q])

  const handleSearchChange = (value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(getQueryParamKey("q", prefix), value)
      } else {
        prev.delete(getQueryParamKey("q", prefix))
      }

      return prev
    })
  }

  const pagination: DataTablePaginationState = useMemo(() => {
    return offset
      ? parsePaginationState(offset, pageSize)
      : { pageIndex: 0, pageSize }
  }, [offset, pageSize])

  const handlePaginationChange = (value: DataTablePaginationState) => {
    setSearchParams((prev) => {
      if (value.pageIndex === 0) {
        prev.delete(getQueryParamKey("offset", prefix))
      } else {
        prev.set(
          getQueryParamKey("offset", prefix),
          transformPaginationState(value).toString()
        )
      }
      return prev
    })
  }

  const filtering: DataTableFilteringState = useMemo(
    () => parseFilterState(filterIds, filterParams),
    [filterIds, filterParams]
  )

  const handleFilteringChange = (value: DataTableFilteringState) => {
    setSearchParams((prev) => {
      // Remove filters that are no longer in the state
      Array.from(prev.keys()).forEach((key) => {
        if (prefixedFilterIds.includes(key)) {
          // Extract the unprefixed key
          const unprefixedKey = prefix ? key.replace(`${prefix}_`, "") : key
          if (!(unprefixedKey in value)) {
            prev.delete(key)
          }
        }
      })

      // Add or update filters in the state
      Object.entries(value).forEach(([key, filter]) => {
        const prefixedKey = getQueryParamKey(key, prefix)
        if (filter !== undefined) {
          prev.set(prefixedKey, JSON.stringify(filter))
        } else {
          prev.delete(prefixedKey)
        }
      })

      return prev
    })
  }

  const sorting: DataTableSortingState | null = useMemo(() => {
    return order ? parseSortingState(order) : null
  }, [order])

  // Memoize current configuration to prevent infinite loops
  const currentConfiguration = useMemo(
    () => ({
      filters: filtering,
      sorting: sorting,
      search: search,
    }),
    [filtering, sorting, search]
  )

  const handleSortingChange = (value: DataTableSortingState) => {
    setSearchParams((prev) => {
      if (value) {
        const valueToStore = transformSortingState(value)

        prev.set(getQueryParamKey("order", prefix), valueToStore)
      } else {
        prev.delete(getQueryParamKey("order", prefix))
      }

      return prev
    })
  }

  const { pagination: paginationTranslations, toolbar: toolbarTranslations } =
    useDataTableTranslations()

  const navigate = useNavigate()

  const onRowClick = useCallback(
    (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: TData) => {
      if (!rowHref) {
        return
      }

      const href = rowHref(row)
      const basePath = __BASE__ || "/"
      const hrefWithBasePath = `${basePath === "/" ? "" : basePath}${href}`

      if (event.metaKey || event.ctrlKey || event.button === 1) {
        window.open(hrefWithBasePath, "_blank", "noreferrer")
        return
      }

      if (event.shiftKey) {
        window.open(hrefWithBasePath, undefined, "noreferrer")
        return
      }

      navigate(href)
    },
    [navigate, rowHref]
  )

  const instance = useDataTable({
    data,
    columns,
    filters,
    commands,
    rowCount,
    getRowId,
    onRowClick: rowHref ? onRowClick : undefined,
    pagination: enablePagination
      ? {
          state: pagination,
          onPaginationChange: handlePaginationChange,
        }
      : undefined,
    filtering: enableFiltering
      ? {
          state: filtering,
          onFilteringChange: handleFilteringChange,
        }
      : undefined,
    sorting: enableSorting
      ? {
          state: sorting,
          onSortingChange: handleSortingChange,
        }
      : undefined,
    search: enableSearch
      ? {
          state: search,
          onSearchChange: handleSearchChange,
        }
      : undefined,
    rowSelection,
    isLoading,
    columnVisibility: effectiveEnableColumnVisibility
      ? {
          state: columnVisibility,
          onColumnVisibilityChange: handleColumnVisibilityChange,
        }
      : undefined,
    columnOrder:
      effectiveEnableColumnVisibility && columnOrder && onColumnOrderChange
        ? {
            state: columnOrder,
            onColumnOrderChange: onColumnOrderChange,
          }
        : undefined,
  })

  const shouldRenderHeading = heading || subHeading

  return (
    <UiDataTable
      instance={instance}
      className={
        layout === "fill" ? "h-full [&_tr]:last-of-type:!border-b" : undefined
      }
    >
      <UiDataTable.Toolbar
        className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center"
        translations={toolbarTranslations}
        filterBarContent={filterBarContent}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-x-4">
            {shouldRenderHeading && (
              <div>
                {heading && <Heading level={headingLevel}>{heading}</Heading>}
                {subHeading && (
                  <Text size="small" className="text-ui-fg-subtle">
                    {subHeading}
                  </Text>
                )}
              </div>
            )}
            {effectiveEnableViewSelector && entity && (
              <ViewPills
                entity={entity}
                currentColumns={currentColumns}
                currentConfiguration={currentConfiguration}
              />
            )}
          </div>
          <div className="flex items-center gap-x-2">
            {showFilterMenu && <UiDataTable.FilterMenu />}
            {enableSorting && <UiDataTable.SortingMenu />}
            {enableSearch && (
              <div className="w-full md:w-auto">
                <UiDataTable.Search
                  placeholder={t("filters.searchLabel")}
                  autoFocus={autoFocusSearch}
                />
              </div>
            )}
            {actionMenu && <ActionMenu variant="primary" {...actionMenu} />}
            {actions && actions.length > 0 && (
              <DataTableActions actions={actions} />
            )}
            {!actions && action && <DataTableAction {...action} />}
          </div>
        </div>
      </UiDataTable.Toolbar>
      <UiDataTable.Table emptyState={emptyState} />
      {enablePagination && (
        <UiDataTable.Pagination translations={paginationTranslations} />
      )}
      {enableCommands && (
        <UiDataTable.CommandBar
          selectedLabel={(count) => `${count} selected`}
        />
      )}
    </UiDataTable>
  )
}

function transformSortingState(value: DataTableSortingState) {
  return value.desc ? `-${value.id}` : value.id
}

function parseSortingState(value: string) {
  return value.startsWith("-")
    ? { id: value.slice(1), desc: true }
    : { id: value, desc: false }
}

function transformPaginationState(value: DataTablePaginationState) {
  return value.pageIndex * value.pageSize
}

function parsePaginationState(value: string, pageSize: number) {
  const offset = parseInt(value)

  return {
    pageIndex: Math.floor(offset / pageSize),
    pageSize,
  }
}

function parseFilterState(
  filterIds: string[],
  value: Record<string, string | undefined>
) {
  if (!value) {
    return {}
  }

  const filters: DataTableFilteringState = {}

  for (const id of filterIds) {
    const filterValue = value[id]

    if (filterValue !== undefined) {
      filters[id] = JSON.parse(filterValue)
    }
  }

  return filters
}

function getQueryParamKey(key: string, prefix?: string) {
  return prefix ? `${prefix}_${key}` : key
}

const useDataTableTranslations = () => {
  const { t } = useTranslation()

  const paginationTranslations = {
    of: t("general.of"),
    results: t("general.results"),
    pages: t("general.pages"),
    prev: t("general.prev"),
    next: t("general.next"),
  }

  const toolbarTranslations = {
    clearAll: t("actions.clearAll"),
    sort: t("filters.sortLabel"),
    columns: "Columns",
  }

  return {
    pagination: paginationTranslations,
    toolbar: toolbarTranslations,
  }
}

const DataTableAction = ({
  label,
  disabled,
  ...props
}: DataTableActionProps) => {
  const buttonProps = {
    size: "small" as const,
    disabled: disabled ?? false,
    type: "button" as const,
    variant: "secondary" as const,
  }

  if ("to" in props) {
    return (
      <Button {...buttonProps} asChild>
        <Link to={props.to}>{label}</Link>
      </Button>
    )
  }

  return (
    <Button {...buttonProps} onClick={props.onClick}>
      {label}
    </Button>
  )
}

const DataTableActions = ({ actions }: { actions: DataTableActionProps[] }) => {
  return (
    <div className="flex items-center gap-x-2">
      {actions.map((action, index) => (
        <DataTableAction key={index} {...action} />
      ))}
    </div>
  )
}
