import { createDataTableColumnHelper, Text } from "@medusajs/ui";
import { useMemo } from "react";
import { AdminTransaction } from "../../../../../../types";
import DisplayId from "../../../../../components/display-id";
import { formatAmount } from "../../../../../utils/format-amount";
import { formatDate } from "../../../../../utils/format-date";

const columnHelper = createDataTableColumnHelper<AdminTransaction>();

export const useTransactionsTableColumns = () => {
  return useMemo(() => {
    return [
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ row }) => {
          return <DisplayId id={row.original.id} />;
        },
      }),

      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: ({ row }) => formatDate(row.original.created_at, false),
      }),

      columnHelper.accessor("note", {
        header: "Description",
        cell: ({ row }) => row.original.note,
      }),

      columnHelper.accessor("note", {
        header: "Note",
        cell: ({ row }) => {
          return (
            <Text title={row.original.note} className="max-w-[300px] truncate">
              {row.original.note || "-"}
            </Text>
          );
        },
      }),

      columnHelper.accessor("amount", {
        header: "Amount",
        cell: ({ row }) => {
          const isDebit = row.original.type === "debit";

          return (
            row.original.account.currency_code &&
            formatAmount(
              (row.original.amount as number) * (isDebit ? -1 : 1),
              row.original.account.currency_code
            )
          );
        },
      }),
    ];
  }, []);
};
