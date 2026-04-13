import { DataTableEmptyStateProps } from "@medusajs/ui";
import { useMemo } from "react";

export const useSalesChannelTableEmptyState = (): DataTableEmptyStateProps => {
  return useMemo(() => {
    const content: DataTableEmptyStateProps = {
      empty: {
        heading: "No sales channels found",
        description: "Create a new sales channel to get started",
      },
      filtered: {
        heading: "No results",
        description: "No sales channels match the current filter criteria.",
      },
    };

    return content;
  }, []);
};
