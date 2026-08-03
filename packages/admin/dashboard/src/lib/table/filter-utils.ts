import { HttpTypes } from "@medusajs/types"
import { createDataTableFilterHelper, DataTableFilter } from "@medusajs/ui"
import {
  DataTableFilterOption,
  DataTableFilterType,
} from "../../../../../design-system/ui/dist/esm/blocks/data-table/types"

const filterHelper = createDataTableFilterHelper()

/**
 * Maps API data types to DataTable filter UI types
 */
function getFilterType(column: HttpTypes.AdminColumn): DataTableFilterType {
  if (
    column.filter?.relationship ||
    column.data_type === "enum" ||
    column.filter?.enumValues
  ) {
    return "multiselect"
  }

  if (column.data_type === "date") {
    return "date"
  }

  if (column.data_type === "boolean") {
    return "radio"
  }

  if (column.data_type === "number" || column.data_type === "currency") {
    return "number"
  }

  if (column.data_type === "string") {
    return "string"
  }

  return "custom"
}

/**
 * Generates DataTable filters from API column definitions
 * @param apiColumns - Columns from the API with filter config
 * @param relationshipOptions - Pre-fetched options for relationship filters
 * @returns Array of DataTable filters
 */
export function generateFiltersFromColumns(
  apiColumns: HttpTypes.AdminColumn[],
  relationshipOptions?: Record<string, DataTableFilterOption<string>[]>
): DataTableFilter[] {
  const filters: DataTableFilter[] = []

  const filterableColumns = apiColumns.filter(
    (col) => col.filter?.enabled === true
  )

  for (const column of filterableColumns) {
    const filterType = getFilterType(column)

    const filterConfig: any = {
      label: column.name,
      type: filterType,
    }

    if (column.filter?.enumValues) {
      filterConfig.options = column.filter.enumValues.map((value) => ({
        label: value,
        value: value,
      }))
    }

    if (column.data_type === "boolean") {
      filterConfig.options = [
        { label: "True", value: "true" },
        { label: "False", value: "false" },
      ]
    }

    if (column.filter?.relationship) {
      const options = relationshipOptions?.[column.field]
      if (options) {
        filterConfig.options = options
        filterConfig.searchable = true
      } else {
        filterConfig.type = "string"
      }
    }

    if (filterType === "number") {
      filterConfig.includeOperators = true
    }

    // Note: do we want to limit the date options to the ones provided by the API? How would we
    // construct the UI filter?
    if (filterType === "date") {
      filterConfig.options = []
    }

    // TODO: Enhance DataTable component to support operators input?
    const filterKey = column.filter?.relationship?.filter_key || column.field

    filters.push(filterHelper.accessor(filterKey, filterConfig))
  }

  return filters
}

/**
 * Gets list of filterable columns with relationship configs
 */
export function getRelationshipFilterConfigs(
  apiColumns: HttpTypes.AdminColumn[]
): Array<{
  field: string
  config: NonNullable<HttpTypes.AdminColumn["filter"]>["relationship"]
}> {
  return apiColumns
    .filter((col) => col.filter?.enabled && col.filter.relationship)
    .map((col) => ({
      field: col.field,
      config: col.filter!.relationship!,
    }))
}
