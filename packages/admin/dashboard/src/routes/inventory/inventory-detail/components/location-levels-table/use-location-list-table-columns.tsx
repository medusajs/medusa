import { AdminInventoryLevel } from "@medusajs/types"
import { PencilSquare, Trash } from "@medusajs/icons"

import { useMemo } from "react"
import { createDataTableColumnHelper, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import {
  inventoryItemLevelsQueryKeys,
  inventoryItemsQueryKeys,
} from "../../../../../hooks/api"
import { sdk } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/query-client"
import { useNavigate } from "react-router-dom"

const columnHelper = createDataTableColumnHelper<AdminInventoryLevel>()

export const useLocationListTableColumns = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const prompt = usePrompt()

  const handleDelete = async (level: AdminInventoryLevel) => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("inventory.deleteWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await sdk.admin.inventoryItem.deleteLevel(
        level.inventory_item_id,
        level.location_id
      )

      toast.success(t("inventory.levelDeleted"))

      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.list({
          inventoryItemId: level.inventory_item_id,
        }),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.detail(level.inventory_item_id),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemLevelsQueryKeys.detail(level.inventory_item_id),
      })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("errorBoundary.defaultTitle"))
    }
  }

  return useMemo(
    () => [
      columnHelper.accessor("stock_locations.0.name" as any, {
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
        enableSorting: true,
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
        enableSorting: true,
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
      columnHelper.action({
        actions: (ctx) => {
          const level = ctx.row.original
          return [
            [
              {
                icon: <PencilSquare />,
                label: t("actions.edit"),

                onClick: () => {
                  navigate(`locations/${level.location_id}`)
                },
              },
            ],
            [
              {
                icon: <Trash />,
                label: t("actions.delete"),
                onClick: () => handleDelete(level),
                disabled:
                  level.reserved_quantity > 0 || level.stocked_quantity > 0,
              },
            ],
          ]
        },
      }),
    ],
    [t]
  )
}
