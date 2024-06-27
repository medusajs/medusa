import { useMemo } from "react"
import { Checkbox } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

import {
  ProductCell,
  ProductHeader,
} from "../../../../../components/table/table-cells/product/product-cell"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { getReturnableQuantity } from "../../../../../lib/rma.ts"

const columnHelper = createColumnHelper<any>()

export const useReturnItemTableColumns = (currencyCode: string) => {
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
        cell: ({ row }) => (
          <ProductCell product={row.original.variant.product} />
        ),
      }),
      columnHelper.accessor("variant.sku", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          return getValue() || "-"
        },
      }),
      columnHelper.accessor("variant.title", {
        header: t("fields.variant"),
      }),
      columnHelper.accessor("quantity", {
        header: () => (
          <div className="flex size-full items-center overflow-hidden text-right">
            <span className="truncate">{t("fields.quantity")}</span>
          </div>
        ),
        cell: ({ getValue, row }) => {
          return getReturnableQuantity(row.original)
        },
      }),
      columnHelper.accessor("refundable", {
        header: () => (
          <div className="flex size-full items-center justify-end overflow-hidden text-right">
            <span className="truncate">{t("fields.price")}</span>
          </div>
        ),
        cell: ({ getValue }) => {
          /**
           * TODO: what is equivalent of this in V2 ?
           */
          const amount = getValue() || 0

          const stylized = getStylizedAmount(amount, currencyCode)

          return (
            <div className="flex size-full items-center justify-end overflow-hidden text-right">
              <span className="truncate">{stylized}</span>
            </div>
          )
        },
      }),
    ],
    [t, currencyCode]
  )
}
