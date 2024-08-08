import { Checkbox } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  ProductCell,
  ProductHeader,
} from "../../../../../components/table/table-cells/product/product-cell"

const columnHelper = createColumnHelper<any>()

export const useClaimOutboundItemTableColumns = (currencyCode: string) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          const isSelectable = row.getCanSelect()

          return (
            <Checkbox
              disabled={!isSelectable}
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      columnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => {
          return <ProductCell product={row.original.product} />
        },
      }),
      columnHelper.accessor("sku", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          return getValue() || "-"
        },
      }),
      columnHelper.accessor("title", {
        header: t("fields.title"),
      }),
    ],
    [t, currencyCode]
  )
}
