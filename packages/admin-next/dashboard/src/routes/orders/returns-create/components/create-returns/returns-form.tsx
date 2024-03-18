import React, { useEffect, useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import {
  AdminGetVariantsVariantInventoryRes,
  LineItem,
  Order,
} from "@medusajs/medusa"
import {
  Alert,
  CurrencyInput,
  Heading,
  Select,
  Switch,
  Text,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useAdminShippingOptions, useAdminStockLocations } from "medusa-react"
import { LevelWithAvailability } from "@medusajs/medusa"

import { ReturnItem } from "./return-item"
import { Form } from "../../../../../components/common/form"

import { medusa } from "../../../../../lib/medusa"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { getCurrencySymbol } from "../../../../../lib/currencies.ts"
import { getDbAmount } from "../../../../../lib/money-amount-helpers.ts"

type ReturnsFormProps = {
  form: UseFormReturn<any>
  items: LineItem[] // Items selected for return
  order: Order
}

export function ReturnsForm({ form, items, order }: ReturnsFormProps) {
  const { t } = useTranslation()

  const [inventoryMap, setInventoryMap] = useState<
    Record<string, LevelWithAvailability[]>
  >({})

  const { shipping_options = [] } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: true,
  })

  const { stock_locations = [] } = useAdminStockLocations({})

  useEffect(() => {
    const getInventoryMap = async () => {
      const ret: Record<string, LevelWithAvailability[]> = {}

      if (!items.length) {
        return ret
      }

      ;(
        await Promise.all(
          items.map(async (item) => {
            if (!item.variant_id) {
              return undefined
            }
            return await medusa.admin.variants.getInventory(item.variant_id)
          })
        )
      )
        .filter((it) => it?.variant)
        .forEach((item) => {
          const { variant } = item as AdminGetVariantsVariantInventoryRes
          ret[variant.id] = variant.inventory[0]?.location_levels
        })

      return ret
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })

    items.forEach((i) => {
      form.setValue(`quantity.${i.id}`, i.quantity)
    })
  }, [items])

  const selectedLocation = form.watch("location")

  const showLevelsWarning = useMemo(() => {
    if (!selectedLocation) {
      return false
    }

    const allItemsHaveLocation = items
      .map((item) => {
        if (!item?.variant_id) {
          return true
        }
        return inventoryMap[item.variant_id]?.find(
          (l) => l.location_id === selectedLocation
        )
      })
      .every(Boolean)

    return !allItemsHaveLocation
  }, [items, inventoryMap, selectedLocation])

  const {
    quantity,
    shipping,
    custom_shipping_price,
    enable_custom_shipping_price,
  } = useWatch()

  const shippingPrice = useMemo(() => {
    if (enable_custom_shipping_price && custom_shipping_price) {
      return getDbAmount(custom_shipping_price, order.currency_code)
    }

    const method = shipping_options?.find(
      (o) => form.watch("shipping") === o.id
    )

    return method?.price_incl_tax || 0
  }, [shipping, custom_shipping_price, enable_custom_shipping_price])

  const refundable = useMemo(() => {
    const itemTotal = items.reduce((acc: number, curr: LineItem): number => {
      const unitRefundable =
        (curr.refundable || 0) / (curr.quantity - curr.returned_quantity)

      return acc + unitRefundable * quantity[curr.id]
    }, 0)

    return itemTotal - (shippingPrice || 0)
  }, [items, quantity, shippingPrice])

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
        <div className="flex flex-col gap-y-1 pb-10">
          <Heading className="text-2xl">{t("general.details")}</Heading>
        </div>
        <Heading className="mb-2 text-base">
          {t("orders.returns.chooseItems")}
        </Heading>
        {items.map((item) => (
          <ReturnItem
            key={item.id}
            item={item}
            form={form}
            currencyCode={order.currency_code}
          />
        ))}

        <div className="flex flex-col gap-y-1 pb-4 pt-8">
          <Heading className="text-base">{t("fields.shipping")}</Heading>
        </div>

        <div className="flex gap-x-4">
          <div className="flex-1">
            <Text weight="plus" className="txt-small">
              {t("fields.location")}
            </Text>
            <Text className="text-ui-fg-subtle txt-small mb-1">
              {t("orders.returns.locationDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="location"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {stock_locations.map((l) => (
                            <Select.Item key={l.id} value={l.name}>
                              {l.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
          <div className="flex-1">
            <Text weight="plus" className="txt-small">
              {t("fields.shipping")}
            </Text>
            <Text className="text-ui-fg-subtle txt-small mb-1">
              {t("orders.returns.shippingDescription")}
            </Text>
            <Form.Field
              control={form.control}
              name="shipping"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {shipping_options.map((o) => (
                            <Select.Item key={o.id} value={o.id}>
                              {o.name}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </div>
        {showLevelsWarning && (
          <Alert variant="warning" dismissible className="mt-4 p-5">
            <div className="text-ui-fg-subtle txt-small pb-2 font-medium leading-[20px]">
              {t("orders.returns.noInventoryLevel")}
            </div>
            <Text className="text-ui-fg-subtle txt-small leading-normal">
              {t("orders.returns.noInventoryLevelDesc")}
            </Text>
          </Alert>
        )}

        <div className="text-ui-fg-base my-10 flex w-full justify-between border-b border-t border-dashed py-8">
          <Text weight="plus" className="txt-small flex-1">
            {t("orders.returns.refundAmount")}
          </Text>
          <div className="txt-small block flex-1">
            <MoneyAmountCell
              align="right"
              amount={refundable}
              currencyCode={order.currency_code}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Form.Field
            control={form.control}
            name="send_notification"
            render={({ field }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>
                      {t("orders.returns.sendNotification")}
                    </Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Form.Control>
                    </Form.Control>
                  </div>
                  <Form.Hint className="!mt-1">
                    {t("orders.returns.sendNotificationHint")}
                  </Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>

        <div className="mt-10 flex flex-col gap-y-4">
          <Form.Field
            control={form.control}
            name="enable_custom_refund"
            render={({ field }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>{t("orders.returns.customRefund")}</Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Form.Control>
                    </Form.Control>
                  </div>
                  <Form.Hint className="!mt-1">
                    {t("orders.returns.customRefundHint")}
                  </Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />

          {form.watch("enable_custom_refund") && (
            <div className="w-[50%] pr-2">
              <Form.Field
                control={form.control}
                name="custom_refund"
                rules={{ min: 0, max: order.refundable_amount }}
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <CurrencyInput
                          min={0}
                          max={order.refundable_amount}
                          onValueChange={onChange}
                          code={order.currency_code}
                          symbol={getCurrencySymbol(order.currency_code)}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-y-4">
          <Form.Field
            control={form.control}
            name="enable_custom_shipping_price"
            render={({ field }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>
                      {t("orders.returns.customShippingPrice")}
                    </Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </Form.Control>
                    </Form.Control>
                  </div>
                  <Form.Hint className="!mt-1">
                    {t("orders.returns.customShippingPriceHint")}
                  </Form.Hint>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />

          {form.watch("enable_custom_shipping_price") && (
            <div className="w-[50%] pr-2">
              <Form.Field
                control={form.control}
                name="custom_shipping_price"
                render={({ field: { onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Control>
                        <CurrencyInput
                          min={0}
                          onValueChange={onChange}
                          code={order.currency_code}
                          symbol={getCurrencySymbol(order.currency_code)}
                          {...field}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
