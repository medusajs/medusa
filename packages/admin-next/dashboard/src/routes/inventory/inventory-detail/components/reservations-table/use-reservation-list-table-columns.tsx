import { InventoryTypes, StockLocationDTO } from "@medusajs/types"

import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { ReservationActions } from "./reservation-actions"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

/**
 * Adds missing properties to the InventoryItemDTO type.
 */
interface ExtendedReservationItem extends InventoryTypes.ReservationItemDTO {
  line_item: { order_id: string }
  location: StockLocationDTO
}

const columnHelper = createColumnHelper<ExtendedReservationItem>()

export const useReservationTableColumn = ({ sku }: { sku: string }) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        header: t("fields.sku"),
        cell: () => {
          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{sku}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("line_item.order_id", {
        header: t("inventory.reservation.orderID"),
        cell: ({ getValue }) => {
          const orderId = getValue()

          if (!orderId) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{orderId}</span>
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
      columnHelper.accessor("location.name", {
        header: t("inventory.reservation.location"),
        cell: ({ getValue }) => {
          const location = getValue()

          if (!location) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{location}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ getValue }) => {
          const createdAt = getValue()

          if (!createdAt) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">
                {createdAt instanceof Date ? createdAt.toString() : createdAt}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <ReservationActions reservation={row.original} />,
      }),
    ],
    [t]
  )
}
