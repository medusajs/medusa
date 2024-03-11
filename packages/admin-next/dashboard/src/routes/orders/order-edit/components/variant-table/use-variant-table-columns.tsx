import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { ProductVariant } from "@medusajs/medusa"
import { Checkbox } from "@medusajs/ui"

const columnHelper = createColumnHelper<ProductVariant>()

export const useVariantTableColumns = () => {
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
      columnHelper.accessor("title", {
        header: t("fields.variant"),
      }),
    ],
    [t]
  )
}
