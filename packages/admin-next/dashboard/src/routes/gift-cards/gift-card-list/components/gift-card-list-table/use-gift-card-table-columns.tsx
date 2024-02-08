import { GiftCard } from "@medusajs/medusa"
import { Badge } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { DisplayIdCell } from "../../../../../components/table/table-cells/order/display-id-cell"

const columnHelper = createColumnHelper<GiftCard>()

export const useGiftCardTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => {
          return <Badge size="2xsmall">{getValue()}</Badge>
        },
      }),
      columnHelper.accessor("order.display_id", {
        header: t("fields.order"),
        cell: ({ getValue }) => {
          return <DisplayIdCell displayId={getValue()} />
        },
      }),
      columnHelper.accessor("region", {
        header: t("fields.region"),
        cell: ({ row }) => {
          return row.original.region.name
        },
      }),
      columnHelper.accessor("is_disabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const isDisabled = getValue()

          return (
            <StatusCell color={isDisabled ? "red" : "green"}>
              {isDisabled ? t("general.disabled") : t("general.enabled")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.dateIssued"),
        cell: ({ getValue }) => {
          return <DateCell date={getValue()} />
        },
      }),
      columnHelper.accessor("value", {
        header: t("fields.balance"),
        cell: ({ getValue, row }) => {
          const currencyCode = row.original.region.currency_code
          const value = getValue()

          return <MoneyAmountCell amount={value} currencyCode={currencyCode} />
        },
      }),
      columnHelper.accessor("balance", {
        header: t("fields.balance"),
        cell: ({ getValue, row }) => {
          const currencyCode = row.original.region.currency_code
          const value = getValue()

          return <MoneyAmountCell amount={value} currencyCode={currencyCode} />
        },
      }),
    ],
    [t]
  ) as ColumnDef<GiftCard>[]
}
