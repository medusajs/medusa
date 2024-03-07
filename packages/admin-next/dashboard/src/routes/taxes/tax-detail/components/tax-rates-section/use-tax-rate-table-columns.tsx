import type { TaxRate } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
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
          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{getValue()}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => {
          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{getValue()}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("rate", {
        header: t("fields.rate"),
        cell: ({ getValue }) => {
          const rate = getValue()

          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{formatPercentage(rate)}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("products", {
        header: () => {
          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">
                {t("taxes.taxRate.productOverridesHeader")}
              </span>
            </div>
          )
        },
        cell: ({ getValue }) => {
          const count = getValue()?.length

          if (!count) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{count}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("product_types", {
        header: () => {
          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">
                {t("taxes.taxRate.productTypeOverridesHeader")}
              </span>
            </div>
          )
        },
        cell: ({ getValue }) => {
          const count = getValue()?.length

          if (!count) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{count}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("shipping_options", {
        header: () => {
          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">
                {t("taxes.taxRate.shippingOptionOverridesHeader")}
              </span>
            </div>
          )
        },
        cell: ({ getValue }) => {
          const count = getValue()?.length

          if (!count) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex items-center overflow-hidden">
              <span className="truncate">{count}</span>
            </div>
          )
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
