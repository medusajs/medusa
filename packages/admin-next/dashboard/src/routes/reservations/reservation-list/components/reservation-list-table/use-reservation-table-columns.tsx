import { ExtendedReservationItem } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { LinkButton } from "../../../../../components/common/link-button"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { ReservationActions } from "./reservation-actions"

const columnHelper = createColumnHelper<ExtendedReservationItem>()

export const useReservationTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("inventory_item", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          const inventoryItem = getValue()

          if (!inventoryItem || !inventoryItem.sku) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{inventoryItem.sku}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("line_item", {
        header: t("fields.order"),
        cell: ({ getValue }) => {
          const inventoryItem = getValue()

          if (!inventoryItem || !inventoryItem.order?.display_id) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <LinkButton to={`/orders/${inventoryItem.order.id}`}>
                <span className="truncate">
                  #{inventoryItem.order.display_id}
                </span>
              </LinkButton>
            </div>
          )
        },
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => {
          const description = getValue()

          if (!description) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{description}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.created"),
        cell: ({ getValue }) => {
          const created = getValue()

          return <DateCell date={created} />
        },
      }),
      columnHelper.accessor("quantity", {
        header: () => (
          <div className="flex size-full items-center justify-end overflow-hidden text-right">
            <span className="truncate">{t("fields.quantity")}</span>
          </div>
        ),
        cell: ({ getValue }) => {
          const quantity = getValue()

          return (
            <div className="flex size-full items-center justify-end overflow-hidden text-right">
              <span className="truncate">{quantity}</span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          const reservation = row.original

          return <ReservationActions reservation={reservation} />
        },
      }),
    ],
    [t]
  )
}
