import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ProductTypeRowActions } from "./product-table-row-actions"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminProductType>()

export const useProductTypeTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("value", {
        header: () => t("productTypes.fields.value"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("created_at", {
        header: () => t("fields.createdAt"),

        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return <DateCell date={date} />
        },
      }),
      columnHelper.accessor("updated_at", {
        header: () => t("fields.updatedAt"),
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return <DateCell date={date} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductTypeRowActions productType={row.original} />
        },
      }),
    ],
    [t]
  )
}
