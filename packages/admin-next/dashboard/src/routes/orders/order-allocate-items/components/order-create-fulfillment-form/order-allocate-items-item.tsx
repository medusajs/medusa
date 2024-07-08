import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { OrderLineItemDTO } from "@medusajs/types"
import * as zod from "zod"

import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { Form } from "../../../../../components/common/form"
import { AllocateItemsSchema } from "./constants"

type OrderEditItemProps = {
  item: OrderLineItemDTO
  locationId?: string
  form: UseFormReturn<zod.infer<typeof AllocateItemsSchema>>
}

export function OrderAllocateItemsItem({
  item,
  form,
  locationId,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const variant = item.variant

  const hasInventoryItem = !!variant?.inventory.length

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (!variant || !locationId) {
      return {}
    }

    const { inventory } = variant

    const locationInventory = inventory[0]?.location_levels?.find(
      (inv) => inv.location_id === locationId
    )

    if (!locationInventory) {
      return {}
    }

    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [variant, locationId])

  const minValue = 0
  const maxValue = Math.min(
    getFulfillableQuantity(item),
    availableQuantity || Number.MAX_SAFE_INTEGER
  )

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl ">
      <div className="flex items-center gap-x-3 border-b p-3 text-sm">
        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-x-3">
            <Thumbnail src={item.thumbnail} />
            <div className="flex flex-col">
              <div>
                <Text className="txt-small" as="span" weight="plus">
                  {item.variant.product.title}
                </Text>
                {item.variant.sku && (
                  <span className="text-ui-fg-subtle">
                    {" "}
                    ({item.variant.sku})
                  </span>
                )}
              </div>
              <Text as="div" className="text-ui-fg-subtle txt-small">
                {item.title}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-x-3">
          <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

          <div className="txt-small flex flex-col">
            <span className="text-ui-fg-subtle font-medium">
              {t("labels.available")}
            </span>
            <span className="text-ui-fg-muted">{availableQuantity || "-"}</span>
          </div>

          <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

          <div className="txt-small flex flex-col">
            <span className="text-ui-fg-subtle font-medium">
              {t("labels.inStock")}
            </span>
            <span className="text-ui-fg-muted">{inStockQuantity || "-"}</span>
          </div>

          <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

          <div className="text-ui-fg-subtle txt-small mr-2 flex flex-row items-center gap-2">
            <Form.Field
              control={form.control}
              name={`quantity.${item.id}`}
              rules={{ required: true, min: minValue, max: maxValue }}
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        className="bg-ui-bg-base txt-small w-[46px] rounded-lg text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        type="number"
                        {...field}
                        disabled={!locationId}
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)

                          field.onChange(val)

                          if (!isNaN(val)) {
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
                    {/*<Form.ErrorMessage />*/}
                  </Form.Item>
                )
              }}
            />{" "}
            / {availableQuantity} {t("fields.qty")}
          </div>
        </div>
      </div>
    </div>
  )
}
