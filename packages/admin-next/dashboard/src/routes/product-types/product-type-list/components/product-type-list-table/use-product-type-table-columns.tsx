import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ProductTypeRowActions } from "./product-table-row-actions"

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
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("updated_at", {
        header: () => t("fields.updatedAt"),
        cell: ({ getValue }) => getValue(),
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
