import { useDateTableFilters } from "../../../../../hooks/table/filters/use-date-table-filters"

export const usePricingTableFilters = () => {
  const dateFilters = useDateTableFilters()

  return dateFilters
}
