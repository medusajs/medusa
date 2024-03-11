import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createColumnHelper } from "@tanstack/react-table"
import { Checkbox } from "@medusajs/ui"
import {
  ProductCell,
  ProductHeader,
} from "../../../../../components/table/table-cells/product/product-cell"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { PricedVariant } from "@medusajs/client-types"

const columnHelper = createColumnHelper<PricedVariant>()

export const useVariantTableColumns = (currencyCode: string) => {
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
        cell: ({ row }) => <ProductCell product={row.original.product} />,
      }),
      columnHelper.accessor("sku", {
        header: t("fields.sku"),
      }),
      columnHelper.accessor("title", {
        header: t("fields.variant"),
      }),
      columnHelper.display({
        id: "amount",
        header: () => (
          <div className="text-small text-right font-semibold text-gray-500">
            {t("fields.price")}
          </div>
        ),
        cell: ({ row: { original } }) => {
          if (!original.original_price_incl_tax) {
            return null
          }

          const showOriginal = original.calculated_price_type !== "default"

          return (
            <div className="flex items-center justify-end gap-2">
              <div className="flex flex-col items-end">
                {showOriginal && (
                  <span className="text-gray-400 line-through">
                    <MoneyAmountCell
                      currencyCode={currencyCode}
                      amount={original.original_price_incl_tax}
                    />
                  </span>
                )}
                <span>
                  <MoneyAmountCell
                    currencyCode={currencyCode}
                    amount={original.calculated_price_incl_tax}
                  />
                </span>
              </div>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
