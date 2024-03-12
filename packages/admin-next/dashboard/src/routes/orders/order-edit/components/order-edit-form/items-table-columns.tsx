import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createColumnHelper } from "@tanstack/react-table"

import { Input } from "@medusajs/ui"
import { LineItem, Order } from "@medusajs/medusa"

import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"

const columnHelper = createColumnHelper<LineItem>()

export const useItemsTableColumns = (
  order: Order,
  quantities: Record<string, number>,
  onQuantityChange: (value: number, id: string) => void
) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("fields.product")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center overflow-hidden">
            <span className="truncate">
              {row.original.variant.product.title}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "sku",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("fields.sku")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center overflow-hidden">
            <span className="truncate">
              {row.original.variant.sku || "N/A"}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "title",
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("fields.variant")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center overflow-hidden">
            <span className="truncate">{row.original.variant.title}</span>
          </div>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("fields.quantity")}</span>
          </div>
        ),
        cell: ({
          row: {
            original: { id },
          },
        }) => (
          <div className="block w-full">
            <Input
              className="w-full border-none bg-transparent shadow-none"
              type="number"
              min={0}
              value={quantities[id]}
              onChange={(e) => {
                const val = e.target.value
                if (val === "") {
                  onQuantityChange(undefined, id)
                } else {
                  onQuantityChange(Number(val), id)
                }
              }}
              onBlur={() => {
                if (typeof quantities[id] === "undefined") {
                  onQuantityChange(0, id)
                }
              }}
            />
          </div>
        ),
      }),
      columnHelper.accessor("total", {
        header: () => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{t("fields.price")}</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center overflow-hidden">
            <MoneyAmountCell
              currencyCode={order.currency_code}
              amount={getValue()}
            />
          </div>
        ),
      }),
    ],
    [quantities]
  )
}
