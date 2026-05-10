import { Badge, createDataTableColumnHelper } from "@medusajs/ui";
import { useMemo } from "react";
import { AdminStoreCreditAccount } from "../../../../../types";
import { formatAmount } from "../../../../utils/format-amount";
import { getRelativeDate } from "../../../../utils/format-date";

const columnHelper = createDataTableColumnHelper<AdminStoreCreditAccount>();

export const useStoreCreditAccountTableColumns = () => {
  return useMemo(() => {
    return [
      columnHelper.accessor("currency_code", {
        header: "Currency",
        cell: ({ row }) => {
          return (
            <Badge size="2xsmall">
              {row.original.currency_code.toUpperCase()}
            </Badge>
          );
        },
      }),

      columnHelper.accessor("customer.email", {
        header: "Customer",
        cell: ({ row }) => {
          return row.original.customer?.email ?? "N/A";
        },
      }),

      columnHelper.accessor("balance", {
        header: "Balance",
        cell: ({ row }) => {
          return formatAmount(
            row.original.balance as number,
            row.original.currency_code
          );
        },
      }),

      columnHelper.accessor("credits", {
        header: "Credits",
        cell: ({ row }) => {
          return formatAmount(
            row.original.credits as number,
            row.original.currency_code
          );
        },
      }),

      columnHelper.accessor("debits", {
        header: "Debits",
        cell: ({ row }) => {
          return formatAmount(
            row.original.debits as number,
            row.original.currency_code
          );
        },
      }),

      columnHelper.accessor("created_at", {
        header: "Created at",
        cell: ({ row }) => getRelativeDate(row.original.created_at),
      }),
    ];
  }, []);
};
