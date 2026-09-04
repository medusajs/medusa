import { useMemo } from "react"
import { useDataTableDateFilters } from "@medusajs/dashboard/hooks"

export const useTransactionsTableFilters = ({}: {}) => {
  const dateFilterOptions = useDataTableDateFilters()

  return useMemo(() => {
    return [...dateFilterOptions]
  }, [dateFilterOptions])
}
