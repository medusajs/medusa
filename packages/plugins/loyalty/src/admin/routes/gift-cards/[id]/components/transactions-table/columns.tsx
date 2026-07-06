import { Badge, createDataTableColumnHelper, Text } from "@medusajs/ui";
import { useMemo } from "react";

import { AdminTransaction } from "../../../../../../types";
import DisplayId from "../../../../../components/display-id";
import { getRelativeDate } from "../../../../../utils/date-utils";
import { formatAmount } from "../../../../../utils/format-amount";

const columnHelper = createDataTableColumnHelper<AdminTransaction>();

export const useTransactionColumns = () => {
  return useMemo(() => {
    return [
      columnHelper.accessor("type", {
        header: "Type",
        cell: ({ row }) => {
          return (
            <Badge
              size="2xsmall"
              color={row.original.type === "debit" ? "orange" : "green"}
            >
              {row.original.type}
            </Badge>
          );
        },
      }),

      columnHelper.accessor("amount", {
        header: "Amount",
        cell: ({ row }) => {
          return (
            row.original.account.currency_code &&
            formatAmount(
              row.original.amount as number,
              row.original.account.currency_code
            )
          );
        },
      }),

      columnHelper.accessor("reference", {
        header: "Reference",
        cell: ({ row }) => {
          const prettyReference = row.original.reference
            ?.split("_")
            .join(" ")
            .split("-")
            .join(" ");

          return <Text className="capitalize">{prettyReference}</Text>;
        },
      }),

      columnHelper.accessor("reference_id", {
        header: "Reference ID",
        cell: ({ row }) => {
          return <DisplayId id={row.original.reference_id!} />;
        },
      }),

      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: ({ row }) => getRelativeDate(row.original.created_at),
      }),
    ];
  }, []);
};
