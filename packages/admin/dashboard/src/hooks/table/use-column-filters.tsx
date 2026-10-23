import { HttpTypes } from "@medusajs/types"
import { DataTableFilter } from "@medusajs/ui"
import { useMemo } from "react"
import {
  generateFiltersFromColumns,
  getRelationshipFilterConfigs,
} from "../../lib/table/filter-utils"
import {
  RelationshipFilterConfig,
  useRelationshipFilterOptions,
} from "./use-relationship-filter-options"

/**
 * Resolves the data table filters for the filterable columns, including the
 * options of relationship filters.
 */
export function useColumnFilters(apiColumns?: HttpTypes.AdminColumn[]): {
  filters: DataTableFilter[]
  isLoading: boolean
} {
  const filterableColumns = useMemo(
    () => apiColumns?.filter((column) => column.filter?.enabled),
    [apiColumns]
  )

  const relationshipFilterConfigs = useMemo(() => {
    return filterableColumns
      ? getRelationshipFilterConfigs(filterableColumns)
      : []
  }, [filterableColumns])

  const { options: relationshipOptions, isLoading } =
    useRelationshipFilterOptions(
      relationshipFilterConfigs as RelationshipFilterConfig[]
    )

  const filters = useMemo(() => {
    return filterableColumns
      ? generateFiltersFromColumns(filterableColumns, relationshipOptions)
      : []
  }, [filterableColumns, relationshipOptions])

  return { filters, isLoading }
}
