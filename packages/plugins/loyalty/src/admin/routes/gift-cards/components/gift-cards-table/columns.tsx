import { createDataTableColumnHelper, Text } from "@medusajs/ui"
import { useMemo } from "react"
import { AdminGiftCard } from "../../../../../types"
import { getRelativeDate } from "../../../../utils/format-date"
import { formatCurrency } from "@medusajs/dashboard/lib"

const columnHelper = createDataTableColumnHelper<AdminGiftCard>()

export const useGiftCardTableColumns = () => {
  return useMemo(() => {
    return [
      columnHelper.accessor("code", {
        header: "Code",
        cell: ({ row }) => {
          return row.original.code
        },
      }),

      columnHelper.accessor("line_item.product.title", {
        header: "Product",
        cell: ({ row }) => {
          return row.original.line_item?.product?.title || "Custom Gift Card"
        },
      }),

      columnHelper.accessor("created_at", {
        header: "Date issued",
        cell: ({ row }) => getRelativeDate(row.original.created_at),
      }),

      columnHelper.accessor("value", {
        header: "Value",
        cell: ({ row }) => {
          return formatCurrency(row.original.value, row.original.currency_code)
        },
      }),
    ]
  }, [])
}
