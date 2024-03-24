import React, { useEffect, useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import * as z from "zod"
import {
  AdminGetVariantsVariantInventoryRes,
  LineItem,
  Order,
} from "@medusajs/medusa"
import {
  Alert,
  Button,
  CurrencyInput,
  Heading,
  Select,
  Switch,
  Text,
  clx,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useAdminShippingOptions, useAdminStockLocations } from "medusa-react"
import { LevelWithAvailability } from "@medusajs/medusa"
import { PricedVariant } from "@medusajs/client-types"

import { ClaimsItem } from "./claims-item"
import { Form } from "../../../../../components/common/form"

import { medusa } from "../../../../../lib/medusa"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { CreateReturnSchema } from "./schema"
import { SplitView } from "../../../../../components/layout/split-view"
import { VariantTable } from "../../../common/variant-table"

type ReturnsFormProps = {
  form: UseFormReturn<z.infer<typeof CreateReturnSchema>>
  items: LineItem[] // Items selected for return
  addedItems: LineItem[]
  onVariantAdd: (variants: PricedVariant[]) => void
  onVariantRemove: (variantId: string) => void
  order: Order
  onRefundableAmountChange: (amount: number) => void
}

export function ClaimsForm({
  form,
  items,
  addedItems,
  onVariantAdd,
  onVariantRemove,
  order,
  onRefundableAmountChange,
}: ReturnsFormProps) {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)

  const [inventoryMap, setInventoryMap] = useState<
    Record<string, LevelWithAvailability[]>
  >({})

  const { shipping_options = [], isLoading: isShippingOptionsLoading } =
    useAdminShippingOptions({
      region_id: order.region_id,
      is_return: true,
    })

  const noShippingOptions =
    !isShippingOptionsLoading && !shipping_options.length

  const hasAddedItems = !!addedItems.length

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

  const quantity = useWatch({ control: form.control, name: "quantity" })

  /**
   * HOOKS
   */

  const refundable = useMemo(() => {
    const claimItemsRefund = items.reduce((acc, item) => {
      return acc + (item.total / item.quantity) * quantity[item.id]
    }, 0)

    onRefundableAmountChange(claimItemsRefund)

    return claimItemsRefund
  }, [items, quantity])

  /**
   * HANDLERS
   */

  const onVariantsSelect = async (
    variantIds: string[],
    variantsMap: Record<string, PricedVariant>
  ) => {
    onVariantAdd(Object.values(variantsMap))
    setOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  return (
    <SplitView open={open} onOpenChange={handleOpenChange}>
      <SplitView.Content>
        <div className="flex size-full flex-col items-center overflow-auto p-16">
          <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
            <div className="flex flex-col gap-y-1 pb-10">
              <Heading className="text-2xl">{t("general.details")}</Heading>
            </div>
            <Heading className="mb-2 text-base">
              {t("orders.returns.chooseItems")}
            </Heading>
            {items.map((item) => (
              <ClaimsItem
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
                  name="return_shipping"
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

            <div className="flex flex-col pt-8">
              <Heading className="text-base">
                {t("orders.claims.itemsToReplace")}
              </Heading>
              {!hasAddedItems ? (
                <Text size="small" className="text-ui-fg-subtle">
                  {t("orders.claims.addItemsHint")}
                </Text>
              ) : (
                <div className="mt-4" />
              )}
              {addedItems.map((item) => (
                <ClaimsItem
                  key={item.id}
                  item={item}
                  form={form}
                  isAddedItem
                  onVariantRemove={onVariantRemove}
                  currencyCode={order.currency_code}
                />
              ))}
              <div
                className={clx("mt-2 text-right", { "mt-4": hasAddedItems })}
              >
                <Button onClick={() => setOpen(true)} type="button">
                  {t("orders.claims.addItems")}
                </Button>
              </div>
            </div>

            <div className="text-ui-fg-base my-10 flex w-full justify-between border-b border-t border-dashed py-8">
              <Text weight="plus" className="txt-small flex-1">
                {t("orders.returns.refundAmount")}
              </Text>
              <div className="txt-small block flex-1 text-right">
                <MoneyAmountCell
                  align="right"
                  amount={refundable}
                  currencyCode={order.currency_code}
                />
              </div>
            </div>

            <div className="mb-10 flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="enable_custom_refund"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center justify-between">
                        <Form.Label
                          tooltip={
                            hasAddedItems &&
                            t("orders.claims.customRefundDisabledHint")
                          }
                        >
                          {t("orders.returns.customRefund")}
                        </Form.Label>
                        <Form.Control>
                          <Form.Control>
                            <Switch
                              disabled={hasAddedItems}
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

              {!hasAddedItems && form.watch("enable_custom_refund") && (
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
          </div>
        </div>
      </SplitView.Content>
      <SplitView.Drawer>
        <VariantTable onSave={onVariantsSelect} order={order} />
      </SplitView.Drawer>
    </SplitView>
  )
}
