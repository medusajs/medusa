import { useDateTableFilters } from "./use-date-table-filters"

export const useCollectionTableFilters = () => {
  const dateFilters = useDateTableFilters()

  return dateFilters
}
