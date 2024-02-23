import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"

const columnHelper = createColumnHelper<PricedShippingOption>()

export const useShippingOptionColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("price_type", {
        header: t("regions.priceType"),
        cell: ({ getValue }) => {
          const type = getValue()

          return (
            <StatusCell color={type === "flat_rate" ? "green" : "blue"}>
              {type === "flat_rate"
                ? t("regions.flatRate")
                : t("regions.calculated")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("price_incl_tax", {
        header: t("fields.price"),
        cell: ({ getValue, row }) => {
          const isCalculated = row.original.price_type === "calculated"

          if (isCalculated) {
            return <PlaceholderCell />
          }

          const amount = getValue()
          const currencyCode = row.original.region!.currency_code

          return <MoneyAmountCell currencyCode={currencyCode} amount={amount} />
        },
      }),
      columnHelper.display({
        id: "min_amount",
        header: "Min.",
        cell: ({ row }) => {
          const minAmountReq = row.original.requirements?.find(
            (r) => r.type === "min_subtotal"
          )

          if (!minAmountReq) {
            return <PlaceholderCell />
          }

          const amount = minAmountReq.amount
          const currencyCode = row.original.region!.currency_code

          return <MoneyAmountCell currencyCode={currencyCode} amount={amount} />
        },
      }),
      columnHelper.display({
        id: "max_amount",
        header: "Max.",
        cell: ({ row }) => {
          const maxAmountReq = row.original.requirements?.find(
            (r) => r.type === "max_subtotal"
          )

          if (!maxAmountReq) {
            return <PlaceholderCell />
          }

          const amount = maxAmountReq.amount
          const currencyCode = row.original.region!.currency_code

          return <MoneyAmountCell currencyCode={currencyCode} amount={amount} />
        },
      }),
      columnHelper.accessor("admin_only", {
        header: t("fields.availability"),
        cell: (cell) => {
          const value = cell.getValue()

          return (
            <StatusCell color={value ? "blue" : "green"}>
              {value ? t("general.admin") : t("general.store")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("is_return", {
        header: t("fields.type"),
        cell: (cell) => {
          const value = cell.getValue()

          return (
            <StatusCell color={value ? "blue" : "green"}>
              {value ? t("regions.return") : t("regions.outbound")}
            </StatusCell>
          )
        },
      }),
    ],
    [t]
  )
}
