import { useDateTableFilters } from "../../../../../hooks/table/filters/use-date-table-filters"

export const useProductTypeTableFilters = () => {
  const dateFilters = useDateTableFilters()

  return dateFilters
}
