import { useMemo } from "react"
import { useCustomerFilters } from "../../../../hooks/query/use-customers-filters"
import { useDataTableDateFilters } from "@medusajs/dashboard/hooks"

export const useGiftCardFilters = () => {
  const dateFilterOptions = useDataTableDateFilters()
  const customerFilterOptions = useCustomerFilters()

  return useMemo(() => {
    return [...dateFilterOptions, ...customerFilterOptions]
  }, [dateFilterOptions, customerFilterOptions])
}
