import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Trash } from "@medusajs/icons"
import * as zod from "zod"

import { LineItem } from "@medusajs/medusa"
import { Input, Text } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"

import { CreateFulfillmentSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { ActionMenu } from "../../../../../components/common/action-menu"

type OrderEditItemProps = {
  item: LineItem
  currencyCode: string
  locationId?: string
  onItemRemove: (itemId: string) => void
  form: UseFormReturn<zod.infer<typeof CreateFulfillmentSchema>>
}

export function OrderCreateFulfillmentItem({
  item,
  currencyCode,
  form,
  locationId,
  onItemRemove,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  /**
   * TODO: Fetch inventory and stock location levels for the variant
   */

  const { variant } = {} // useAdminVariantsInventory(item.variant_id as string)

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
      <div className="flex gap-x-2 border-b p-3 text-sm">
        <div className="flex flex-grow items-center gap-x-3">
          <Thumbnail src={item.thumbnail} />
          <div className="flex flex-col">
            <div>
              <Text className="txt-small" as="span" weight="plus">
                {item.title}
              </Text>
              {item.variant.sku && <span>({item.variant.sku})</span>}
            </div>
            <Text as="div" className="text-ui-fg-subtle txt-small">
              {item.variant.title}
            </Text>
          </div>
        </div>

        <div className="text-ui-fg-subtle txt-small mr-2 flex flex-shrink-0 flex-col items-center">
          <MoneyAmountCell
            className="justify-end"
            currencyCode={currencyCode}
            amount={item.total}
          />
          {hasInventoryItem && (
            <span>
              {t("orders.fulfillment.available")}: {availableQuantity || "N/A"}{" "}
              · {t("orders.fulfillment.inStock")}: {inStockQuantity || "N/A"}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.remove"),
                    icon: <Trash />,
                    onClick: () => onItemRemove(item.id),
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="block p-3 text-sm">
        <div className="flex-1">
          <Text weight="plus" className="txt-small mb-2">
            {t("fields.quantity")}
          </Text>
          <Form.Field
            control={form.control}
            name={`quantity.${item.id}`}
            rules={{ required: true, min: minValue, max: maxValue }}
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Control>
                    <Input
                      className="bg-ui-bg-base txt-small w-full rounded-lg"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? null : Number(e.target.value)

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
        </div>
      </div>
    </div>
  )
}
