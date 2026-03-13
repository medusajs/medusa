import { InformationCircle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Switch, Tooltip } from "@medusajs/ui"
import { useCallback, useMemo } from "react"

import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../components/common/thumbnail"
import { createDataGridHelper } from "../../../../components/data-grid"
import { DataGridReadOnlyCell } from "../../../../components/data-grid/components"
import { DataGridDuplicateCell } from "../../../../components/data-grid/components/data-grid-duplicate-cell"
import { DataGridTogglableNumberCell } from "../../../../components/data-grid/components/data-grid-toggleable-number-cell"
import { ProductStockSchema } from "../schema"
import { isProductVariant } from "../utils"

const helper = createDataGridHelper<
  | HttpTypes.AdminProductVariant
  | HttpTypes.AdminProductVariantInventoryItemLink,
  ProductStockSchema
>()

type DisabledItem = { id: string; title: string; sku: string }
type DisabledResult =
  | {
      isDisabled: true
      item: DisabledItem
    }
  | {
      isDisabled: false
      item: undefined
    }

export const useProductStockColumns = (
  locations: HttpTypes.AdminStockLocation[] = [],
  disabled: Record<string, DisabledItem> = {}
) => {
  const { t } = useTranslation()
  const getIsDisabled = useCallback(
    (item: HttpTypes.AdminProductVariantInventoryItemLink): DisabledResult => {
      const disabledItem = disabled[item.inventory_item_id]
      const isDisabled = !!disabledItem && disabledItem.id !== item.variant_id

      if (!isDisabled) {
        return {
          isDisabled: false,
          item: undefined,
        }
      }

      return {
        isDisabled,
        item: disabledItem,
      }
    },
    [disabled]
  )

  return useMemo(
    () => [
      helper.column({
        id: "title",
        name: "Title",
        header: t("fields.title"),
        cell: (context) => {
          const item = context.row.original

          if (isProductVariant(item)) {
            return (
              <DataGridReadOnlyCell context={context}>
                <div className="flex items-center gap-x-2">
                  <Thumbnail size="small" src={item.product?.thumbnail} />
                  <span>{item.title || "-"}</span>
                </div>
              </DataGridReadOnlyCell>
            )
          }

          const { isDisabled, item: disabledItem } = getIsDisabled(item)

          if (isDisabled) {
            return (
              <DataGridReadOnlyCell context={context} color="normal">
                <div className="flex size-full items-center justify-between gap-x-2">
                  <span
                    title={item.inventory?.title || undefined}
                    className="text-ui-fg-disabled"
                  >
                    {item.inventory?.title || "-"}
                  </span>
                  <Tooltip
                    content={
                      disabledItem.sku
                        ? t("products.stock.tooltips.alreadyManagedWithSku", {
                            title: disabledItem.title,
                            sku: disabledItem.sku,
                          })
                        : t("products.stock.tooltips.alreadyManaged", {
                            title: disabledItem.title,
                          })
                    }
                  >
                    <InformationCircle />
                  </Tooltip>
                </div>
              </DataGridReadOnlyCell>
            )
          }

          return (
            <DataGridReadOnlyCell context={context} color="normal">
              {item.inventory?.title || "-"}
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

          if (isProductVariant(item)) {
            return (
              <DataGridReadOnlyCell context={context}>
                {item.sku || "-"}
              </DataGridReadOnlyCell>
            )
          }

          const { isDisabled } = getIsDisabled(item)

          if (isDisabled) {
            return (
              <DataGridReadOnlyCell context={context} color="normal">
                <span className="text-ui-fg-disabled">
                  {item.inventory?.sku || "-"}
                </span>
              </DataGridReadOnlyCell>
            )
          }

          return (
            <DataGridReadOnlyCell context={context} color="normal">
              {item.inventory?.sku || "-"}
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

            if (isProductVariant(item)) {
              return null
            }

            const { isDisabled } = getIsDisabled(item)

            if (isDisabled) {
              return null
            }

            return `variants.${item.variant_id}.inventory_items.${item.inventory_item_id}.locations.${location.id}` as const
          },
          type: "togglable-number",
          cell: (context) => {
            const item = context.row.original

            if (isProductVariant(item)) {
              return <DataGridReadOnlyCell context={context} />
            }

            const { isDisabled, item: disabledItem } = getIsDisabled(item)

            if (isDisabled) {
              return (
                <DataGridDuplicateCell
                  duplicateOf={`variants.${disabledItem.id}.inventory_items.${item.inventory_item_id}.locations.${location.id}`}
                >
                  {({ value }) => {
                    const { checked, quantity } = value as {
                      checked: boolean
                      quantity: number | string
                    }

                    return (
                      <div className="flex size-full items-center gap-x-2">
                        <Switch
                          dir="ltr"
                          className="shrink-0 cursor-not-allowed rtl:rotate-180"
                          tabIndex={-1}
                          size="small"
                          checked={checked}
                          disabled
                        />
                        <span className="text-ui-fg-disabled flex size-full items-center justify-end">
                          {quantity}
                        </span>
                      </div>
                    )
                  }}
                </DataGridDuplicateCell>
              )
            }

            return (
              <DataGridTogglableNumberCell
                context={context}
                disabledToggleTooltip={t(
                  "inventory.stock.disabledToggleTooltip"
                )}
                placeholder={t("inventory.stock.placeholder")}
              />
            )
          },
        })
      ),
    ],
    [locations, getIsDisabled, t]
  )
}
