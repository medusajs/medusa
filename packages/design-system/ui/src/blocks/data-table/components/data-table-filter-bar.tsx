"use client"

import * as React from "react"

import { DataTableFilter } from "@/blocks/data-table/components/data-table-filter"
import { useDataTableContext } from "@/blocks/data-table/context/use-data-table-context"
import { Button } from "@/components/button"
import { Skeleton } from "@/components/skeleton"
import isEqual from "lodash.isequal"

interface DataTableFilterBarProps {
  /**
   * The label for the button that clears all active filters.
   * @default "Clear all"
   */
  clearAllFiltersLabel?: string
  alwaysShow?: boolean
  children?: React.ReactNode
}

interface LocalFilter {
  id: string
  value: unknown
  isNew: boolean
}

const isEmptyFilterValue = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0)

const DataTableFilterBar = ({
  clearAllFiltersLabel = "Clear all",
  alwaysShow = false,
  children,
}: DataTableFilterBarProps) => {
  const { instance } = useDataTableContext()

  // Local state for managing intermediate filters
  const [localFilters, setLocalFilters] = React.useState<LocalFilter[]>([])

  const parentFilterState = instance.getFiltering()

  // Sync parent filters with local state
  React.useEffect(() => {
    setLocalFilters((prevLocalFilters) => {
      const parentIds = Object.keys(parentFilterState)
      const localIds = prevLocalFilters.map((f) => f.id)

      // Start with filters that exist in parent or are new (user-added)
      const updatedLocalFilters: LocalFilter[] = prevLocalFilters
        .filter((f) => parentIds.includes(f.id) || f.isNew)
        .map((f) => {
          if (parentIds.includes(f.id)) {
            const parentValue = parentFilterState[f.id]
            // A "new" filter keeps its value picker open until it receives a
            // non-empty value; only settle it (isNew: false) once it has one.
            // getFiltering() returns a fresh object each render, so this sync
            // runs constantly — settling too early would collapse the picker
            // into an unopenable label-only pill.
            const isNew = f.isNew && isEmptyFilterValue(parentValue)
            if (!isEqual(f.value, parentValue) || f.isNew !== isNew) {
              return {
                id: f.id,
                value: parentValue,
                isNew,
              }
            }
          }
          return f
        })

      // Add parent filters that don't exist locally. A filter added from the
      // toolbar filter menu arrives here with an empty default value; mark it
      // as new so its value picker auto-opens and it self-removes if dismissed
      // without a value.
      parentIds.forEach((id) => {
        if (!localIds.includes(id)) {
          const value = parentFilterState[id]
          updatedLocalFilters.push({
            id,
            value,
            isNew: isEmptyFilterValue(value),
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

  // Update a local filter's value
  const updateLocalFilter = React.useCallback(
    (id: string, value: unknown) => {
      setLocalFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, value, isNew: false } : f))
      )

      if (isEmptyFilterValue(value)) {
        if (parentFilterState[id] !== undefined) {
          instance.removeFilter(id)
        }
        return
      }

      instance.updateFilter({ id, value })
    },
    [instance, parentFilterState]
  )

  // Remove a local filter
  const removeLocalFilter = React.useCallback(
    (id: string) => {
      setLocalFilters((prev) => prev.filter((f) => f.id !== id))
      // Also remove from parent if it exists there
      if (parentFilterState[id] !== undefined) {
        instance.removeFilter(id)
      }
    },
    [instance, parentFilterState]
  )

  // Clear every filter, including any new ones not yet committed to the parent
  const clearFilters = React.useCallback(() => {
    setLocalFilters([])
    instance.clearFilters()
  }, [instance])

  const filterCount = localFilters.length

  if (filterCount === 0 && !alwaysShow && !children) {
    return null
  }

  if (instance.showSkeleton) {
    return <DataTableFilterBarSkeleton filterCount={filterCount} />
  }

  return (
    <div className="flex w-full flex-nowrap items-center justify-between gap-2 overflow-x-auto border-t px-6 py-2">
      <div className="flex min-h-[28px] flex-nowrap items-center gap-2 md:flex-wrap">
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
        {filterCount > 0 && (
          <Button
            variant="transparent"
            size="small"
            type="button"
            className="text-ui-fg-muted hover:text-ui-fg-subtle flex-shrink-0 whitespace-nowrap"
            onClick={clearFilters}
          >
            {clearAllFiltersLabel}
          </Button>
        )}
      </div>
      {children && (
        <div className="flex flex-shrink-0 items-center gap-2">{children}</div>
      )}
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
    <div className="flex w-full overflow-x-auto border-t px-6 py-2">
      <div className="flex min-h-[28px] flex-nowrap items-center gap-2 md:flex-wrap">
        {Array.from({ length: filterCount }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-[180px]" />
        ))}
        {filterCount > 0 ? <Skeleton className="h-7 w-[66px]" /> : null}
      </div>
    </div>
  )
}

export { DataTableFilterBar }
export type { DataTableFilterBarProps }
