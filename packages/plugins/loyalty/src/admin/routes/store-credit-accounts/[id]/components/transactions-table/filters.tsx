import { useMemo } from "react";
import { useDataTableDateFilters } from "../../../../../hooks/common/use-data-table-date-filters";

export const useTransactionsTableFilters = ({}: {}) => {
  const dateFilterOptions = useDataTableDateFilters();

  return useMemo(() => {
    return [...dateFilterOptions];
  }, [dateFilterOptions]);
};
