import { DraftOrder } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../../../components/table/table-cells/order/customer-cell"
import { DraftOrderTableActions } from "./draft-order-table-actions"

const columnHelper = createColumnHelper<DraftOrder>()

export const useDraftOrderTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: t("fields.id"),
        cell: ({ getValue }) => (
          <div className="flex size-full items-center overflow-hidden">
            <span className="truncate">#{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const status = getValue()

          const { color, label } = {
            open: { color: "orange", label: t("draftOrders.status.open") },
            completed: {
              color: "green",
              label: t("draftOrders.status.completed"),
            },
          }[status] as { color: "green" | "orange"; label: string }

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
      columnHelper.accessor("order", {
        header: t("fields.order"),
        cell: ({ getValue }) => {
          const displayId = getValue()?.display_id

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">
                {displayId ? `#${displayId}` : "-"}
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor("cart.customer", {
        header: () => <CustomerHeader />,
        cell: ({ getValue }) => {
          const customer = getValue()

          return <CustomerCell customer={customer} />
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ getValue }) => {
          const date = getValue()

          return <DateCell date={date} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <DraftOrderTableActions draftOrder={row.original} />,
      }),
    ],
    [t]
  )
}
