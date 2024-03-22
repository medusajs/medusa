import {
  AdminGetVariantsVariantInventoryRes,
  LevelWithAvailability,
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
import { useAdminShippingOptions, useAdminStockLocations } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { Control, UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"

import { Form } from "../../../../../../components/common/form"
import { ReturnItem } from "./return-item"

import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { MoneyAmountCell } from "../../../../../../components/table/table-cells/common/money-amount-cell"
import { castNumber } from "../../../../../../lib/cast-number"
import { getCurrencySymbol } from "../../../../../../lib/currencies"
import { medusa } from "../../../../../../lib/medusa"
import { getDbAmount } from "../../../../../../lib/money-amount-helpers"
import { CreateReturnSchema } from "../constants"

type OrderCreateReturnDetailsProps = {
  form: UseFormReturn<z.infer<typeof CreateReturnSchema>>
  items: LineItem[] // Items selected for return
  order: Order
  onRefundableAmountChange: (amount: number) => void
}

export function OrderCreateReturnDetails({
  form,
  items,
  order,
  onRefundableAmountChange,
}: OrderCreateReturnDetailsProps) {
  const { t } = useTranslation()

  const { currency_code } = order
  const { setValue } = form

  const [inventoryMap, setInventoryMap] = useState<
    Record<string, LevelWithAvailability[]>
  >({})

  const {
    customShippingPrice,
    enableCustomRefund,
    enableCustomShippingPrice,
    quantity,
    shipping,
    selectedLocation,
  } = useWatchFields(form.control)

  const { shipping_options = [], isLoading: isShippingOptionsLoading } =
    useAdminShippingOptions({
      region_id: order.region_id,
      is_return: true,
    })

  const noShippingOptions =
    !isShippingOptionsLoading && !shipping_options.length

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
          const levels = variant.inventory[0]?.location_levels

          if (!levels) {
            return
          }

          ret[variant.id] = levels
        })

      return ret
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [items])

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

  const shippingPrice = useMemo(() => {
    if (enableCustomShippingPrice && customShippingPrice) {
      const amount =
        customShippingPrice === "" ? 0 : castNumber(customShippingPrice)

      return getDbAmount(amount, currency_code)
    }

    const method = shipping_options?.find((o) => shipping === o.id) as
      | PricedShippingOption
      | undefined

    return method?.price_incl_tax || 0
  }, [
    shipping,
    customShippingPrice,
    enableCustomShippingPrice,
    shipping_options,
    currency_code,
  ])

  const refundable = useMemo(() => {
    const itemTotal = items.reduce((acc: number, curr: LineItem): number => {
      const unitRefundable =
        (curr.refundable || 0) / (curr.quantity - (curr.returned_quantity || 0))

      return acc + unitRefundable * quantity[curr.id]
    }, 0)

    const amount = itemTotal - (shippingPrice || 0)
    onRefundableAmountChange(amount)

    return amount
  }, [items, onRefundableAmountChange, quantity, shippingPrice])

  useEffect(() => {
    setValue("enable_custom_shipping_price", false, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setValue("custom_shipping_price", 0, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [enableCustomRefund, setValue])

  return (
    <div className="flex size-full flex-col items-center overflow-auto p-16">
      <div className="flex w-full max-w-[720px] flex-col justify-center px-2 pb-2">
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
            <Form.Field
              control={form.control}
              name="location"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label> {t("fields.location")}</Form.Label>
                    <Form.Hint>
                      {t("orders.returns.locationDescription")}
                    </Form.Hint>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="bg-ui-bg-base" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {stock_locations.map((l) => (
                            <Select.Item key={l.id} value={l.id}>
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
            <Form.Field
              control={form.control}
              name="shipping"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label
                      tooltip={
                        noShippingOptions
                          ? t("orders.returns.noShippingOptions")
                          : undefined
                      }
                    >
                      {t("fields.shipping")}
                    </Form.Label>
                    <Form.Hint>
                      {t("orders.returns.shippingDescription")}
                    </Form.Hint>
                    <Form.Control>
                      <Select
                        onValueChange={onChange}
                        {...field}
                        disabled={noShippingOptions}
                      >
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
          <div className="txt-small block flex-1 text-right">
            {form.watch("enable_custom_refund") ? (
              <span className="text-right">-</span>
            ) : (
              <MoneyAmountCell
                align="right"
                amount={refundable}
                currencyCode={order.currency_code}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <Form.Field
            control={form.control}
            name="send_notification"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>
                      {t("orders.returns.sendNotification")}
                    </Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          checked={!!value}
                          onCheckedChange={onChange}
                          {...field}
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
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label>{t("orders.returns.customRefund")}</Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          checked={!!value}
                          onCheckedChange={onChange}
                          {...field}
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

          {enableCustomRefund && (
            <div className="w-[50%] pr-2">
              <Form.Field
                control={form.control}
                name="custom_refund"
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
              let tooltip = undefined

              if (enableCustomRefund) {
                tooltip = t("orders.returns.shippingPriceTooltip1")
              } else if (!shipping) {
                tooltip = t("orders.returns.shippingPriceTooltip2")
              }

              return (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label tooltip={tooltip}>
                      {t("orders.returns.customShippingPrice")}
                    </Form.Label>
                    <Form.Control>
                      <Form.Control>
                        <Switch
                          disabled={
                            form.watch("enable_custom_refund") ||
                            !form.watch("shipping")
                          }
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

          {enableCustomShippingPrice && (
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

const useWatchFields = (
  control: Control<z.infer<typeof CreateReturnSchema>>
) => {
  const enableCustomShippingPrice = useWatch({
    control: control,
    name: "enable_custom_shipping_price",
  })

  const enableCustomRefund = useWatch({
    control: control,
    name: "enable_custom_refund",
  })

  const quantity = useWatch({
    control: control,
    name: "quantity",
  })

  const shipping = useWatch({
    control: control,
    name: "shipping",
  })

  const customShippingPrice = useWatch({
    control: control,
    name: "custom_shipping_price",
  })

  const selectedLocation = useWatch({
    control: control,
    name: "location",
  })

  return {
    enableCustomShippingPrice,
    enableCustomRefund,
    quantity,
    shipping,
    customShippingPrice,
    selectedLocation,
  }
}
