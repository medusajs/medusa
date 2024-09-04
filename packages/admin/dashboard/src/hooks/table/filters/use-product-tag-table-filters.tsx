import { useDateTableFilters } from "./use-date-table-filters"

export const useProductTagTableFilters = () => {
  const dateFilters = useDateTableFilters()

  return dateFilters
}
