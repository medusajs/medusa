import { Button, DropdownMenu, clx } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { DataTableFacetedFilterContext } from "./context"
import { DateFilter } from "./date-filter"
import { useDataTableFacetedFilterContext } from "./hooks"
import { SelectFilter } from "./select-filter"

type FilterOption = {
  label: string
  value: unknown
}

type FacetedFilter = {
  key: string
  label: string
} & (
  | {
      type: "select"
      options: FilterOption[]
      multiple?: boolean
    }
  | {
      type: "date"
      options?: never
    }
)

type DataTableFacetedFilterProps = {
  filters: FacetedFilter[]
  prefix?: string
}

export const DataTableFacetedFilter = ({
  filters,
  prefix,
}: DataTableFacetedFilterProps) => {
  const [searchParams] = useSearchParams()

  const [activeFilters, setActiveFilters] = useState<
    (FacetedFilter & { openOnMount: boolean })[]
  >(getInitialFilters({ searchParams, filters, prefix }))

  const availableFilters = filters.filter(
    (f) => !activeFilters.find((af) => af.key === f.key)
  )

  const removeFilter = (key: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.key !== key))
  }

  const removeAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <DataTableFacetedFilterContext.Provider
      value={useMemo(
        () => ({
          removeFilter,
          removeAllFilters,
        }),
        [removeAllFilters, removeFilter]
      )}
    >
      <div className="flex items-center gap-2 flex-wrap max-w-2/3">
        {activeFilters.map((filter) => {
          if (filter.type === "select") {
            return (
              <SelectFilter
                key={filter.key}
                filter={filter}
                prefix={prefix}
                options={filter.options}
                multiple={filter.multiple}
                openOnMount={filter.openOnMount}
              />
            )
          }

          return (
            <DateFilter
              key={filter.key}
              filter={filter}
              prefix={prefix}
              openOnMount={filter.openOnMount}
            />
          )
        })}
        {availableFilters.length > 0 && (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button size="small" variant="secondary">
                Add filter
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {availableFilters.map((filter) => {
                return (
                  <DropdownMenu.Item
                    key={filter.key}
                    onSelect={() => {
                      setActiveFilters((prev) => [
                        ...prev,
                        { ...filter, openOnMount: true },
                      ])
                    }}
                  >
                    {filter.label}
                  </DropdownMenu.Item>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
        {activeFilters.length > 0 && (
          <ClearAllFilters filters={activeFilters} prefix={prefix} />
        )}
      </div>
    </DataTableFacetedFilterContext.Provider>
  )
}

type ClearAllFiltersProps = {
  filters: FacetedFilter[]
  prefix?: string
}

const ClearAllFilters = ({ filters, prefix }: ClearAllFiltersProps) => {
  const { removeAllFilters } = useDataTableFacetedFilterContext()
  const [_, setSearchParams] = useSearchParams()

  const handleRemoveAll = () => {
    removeAllFilters()
    setSearchParams((prev) => {
      filters.forEach((filter) => {
        prev.delete(prefix ? `${prefix}_${filter.key}` : filter.key)
      })
      return prev
    })
  }

  return (
    <button
      type="button"
      onClick={handleRemoveAll}
      className={clx(
        "px-2 py-1 text-ui-fg-muted transition-fg rounded-md txt-compact-small-plus",
        "hover:text-ui-fg-subtle",
        "focus-visible:shadow-borders-focus"
      )}
    >
      Clear all
    </button>
  )
}

const getInitialFilters = ({
  searchParams,
  filters,
  prefix,
}: {
  searchParams: URLSearchParams
  filters: FacetedFilter[]
  prefix?: string
}) => {
  const params = new URLSearchParams(searchParams)
  const activeFilters: (FacetedFilter & { openOnMount: boolean })[] = []

  filters.forEach((filter) => {
    const key = prefix ? `${prefix}_${filter.key}` : filter.key
    const value = params.get(key)
    if (value) {
      if (filter.type === "select") {
        activeFilters.push({
          ...filter,
          multiple: filter.multiple,
          options: filter.options,
          openOnMount: false,
        })
      } else {
        activeFilters.push({ ...filter, openOnMount: false })
      }
    }
  })

  console.log("activeFilters", activeFilters)
  return activeFilters
}
