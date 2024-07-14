import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const columnHelper = createColumnHelper<HttpTypes.AdminCurrency>()

export const useCurrenciesTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => getValue().toUpperCase(),
      }),
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
    ],
    [t]
  )
}
