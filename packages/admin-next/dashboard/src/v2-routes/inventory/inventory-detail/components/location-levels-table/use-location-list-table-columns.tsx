import { InventoryNext, StockLocationDTO } from "@medusajs/types"

import { LocationActions } from "./location-actions"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

/**
 * Adds missing properties to the InventoryLevelDTO type.
 */
interface ExtendedLocationLevel extends InventoryNext.InventoryLevelDTO {
  stock_locations: StockLocationDTO[]
  reserved_quantity: number
  stocked_quantity: number
  available_quantity: number
}

const columnHelper = createColumnHelper<ExtendedLocationLevel>()

export const useLocationListTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("stock_locations.0.name", {
        header: t("fields.location"),
        cell: ({ getValue }) => {
          const locationName = getValue()

          if (!locationName) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{locationName.toString()}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("reserved_quantity", {
        header: t("inventory.reserved"),
        cell: ({ getValue }) => {
          const quantity = getValue()

          if (Number.isNaN(quantity)) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{quantity}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("stocked_quantity", {
        header: t("fields.inStock"),
        cell: ({ getValue }) => {
          const stockedQuantity = getValue()

          if (Number.isNaN(stockedQuantity)) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{stockedQuantity}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("available_quantity", {
        header: t("inventory.available"),
        cell: ({ getValue }) => {
          const availableQuantity = getValue()

          if (Number.isNaN(availableQuantity)) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{availableQuantity}</span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <LocationActions level={row.original} />,
      }),
    ],
    [t]
  )
}
