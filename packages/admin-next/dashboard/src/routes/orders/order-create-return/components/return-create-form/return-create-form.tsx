import React, { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Alert,
  Button,
  CurrencyInput,
  Heading,
  IconButton,
  Switch,
  Text,
  toast,
} from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  AdminOrder,
  AdminOrderLineItem,
  InventoryLevelDTO,
  ReturnDTO,
} from "@medusajs/types"
import { PencilSquare } from "@medusajs/icons"

import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"

import { ReturnCreateSchema, ReturnCreateSchemaType } from "./schema"
import { AddReturnItemsTable } from "../add-return-items-table"
import { Form } from "../../../../../components/common/form"
import { ReturnItem } from "./return-item"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { useShippingOptions } from "../../../../../hooks/api/shipping-options"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { useAddReturnItem } from "../../../../../hooks/api/returns"
import { currencies } from "../../../../../lib/data/currencies"
import { sdk } from "../../../../../lib/client"

type ReturnCreateFormProps = {
  order: AdminOrder
  activeReturn: ReturnDTO // TODO: AdminReturn
  preview: any // TODO
}

let selectedItems: string[] = []

export const ReturnCreateForm = ({
  order,
  activeReturn,
}: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  /**
   * STATE
   */
  const { setIsOpen } = useStackedModal()
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [isShippingPriceEdit, setIsShippingPriceEdit] = useState(false)
  const [customShippingAmount, setCustomShippingAmount] = useState(0)
  const [inventoryMap, setInventoryMap] = useState<
    Record<string, InventoryLevelDTO[]>
  >({})

  /**
   * HOOKS
   */
  const { stock_locations = [] } = useStockLocations({ limit: 999 })
  const { shipping_options = [] } = useShippingOptions({
    limit: 999,
    fields: "*prices,+service_zone.fulfillment_set.location.id",
    /**
     * TODO: this should accept filter for location_id
     */
  })

  /**
   * MUTATIONS
   */
  const { mutateAsync: confirmReturnRequest } = {} // useAConfirmReturnRequest()
  const { mutateAsync: addReturnItem } = useAddReturnItem(activeReturn.id)
  // TODO: update return item
  // TODO: remove return item

  /**
   * FORM
   */

  const form = useForm<ReturnCreateSchemaType>({
    /**
     * TODO: reason selection once Return reason settings are added
     */
    defaultValues: {
      items: [],
      option_id: "",
      location_id: "",
      send_notification: false,
    },
    resolver: zodResolver(ReturnCreateSchema),
  })

  const itemsMap = useMemo(
    () => new Map(order.items.map((i) => [i.id, i])),
    [order.items]
  )

  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    name: "items",
    control: form.control,
  })

  const showPlaceholder = !items.length
  const locationId = form.watch("location_id")
  const shippingOptionId = form.watch("option_id")

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await confirmReturnRequest({
        order_id: order.id,
        location_id: data.location_id,
        return_shipping: {
          option_id: data.option_id,
          price: customShippingAmount, // TODO: conditionally send this
        },
        internal_note: data.note,
        items: data.items.map((i) => ({
          id: i.item_id,
          quantity: i.quantity,
          reason_id: i.reason_id || null,
        })),
      })

      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  const onItemsSelected = () => {
    const selected = Object.fromEntries(selectedItems.map((i) => [i, true]))

    const toRemove = []
    const existingItems = {}
    items.forEach((item, ind) => {
      if (!(item.id in selected)) {
        toRemove.push(ind)
      }

      existingItems[item.id]
    })

    remove(toRemove)

    selectedItems.forEach((id) => {
      if (!(id in existingItems)) {
        append({ item_id: id, quantity: 1 })
      }
    })

    // TODO: uncomment
    // addReturnItem(selectedItems)

    setIsOpen("items", false)
  }

  useEffect(() => {
    if (isShippingPriceEdit) {
      document.getElementById("js-shipping-input").focus()
    }
  }, [isShippingPriceEdit])

  const showLevelsWarning = useMemo(() => {
    if (!locationId) {
      return false
    }

    const allItemsHaveLocation = items
      .map((_i) => {
        const item = itemsMap.get(_i.item_id)
        if (!item?.variant_id) {
          return true
        }

        if (!item.variant.manage_inventory) {
          return true
        }

        return inventoryMap[item.variant_id]?.find(
          (l) => l.location_id === locationId
        )
      })
      .every(Boolean)

    return !allItemsHaveLocation
  }, [items, inventoryMap, locationId])

  useEffect(() => {
    const getInventoryMap = async () => {
      const ret: Record<string, InventoryLevelDTO[]> = {}

      if (!items.length) {
        return ret
      }

      ;(
        await Promise.all(
          items.map(async (_i) => {
            const item = itemsMap.get(_i.item_id)

            if (!item.variant_id) {
              return undefined
            }
            return await sdk.admin.product.retrieveVariant(
              item.variant.product.id,
              item.variant_id,
              { fields: "*inventory,*inventory.location_levels" }
            )
          })
        )
      )
        .filter((it) => it?.variant)
        .forEach((item) => {
          const { variant } = item
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

  const returnTotal = useMemo(() => {
    return items
      .map((i) => itemsMap.get(i.item_id))
      .reduce((acc: number, curr: AdminOrderLineItem, index): number => {
        return acc + items[index].quantity * curr.refundable_total_per_unit
      }, 0)
  }, [items])

  const shippingTotal = useMemo(() => {
    /**
     * TODO: we should infer shipping price from shipping option but for now we use a value that the user provides
     */
    return typeof customShippingAmount === "number" ? customShippingAmount : 0
  }, [items, customShippingAmount])

  const refundAmount = returnTotal - shippingTotal

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.returns.create")}</Heading>
            <div className="mt-8 flex items-center justify-between">
              <Heading level="h2">{t("orders.returns.inbound")}</Heading>
              <StackedFocusModal id="items">
                <StackedFocusModal.Trigger asChild>
                  <a className="focus-visible:shadow-borders-focus transition-fg txt-compact-small-plus cursor-pointer text-blue-500 outline-none hover:text-blue-400">
                    {t("actions.addItems")}
                  </a>
                </StackedFocusModal.Trigger>
                <StackedFocusModal.Content>
                  <StackedFocusModal.Header />

                  <AddReturnItemsTable
                    items={order.items!}
                    selectedItems={items.map((i) => i.item_id)}
                    currencyCode={order.currency_code}
                    onSelectionChange={(s) => (selectedItems = s)}
                  />
                  <StackedFocusModal.Footer>
                    <div className="flex w-full items-center justify-end gap-x-4">
                      <div className="flex items-center justify-end gap-x-2">
                        <RouteFocusModal.Close
                          asChild
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Button
                            role="button"
                            variant="secondary"
                            size="small"
                          >
                            {t("actions.cancel")}
                          </Button>
                        </RouteFocusModal.Close>
                        <Button
                          key="submit-button"
                          type="submit"
                          variant="primary"
                          size="small"
                          role="button"
                          onClick={() => onItemsSelected()}
                        >
                          {t("actions.save")}
                        </Button>
                      </div>
                    </div>
                  </StackedFocusModal.Footer>
                </StackedFocusModal.Content>
              </StackedFocusModal>
            </div>
            {showPlaceholder && (
              <div
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
                }}
                className="bg-ui-bg-field mt-4 block h-[56px] w-full rounded-lg border border-dashed"
              />
            )}
            {items.map((item, index) => (
              <ReturnItem
                key={item.id}
                item={itemsMap.get(item.item_id)!}
                currencyCode={order.currency_code}
                form={form}
                index={index}
              />
            ))}
            {!showPlaceholder && (
              <div className="mt-8 flex flex-col gap-y-4">
                {/*LOCATION*/}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <Form.Label>{t("orders.returns.location")}</Form.Label>
                    <Form.Hint className="!mt-1">
                      {t("orders.returns.locationHint")}
                    </Form.Hint>
                  </div>

                  <Form.Field
                    control={form.control}
                    name="location_id"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Combobox
                              value={value}
                              onChange={(v) => {
                                onChange(v)
                              }}
                              {...field}
                              options={(stock_locations ?? []).map(
                                (stockLocation) => ({
                                  label: stockLocation.name,
                                  value: stockLocation.id,
                                })
                              )}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                {/*INBOUND SHIPPING*/}
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <Form.Label>
                      {t("orders.returns.inboundShipping")}
                    </Form.Label>
                    <Form.Hint className="!mt-1">
                      {t("orders.returns.inboundShippingHint")}
                    </Form.Hint>
                  </div>

                  {/*TODO: WHAT IF THE RETURN OPTION HAS COMPUTED PRICE*/}
                  <Form.Field
                    control={form.control}
                    name="option_id"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Combobox
                              value={value}
                              onChange={(v) => {
                                onChange(v)
                              }}
                              {...field}
                              options={(shipping_options ?? [])
                                .filter(
                                  (so) =>
                                    so.service_zone.fulfillment_set!.location
                                      .id === locationId &&
                                    !!so.rules.find(
                                      (r) =>
                                        r.attribute === "is_return" &&
                                        r.value === "true"
                                    )
                                )
                                .map((so) => ({
                                  label: so.name,
                                  value: so.id,
                                }))}
                              disabled={!locationId}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            )}

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

            {/*TOTALS SECTION*/}
            <div className="mt-8 border-y border-dotted py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.returnTotal")}
                </span>
                <span className="txt-small text-ui-fg-subtle">
                  {getStylizedAmount(
                    returnTotal ? -1 * returnTotal : returnTotal,
                    order.currency_code
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="txt-small text-ui-fg-subtle">
                  {t("orders.returns.inboundShipping")}
                </span>
                <span className="txt-small text-ui-fg-subtle flex items-center">
                  {!isShippingPriceEdit && (
                    <IconButton
                      onClick={() => setIsShippingPriceEdit(true)}
                      variant="transparent"
                      className="text-ui-fg-muted"
                      disabled={showPlaceholder || !shippingOptionId}
                    >
                      <PencilSquare />
                    </IconButton>
                  )}
                  {isShippingPriceEdit ? (
                    <CurrencyInput
                      id="js-shipping-input"
                      onBlur={() => setIsShippingPriceEdit(false)}
                      symbol={
                        currencies[order.currency_code.toUpperCase()]
                          .symbol_native
                      }
                      code={order.currency_code}
                      onValueChange={(value) =>
                        setCustomShippingAmount(value ? parseInt(value) : "")
                      }
                      value={customShippingAmount}
                      disabled={showPlaceholder}
                    />
                  ) : (
                    getStylizedAmount(shippingTotal, order.currency_code)
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dotted pt-4">
                <span className="txt-small font-medium">
                  {t("orders.returns.refundAmount")}
                </span>
                <span className="txt-small font-medium">
                  {getStylizedAmount(
                    refundAmount ? -1 * refundAmount : refundAmount,
                    order.currency_code
                  )}
                </span>
              </div>
            </div>

            {/*SEND NOTIFICATION*/}
            <div className="bg-ui-bg-field mt-8 rounded-lg border py-2 pl-2 pr-4">
              <Form.Field
                control={form.control}
                name="send_notification"
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <Form.Item>
                      <div className="flex items-center">
                        <Form.Control className="mr-4 self-start">
                          <Switch
                            className="mt-[2px]"
                            checked={!!value}
                            onCheckedChange={onChange}
                            {...field}
                          />
                        </Form.Control>
                        <div className="block">
                          <Form.Label>
                            {t("orders.returns.sendNotification")}
                          </Form.Label>
                          <Form.Hint className="!mt-1">
                            {t("orders.returns.sendNotificationHint")}
                          </Form.Hint>
                        </div>
                      </div>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex w-full items-center justify-end gap-x-4">
            <div className="flex items-center justify-end gap-x-2">
              <RouteFocusModal.Close asChild>
                <Button variant="secondary" size="small">
                  {t("actions.cancel")}
                </Button>
              </RouteFocusModal.Close>
              <Button
                key="submit-button"
                type="submit"
                variant="primary"
                size="small"
                isLoading={isRequestLoading}
              >
                {t("actions.save")}
              </Button>
            </div>
          </div>
        </RouteFocusModal.Footer>
      </form>
    </RouteFocusModal.Form>
  )
}
