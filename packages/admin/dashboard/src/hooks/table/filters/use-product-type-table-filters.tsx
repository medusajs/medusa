import { useDateTableFilters } from "./use-date-table-filters"

export const useProductTypeTableFilters = () => {
  const dateFilters = useDateTableFilters()

  return dateFilters
}
