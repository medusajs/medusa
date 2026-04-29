import { useMemo } from "react";
import { useDataTableDateFilters } from "../../../../hooks/common/use-data-table-date-filters";
import { useCustomerFilters } from "../../../../hooks/query/use-customers-filters";

export const useGiftCardFilters = () => {
  const dateFilterOptions = useDataTableDateFilters();
  const customerFilterOptions = useCustomerFilters();

  return useMemo(() => {
    return [...dateFilterOptions, ...customerFilterOptions];
  }, [dateFilterOptions, customerFilterOptions]);
};
