import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { createDataGridHelper } from "../../../../components/data-grid"
import { DataGridReadOnlyCell } from "../../../../components/data-grid/components"
import { DataGridTogglableNumberCell } from "../../../../components/data-grid/components/data-grid-toggleable-number-cell"
import { InventoryStockSchema } from "../schema"

const helper = createDataGridHelper<
  HttpTypes.AdminInventoryItem,
  InventoryStockSchema
>()

export const useInventoryStockColumns = (
  locations: HttpTypes.AdminStockLocation[] = []
) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      helper.column({
        id: "title",
        name: "Title",
        header: t("fields.title"),
        cell: (context) => {
          const item = context.row.original
          return (
            <DataGridReadOnlyCell context={context} color="normal">
              <span title={item.title || undefined}>{item.title || "-"}</span>
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      helper.column({
        id: "sku",
        name: "SKU",
        header: t("fields.sku"),
        cell: (context) => {
          const item = context.row.original

          return (
            <DataGridReadOnlyCell context={context} color="normal">
              <span title={item.sku || undefined}>{item.sku || "-"}</span>
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      ...locations.map((location) =>
        helper.column({
          id: `location_${location.id}`,
          name: location.name,
          header: location.name,
          field: (context) => {
            const item = context.row.original

            return `inventory_items.${item.id}.locations.${location.id}` as const
          },
          type: "togglable-number",
          cell: (context) => {
            return (
              <DataGridTogglableNumberCell
                context={context}
                disabledToggleTooltip={t(
                  "inventory.stock.disabledToggleTooltip"
                )}
              />
            )
          },
        })
      ),
    ],
    [locations, t]
  )
}
