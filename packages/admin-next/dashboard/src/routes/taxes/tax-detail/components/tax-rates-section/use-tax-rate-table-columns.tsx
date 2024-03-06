import type { TaxRate } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { TaxRateActions } from "./tax-rate-actions"

const columnHelper = createColumnHelper<TaxRate>()

export const useTaxRateTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => {
          return <span>{getValue()}</span>
        },
      }),
      columnHelper.accessor("code", {
        header: "Code",
        cell: ({ getValue }) => {
          return <span>{getValue()}</span>
        },
      }),
      columnHelper.accessor("rate", {
        header: "Rate",
        cell: ({ getValue }) => {
          return <span>{formatPercentage(getValue())}</span>
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <TaxRateActions taxRate={row.original} />,
      }),
    ],
    [t]
  )
}
