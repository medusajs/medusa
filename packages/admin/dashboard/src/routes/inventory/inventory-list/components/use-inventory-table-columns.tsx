import { AdminInventoryItem } from "@medusajs/types"

import { Checkbox } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../../../components/table/table-cells/common/placeholder-cell"
import { InventoryActions } from "./inventory-actions"

const columnHelper = createColumnHelper<AdminInventoryItem>()

export const useInventoryTableColumns = ({
  showSelectColumn,
  showStockLevels,
  canUpdate,
  canDelete,
}: {
  showSelectColumn: boolean
  showStockLevels: boolean
  canUpdate: boolean
  canDelete: boolean
}) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      ...(showSelectColumn
        ? [
            columnHelper.display({
              id: "select",
              header: ({ table }) => {
                return (
                  <Checkbox
                    checked={
                      table.getIsSomePageRowsSelected()
                        ? "indeterminate"
                        : table.getIsAllPageRowsSelected()
                    }
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                  />
                )
              },
              cell: ({ row }) => {
                return (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  />
                )
              },
            }),
          ]
        : []),
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
      ...(showStockLevels
        ? [
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
          ]
        : []),
      ...(canUpdate || canDelete
        ? [
            columnHelper.display({
              id: "actions",
              cell: ({ row }) => (
                <InventoryActions
                  item={row.original}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              ),
            }),
          ]
        : []),
    ],
    [t, showSelectColumn, showStockLevels, canUpdate, canDelete]
  )
}
