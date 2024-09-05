import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { HttpTypes } from "@medusajs/types"

import { Form } from "../../../../../components/common/form/index"
import { Thumbnail } from "../../../../../components/common/thumbnail/index"
import { useProductVariant } from "../../../../../hooks/api/products"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { CreateFulfillmentSchema } from "./constants"

type OrderEditItemProps = {
  item: HttpTypes.AdminOrderLineItem
  currencyCode: string
  locationId?: string
  onItemRemove: (itemId: string) => void
  form: UseFormReturn<zod.infer<typeof CreateFulfillmentSchema>>
}

export function OrderCreateFulfillmentItem({
  item,
  form,
  locationId,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const { variant } = useProductVariant(
    item.variant!.product_id!,
    item.variant_id!,
    {
      fields: "*inventory,*inventory.location_levels",
    }
  )

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
      <div className="flex flex-col gap-x-2 gap-y-2 border-b p-3 text-sm sm:flex-row">
        <div className="flex flex-1 items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}
              </Text>
              {item.variant?.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant?.title ?? ""}
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
  )
}
