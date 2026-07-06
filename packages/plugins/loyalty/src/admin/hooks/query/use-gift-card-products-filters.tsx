import { useMemo } from "react";
import { useDataTableDateFilters } from "../common/use-data-table-date-filters";

const useGiftCardProductStatusFilterOptions = () => {
  return useMemo(() => {
    const options: { label: string; value: string }[] = [
      {
        label: "Draft",
        value: "draft",
      },
      {
        label: "Proposed",
        value: "proposed",
      },
      {
        label: "Published",
        value: "published",
      },
      {
        label: "Rejected",
        value: "rejected",
      },
    ];

    return options?.map(({ label, value }) => ({
      label,
      value,
    }));
  }, []);
};

export const useGiftCardProductsFilters = () => {
  const dateFilterOptions = useDataTableDateFilters();
  const giftCardProductStatusFilterOptions =
    useGiftCardProductStatusFilterOptions();

  return useMemo(() => {
    return [...dateFilterOptions];
  }, [giftCardProductStatusFilterOptions]);
};
