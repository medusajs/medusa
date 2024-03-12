import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createColumnHelper } from "@tanstack/react-table"
import { NestedForm } from "@medusajs/admin-ui/ui/src/utils/nested-form.ts"

import { Input } from "@medusajs/ui"
import { LineItem, Order } from "@medusajs/medusa"

import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { Form } from "../../../../../components/common/form"

const columnHelper = createColumnHelper<LineItem>()

export const useItemsTableColumns = (
  order: Order,
  form: NestedForm<Record<string, number>>,
  onQuantityChangeComplete: (id: string) => void
) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      /**
       * TODO: investigate why enpoint doesn't joion `product`
       */
      // columnHelper.display({
      //   id: "product",
      //   header: () => (
      //     <div className="flex size-full items-center overflow-hidden">
      //       <span className="truncate">{t("fields.product")}</span>
      //     </div>
      //   ),
      //   cell: ({ row }) => (
      //     <div className="flex items-center overflow-hidden">
      //       <span className="truncate">
      //         {row.original.variant.product.title}
      //       </span>
      //     </div>
      //   ),
      // }),
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
            <Form.Field
              control={form.control}
              name={id}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="w-full border-none bg-transparent shadow-none"
                        min={0}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === "") {
                            form.setValue(id, null)
                          } else {
                            form.setValue(id, Number(val))
                          }
                        }}
                        onBlur={() => {
                          if (typeof form.getValues()[id] === "undefined") {
                            form.setValue(id, 0)
                          }
                          onQuantityChangeComplete(id)
                        }}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
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
    []
  )
}
