import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { clx, Input, Text, Tooltip } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { HttpTypes } from "@medusajs/types"

import { Form } from "../../../../../components/common/form/index"
import { Thumbnail } from "../../../../../components/common/thumbnail/index"
import { useProductVariant } from "../../../../../hooks/api/products"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { CreateFulfillmentSchema } from "./constants"
import { InformationCircleSolid } from "@medusajs/icons"
import { ExtendedVariant } from "../../../../product-variants/product-variant-detail/constants"

type OrderEditItemProps = {
  item: HttpTypes.AdminOrderLineItem
  currencyCode?: string
  locationId?: string
  onItemRemove?: (itemId: string) => void
  reservations: HttpTypes.AdminReservation[]
  form: UseFormReturn<zod.infer<typeof CreateFulfillmentSchema>>
  disabled: boolean
}

export function OrderCreateFulfillmentItem({
  item,
  form,
  locationId,
  reservations,
  disabled,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const { variant } = useProductVariant(
    item.product_id ?? "",
    item.variant_id ?? "",
    {
      fields: "*inventory,*inventory.location_levels,*inventory_items",
    },
    {
      enabled: !!item.variant,
    }
  ) as { variant: ExtendedVariant }

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (
      !variant?.inventory_items?.length ||
      !variant?.inventory?.length ||
      !locationId
    ) {
      return {}
    }

    const { inventory, inventory_items } = variant

    const locationHasEveryInventoryItem = inventory.every((i) =>
      i.location_levels?.find((inv) => inv.location_id === locationId)
    )

    if (!locationHasEveryInventoryItem) {
      return {}
    }

    const inventoryItemRequiredQuantityMap = new Map(
      inventory_items.map((i) => [i.inventory_item_id, i.required_quantity])
    )

    // since we don't allow split fulifllments only one reservation from inventory kit is enough to calculate avalabel product quantity
    const reservation = reservations?.find((r) => r.line_item_id === item.id)
    const iitemRequiredQuantity = inventory_items.find(
      (i) => i.inventory_item_id === reservation?.inventory_item_id
    )?.required_quantity

    const reservedQuantityForItem = !reservation
      ? 0
      : reservation?.quantity / (iitemRequiredQuantity || 1)

    const locationInventoryLevels = inventory.map((i) => {
      const level = i.location_levels?.find(
        (inv) => inv.location_id === locationId
      )

      const requiredQuantity = inventoryItemRequiredQuantityMap.get(i.id)

      if (!level || !requiredQuantity) {
        return {
          availableQuantity: Number.MAX_SAFE_INTEGER,
          stockedQuantity: Number.MAX_SAFE_INTEGER,
        }
      }

      const availableQuantity =
        (level.available_quantity ?? 0) / requiredQuantity
      const stockedQuantity = level.stocked_quantity / requiredQuantity

      return {
        availableQuantity,
        stockedQuantity,
      }
    })

    const maxAvailableQuantity = Math.min(
      ...locationInventoryLevels.map((i) => i.availableQuantity)
    )

    const maxStockedQuantity = Math.min(
      ...locationInventoryLevels.map((i) => i.stockedQuantity)
    )

    if (
      maxAvailableQuantity === Number.MAX_SAFE_INTEGER ||
      maxStockedQuantity === Number.MAX_SAFE_INTEGER
    ) {
      return {}
    }

    return {
      availableQuantity: Math.floor(
        maxAvailableQuantity + reservedQuantityForItem
      ),
      inStockQuantity: Math.floor(maxStockedQuantity),
    }
  }, [variant, locationId, reservations])

  const minValue = 0
  const maxValue = Math.min(
    getFulfillableQuantity(item),
    availableQuantity || Number.MAX_SAFE_INTEGER
  )

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl">
      <div className="flex flex-row items-center">
        {disabled && (
          <div className="ml-4 inline-flex items-center">
            <Tooltip
              content={t("orders.fulfillment.disabledItemTooltip")}
              side="top"
            >
              <InformationCircleSolid className="text-ui-tag-orange-icon" />
            </Tooltip>
          </div>
        )}

        <div
          className={clx(
            "flex flex-1 flex-col gap-x-2 gap-y-2 border-b p-3 text-sm sm:flex-row",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          <div className="flex flex-1 items-center gap-x-3">
            <Thumbnail src={item.thumbnail} />
            <div className="flex flex-col">
              <div>
                <Text className="txt-small" as="span" weight="plus">
                  {item.title}
                </Text>
                {item.variant_sku && <span>({item.variant_sku})</span>}
              </div>
              <Text as="div" className="text-ui-fg-subtle txt-small">
                {item.variant_title}
              </Text>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-x-1">
            <div className="mr-2 block h-[16px] w-[2px] bg-gray-200" />

            <div className="text-small flex flex-1 flex-col">
              <span className="text-ui-fg-subtle font-medium">
                {t("orders.fulfillment.available")}
              </span>
              <span className="text-ui-fg-subtle">
                {availableQuantity || "N/A"}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-x-1">
              <div className="mr-2 block h-[16px] w-[2px] bg-gray-200" />

              <div className="flex flex-col">
                <span className="text-ui-fg-subtle font-medium">
                  {t("orders.fulfillment.inStock")}
                </span>
                <span className="text-ui-fg-subtle">
                  {inStockQuantity || "N/A"}{" "}
                  {inStockQuantity && (
                    <span className="font-medium text-red-500">
                      -{form.getValues(`quantity.${item.id}`)}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-1">
              <Form.Field
                control={form.control}
                name={`quantity.${item.id}`}
                rules={{ required: true, min: minValue, max: maxValue }}
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <Input
                          className="bg-ui-bg-base txt-small w-[50px] rounded-lg text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const val =
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)

                            field.onChange(val)

                            if (val !== null && !isNaN(val)) {
                              if (val < minValue || val > maxValue) {
                                form.setError(`quantity.${item.id}`, {
                                  type: "manual",
                                  message: t(
                                    "orders.fulfillment.error.wrongQuantity",
                                    {
                                      count: maxValue,
                                      number: maxValue,
                                    }
                                  ),
                                })
                              } else {
                                form.clearErrors(`quantity.${item.id}`)
                              }
                            }
                          }}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <span className="text-ui-fg-subtle">
                / {item.quantity} {t("fields.qty")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
