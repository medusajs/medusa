import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { InventoryItemDTO, OrderLineItemDTO } from "@medusajs/types"
import {
  Component,
  ExclamationCircleSolid,
  TriangleDownMini,
} from "@medusajs/icons"
import { UseFormReturn, useWatch } from "react-hook-form"
import { Input, Text, clx } from "@medusajs/ui"
import * as zod from "zod"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { Form } from "../../../../../components/common/form"
import { AllocateItemsSchema } from "./constants"

type OrderEditItemProps = {
  item: OrderLineItemDTO
  locationId?: string
  form: UseFormReturn<zod.infer<typeof AllocateItemsSchema>>
  onQuantityChange: (
    inventoryItem: InventoryItemDTO,
    lineItem: OrderLineItemDTO,
    hasInventoryKit: boolean,
    value: number | null,
    isRoot?: boolean
  ) => {}
}

export function OrderAllocateItemsItem({
  item,
  form,
  locationId,
  onQuantityChange,
}: OrderEditItemProps) {
  const { t } = useTranslation()

  const variant = item.variant
  const inventory = item.variant.inventory

  const [isOpen, setIsOpen] = useState(false)

  const quantityField = useWatch({
    control: form.control,
    name: "quantity",
  })

  const hasInventoryKit =
    !!variant?.inventory_items.length && variant?.inventory_items.length > 1

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

  const hasQuantityError =
    !hasInventoryKit &&
    availableQuantity &&
    quantityField[`${item.id}-${item.variant.inventory[0].id}`] &&
    quantityField[`${item.id}-${item.variant.inventory[0].id}`] >
      availableQuantity

  const minValue = 0
  const maxValue = Math.min(
    getFulfillableQuantity(item),
    availableQuantity || Number.MAX_SAFE_INTEGER
  )

  return (
    <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 min-w-[720px] divide-y divide-dashed rounded-xl">
      <div className="flex items-center gap-x-3 p-3 text-sm">
        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-x-3">
            {hasQuantityError && (
              <ExclamationCircleSolid className="text-ui-fg-error" />
            )}
            <Thumbnail src={item.thumbnail} />
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Text className="txt-small flex" as="span" weight="plus">
                  {item.variant.product.title}
                </Text>
                {item.variant.sku && (
                  <span className="text-ui-fg-subtle">
                    {" "}
                    ({item.variant.sku})
                  </span>
                )}
                {hasInventoryKit && (
                  <Component className="text-ui-fg-muted ml-2 overflow-visible pt-[2px]" />
                )}
              </div>
              <Text as="div" className="text-ui-fg-subtle txt-small">
                {item.title}
              </Text>
            </div>
          </div>
        </div>

        <div
          className={clx(
            "flex flex-1 items-center gap-x-3",
            hasInventoryKit ? "justify-end" : "justify-between"
          )}
        >
          {!hasInventoryKit && (
            <>
              <div className="flex items-center gap-3">
                <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

                <div className="txt-small flex flex-col">
                  <span className="text-ui-fg-subtle font-medium">
                    {t("labels.available")}
                  </span>
                  <span className="text-ui-fg-muted">
                    {availableQuantity || "-"}
                    {availableQuantity &&
                      !hasInventoryKit &&
                      quantityField[
                        `${item.id}-${item.variant.inventory[0].id}`
                      ] && (
                        <span className="text-ui-fg-error txt-small ml-1">
                          -
                          {
                            quantityField[
                              `${item.id}-${item.variant.inventory[0].id}`
                            ]
                          }
                        </span>
                      )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

                <div className="txt-small flex flex-col">
                  <span className="text-ui-fg-subtle font-medium">
                    {t("labels.inStock")}
                  </span>
                  <span className="text-ui-fg-muted">
                    {inStockQuantity || "-"}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

            <div className="text-ui-fg-subtle txt-small mr-2 flex flex-row items-center gap-2">
              <Form.Field
                control={form.control}
                name={
                  hasInventoryKit
                    ? `quantity.${item.id}-`
                    : `quantity.${item.id}-${item.variant.inventory[0].id}`
                }
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

                            onQuantityChange(
                              item.variant.inventory[0],
                              item,
                              hasInventoryKit,
                              val,
                              true
                            )
                          }}
                        />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />{" "}
              / {item.quantity} {t("fields.qty")}
            </div>
          </div>
        </div>
      </div>

      {hasInventoryKit && (
        <div className="px-4 py-2">
          <div
            onClick={() => setIsOpen((o) => !o)}
            className="flex items-center gap-x-2"
          >
            <TriangleDownMini
              style={{ transform: `rotate(${isOpen ? -90 : 0}deg)` }}
              className="text-ui-fg-muted -mt-[1px]"
            />
            <span className="txt-small text-ui-fg-muted cursor-pointer">
              {t("orders.allocateItems.consistsOf", {
                num: inventory.length,
              })}
            </span>
          </div>
        </div>
      )}

      {isOpen &&
        variant.inventory.map((i, ind) => {
          const location = i.location_levels.find(
            (l) => l.location_id === locationId
          )
          return (
            <div key={i.id} className="txt-small flex items-center gap-x-3 p-4">
              <div className="flex flex-1 flex-col">
                <span className="text-ui-fg-subtle">{i.title}</span>
                <span className="text-ui-fg-muted">
                  {t("orders.allocateItems.requires", {
                    num: variant.inventory_items[ind].required_quantity,
                  })}
                </span>
              </div>

              <div className="flex flex-1 flex-row justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

                  <div className="txt-small flex flex-col">
                    <span className="text-ui-fg-subtle font-medium">
                      {t("labels.available")}
                    </span>
                    <span className="text-ui-fg-muted">
                      {location?.available_quantity || "-"}
                      {location?.available_quantity &&
                        quantityField[`${item.id}-${i.id}`] && (
                          <span className="text-ui-fg-error txt-small ml-1">
                            -{quantityField[`${item.id}-${i.id}`]}
                          </span>
                        )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

                  <div className="txt-small flex flex-col">
                    <span className="text-ui-fg-subtle font-medium">
                      {t("labels.inStock")}
                    </span>
                    <span className="text-ui-fg-muted">
                      {location?.stocked_quantity || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-ui-border-strong block h-[12px] w-[1px]" />

                  <div className="text-ui-fg-subtle txt-small mr-1 flex flex-row items-center gap-2">
                    <Form.Field
                      control={form.control}
                      name={`quantity.${item.id}-${i.id}`}
                      rules={{
                        required: true,
                        min: 0,
                        max: location?.available_quantity,
                      }}
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

                                  onQuantityChange(
                                    i,
                                    item,
                                    hasInventoryKit,
                                    val
                                  )
                                }}
                              />
                            </Form.Control>
                          </Form.Item>
                        )
                      }}
                    />
                    /{" "}
                    {item.quantity *
                      variant.inventory_items[ind].required_quantity}{" "}
                    {t("fields.qty")}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
