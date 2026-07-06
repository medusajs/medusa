import { createDataTableFilterHelper } from "@medusajs/ui";
import { subDays, subMonths } from "date-fns";
import { useMemo } from "react";
import { useDate } from "../../../../hooks/common/use-date";

const filterHelper = createDataTableFilterHelper<any>();

const useDateFilterOptions = () => {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  return useMemo(() => {
    return [
      {
        label: "Today",
        value: {
          $gte: today.toISOString(),
        },
      },
      {
        label: "Last 7 Days",
        value: {
          $gte: subDays(today, 7).toISOString(), // 7 days ago
        },
      },
      {
        label: "Last 30 Days",
        value: {
          $gte: subDays(today, 30).toISOString(), // 30 days ago
        },
      },
      {
        label: "Last 90 Days",
        value: {
          $gte: subDays(today, 90).toISOString(), // 90 days ago
        },
      },
      {
        label: "Last 12 Months",
        value: {
          $gte: subMonths(today, 12).toISOString(), // 12 months ago
        },
      },
    ];
  }, [today]);
};

export const useDataTableDateFilters = (disableRangeOption?: boolean) => {
  const { getFullDate } = useDate();
  const dateFilterOptions = useDateFilterOptions();

  const rangeOptions = useMemo(() => {
    if (disableRangeOption) {
      return {
        disableRangeOption: true,
      };
    }

    return {
      rangeOptionStartLabel: "Starting",
      rangeOptionEndLabel: "Ending",
      rangeOptionLabel: "Custom",
      options: dateFilterOptions,
    };
  }, [disableRangeOption, dateFilterOptions]);

  return useMemo(() => {
    return [
      filterHelper.accessor("created_at", {
        type: "date",
        label: "Created At",
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
      filterHelper.accessor("updated_at", {
        type: "date",
        label: "Updated At",
        format: "date",
        formatDateValue: (date) => getFullDate({ date }),
        options: dateFilterOptions,
        ...rangeOptions,
      }),
    ];
  }, [dateFilterOptions, getFullDate, rangeOptions]);
};
