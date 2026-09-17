import { useMemo } from "react"
import { useCustomerFilters } from "../../../../hooks/query/use-customers-filters"
import { useDataTableDateFilters } from "@medusajs/dashboard/hooks"

export const useStoreCreditAccountFilters = () => {
  const dateFilterOptions = useDataTableDateFilters()
  const customerFilterOptions = useCustomerFilters()

  return useMemo(() => {
    return [...dateFilterOptions, ...customerFilterOptions]
  }, [dateFilterOptions, customerFilterOptions])
}
