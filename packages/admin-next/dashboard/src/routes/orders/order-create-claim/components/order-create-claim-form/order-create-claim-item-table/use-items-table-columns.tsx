import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createColumnHelper } from "@tanstack/react-table"
import { LineItem } from "@medusajs/medusa"
import { Checkbox } from "@medusajs/ui"

import {
  ProductCell,
  ProductHeader,
} from "../../../../../../components/table/table-cells/product/product-cell"

const columnHelper = createColumnHelper<LineItem>()

export const useItemsTableColumns = () => {
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
      }),
      columnHelper.accessor("variant.title", {
        header: t("fields.variant"),
      }),
    ],
    [t]
  )
}
