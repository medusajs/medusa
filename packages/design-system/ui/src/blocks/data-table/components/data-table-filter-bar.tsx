"use client"

import * as React from "react"

import { DataTableFilter } from "@/blocks/data-table/components/data-table-filter"
import { DataTableFilterMenu } from "@/blocks/data-table/components/data-table-filter-menu"
import { DataTableSortingMenu } from "@/blocks/data-table/components/data-table-sorting-menu"
import { DataTableColumnVisibilityMenu } from "@/blocks/data-table/components/data-table-column-visibility-menu"
import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import { Skeleton } from "@/components/skeleton"
import isEqual from "lodash.isequal"

interface DataTableFilterBarProps {
  clearAllFiltersLabel?: string
  alwaysShow?: boolean
  sortingTooltip?: string
  columnsTooltip?: string
  children?: React.ReactNode
}

interface LocalFilter {
  id: string
  value: unknown
  isNew: boolean
}

const DataTableFilterBar = ({
  clearAllFiltersLabel = "Clear all",
  alwaysShow = false,
  sortingTooltip,
  columnsTooltip,
  children,
}: DataTableFilterBarProps) => {
  const { instance, enableColumnVisibility } = useDataTableContext()
  
  // Local state for managing intermediate filters
  const [localFilters, setLocalFilters] = React.useState<LocalFilter[]>([])
  
  const parentFilterState = instance.getFiltering()
  const availableFilters = instance.getFilters()
  
  // Sync parent filters with local state
  React.useEffect(() => {
    setLocalFilters((prevLocalFilters) => {
      const parentIds = Object.keys(parentFilterState)
      const localIds = prevLocalFilters.map((f) => f.id)

      // Start with filters that exist in parent or are new (user-added)
      const updatedLocalFilters: LocalFilter[] = prevLocalFilters
        .filter((f) => parentIds.includes(f.id) || f.isNew)
        .map((f) => {
          // If filter exists in parent, it's no longer "new"
          if (parentIds.includes(f.id)) {
            const parentValue = parentFilterState[f.id]
            if (!isEqual(f.value, parentValue) || f.isNew) {
              return {
                id: f.id,
                value: parentValue,
                isNew: false,
              }
            }
          }
          return f
        })

      // Add parent filters that don't exist locally
      parentIds.forEach((id) => {
        if (!localIds.includes(id)) {
          updatedLocalFilters.push({
            id,
            value: parentFilterState[id],
            isNew: false,
          })
        }
      })

      // Check if there's an actual change (length, IDs, or values)
      if (updatedLocalFilters.length !== prevLocalFilters.length) {
        return updatedLocalFilters
      }

      // Check if any filter ID changed position or if any value changed
      const hasChanges = updatedLocalFilters.some((f, i) => {
        const prev = prevLocalFilters[i]
        return (
          !prev ||
          f.id !== prev.id ||
          !isEqual(f.value, prev.value) ||
          f.isNew !== prev.isNew
        )
      })

      return hasChanges ? updatedLocalFilters : prevLocalFilters
    })
  }, [parentFilterState])
  
  // Add a new filter locally
  const addLocalFilter = React.useCallback((id: string, value: unknown) => {
    setLocalFilters(prev => [...prev, { id, value, isNew: true }])
  }, [])
  
  // Update a local filter's value
  const updateLocalFilter = React.useCallback((id: string, value: unknown) => {
    setLocalFilters(prev => prev.map(f => 
      f.id === id ? { ...f, value, isNew: false } : f
    ))
    
    // If the filter has a meaningful value, propagate to parent
    if (value !== undefined && value !== null && value !== '' && 
        !(Array.isArray(value) && value.length === 0)) {
      instance.updateFilter({ id, value })
    }
  }, [instance])
  
  // Remove a local filter
  const removeLocalFilter = React.useCallback((id: string) => {
    setLocalFilters(prev => prev.filter(f => f.id !== id))
    // Also remove from parent if it exists there
    if (parentFilterState[id] !== undefined) {
      instance.removeFilter(id)
    }
  }, [instance, parentFilterState])

  const clearFilters = React.useCallback(() => {
    setLocalFilters([])
    instance.clearFilters()
  }, [instance])

  const filterCount = localFilters.length
  const hasAvailableFilters = availableFilters.length > 0
  
  // Check if sorting is enabled
  const sortableColumns = instance.getAllColumns().filter((column) => column.getCanSort())
  const hasSorting = instance.enableSorting && sortableColumns.length > 0

  // Always show the filter bar when there are available filters, sorting, column visibility, or when forced
  if (filterCount === 0 && !hasAvailableFilters && !hasSorting && !enableColumnVisibility && !alwaysShow && !children) {
    return null
  }

  if (instance.showSkeleton) {
    return <DataTableFilterBarSkeleton filterCount={filterCount} />
  }

  return (
    <div className="bg-ui-bg-subtle flex w-full flex-nowrap items-center justify-between gap-2 overflow-x-auto border-t px-6 py-2">
      <div className="flex flex-nowrap items-center gap-2 md:flex-wrap">
        {localFilters.map((localFilter) => (
          <DataTableFilter 
            key={localFilter.id} 
            id={localFilter.id} 
            filter={localFilter.value} 
            isNew={localFilter.isNew}
            onUpdate={(value) => updateLocalFilter(localFilter.id, value)}
            onRemove={() => removeLocalFilter(localFilter.id)}
          />
        ))}
        {hasAvailableFilters && (
          <DataTableFilterMenu onAddFilter={addLocalFilter} />
        )}
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        {hasSorting && <DataTableSortingMenu tooltip={sortingTooltip} />}
        {enableColumnVisibility && <DataTableColumnVisibilityMenu tooltip={columnsTooltip} />}
        {children}
      </div>
    </div>
  )
}
DataTableFilterBar.displayName = "DataTable.FilterBar"

const DataTableFilterBarSkeleton = ({
  filterCount,
}: {
  filterCount: number
}) => {
  return (
    <div className="bg-ui-bg-subtle flex w-full flex-nowrap items-center gap-2 overflow-x-auto border-t px-6 py-2 md:flex-wrap">
      {Array.from({ length: filterCount }).map((_, index) => (
        <Skeleton key={index} className="h-7 w-[180px]" />
      ))}
      {filterCount > 0 ? <Skeleton className="h-7 w-[66px]" /> : null}
    </div>
  )
}

export { DataTableFilterBar }
export type { DataTableFilterBarProps }

