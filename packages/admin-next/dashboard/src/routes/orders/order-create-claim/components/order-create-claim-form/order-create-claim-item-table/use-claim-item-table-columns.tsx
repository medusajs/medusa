import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createColumnHelper } from "@tanstack/react-table"
import { LineItem } from "@medusajs/medusa"
import { Checkbox } from "@medusajs/ui"

import {
  ProductCell,
  ProductHeader,
} from "../../../../../../components/table/table-cells/product/product-cell"
import { getStylizedAmount } from "../../../../../../lib/money-amount-helpers"

const columnHelper = createColumnHelper<LineItem>()

export const useClaimItemTableColumns = (currencyCode: string) => {
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
          return (
            <Checkbox
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
            <span className="truncate">
              {t("orders.returns.returnableQuantityHeader")}
            </span>
          </div>
        ),
        cell: ({ getValue, row }) => {
          return getValue() - (row.original.returned_quantity || 0)
        },
      }),
      columnHelper.accessor("refundable", {
        header: () => (
          <div className="flex size-full items-center justify-end overflow-hidden text-right">
            <span className="truncate">
              {t("orders.returns.refundableAmountHeader")}
            </span>
          </div>
        ),
        cell: ({ getValue }) => {
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
    [t]
  )
}
