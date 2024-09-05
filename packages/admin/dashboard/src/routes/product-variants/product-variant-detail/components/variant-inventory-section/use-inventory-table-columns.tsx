import { InventoryNext, ProductVariantDTO } from "@medusajs/types"

import { InventoryActions } from "./inventory-actions"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface ExtendedInventoryItem extends InventoryNext.InventoryItemDTO {
  variants: ProductVariantDTO[]
}

const columnHelper = createColumnHelper<ExtendedInventoryItem>()

export const useInventoryTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => {
          const title = getValue()

          if (!title) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{title}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("sku", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          const sku = getValue() as string

          if (!sku) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{sku}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("required_quantity", {
        header: t("fields.requiredQuantity"),
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
      columnHelper.display({
        id: "inventory_quantity",
        header: t("fields.inventory"),
        cell: ({ getValue, row: { original: inventory } }) => {
          if (!inventory.location_levels?.length) {
            return <PlaceholderCell />
          }

          let quantity = 0
          let locations = 0

          inventory.location_levels.forEach((level) => {
            quantity += level.available_quantity
            locations += 1
          })

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">
                {t("products.variant.tableItem", {
                  availableCount: quantity,
                  locationCount: locations,
                  count: locations,
                })}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <InventoryActions item={row.original} />,
      }),
    ],
    [t]
  )
}
