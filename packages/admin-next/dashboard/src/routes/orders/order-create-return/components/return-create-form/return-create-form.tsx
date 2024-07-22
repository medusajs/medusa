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
import { AdminOrder, InventoryLevelDTO, ReturnDTO } from "@medusajs/types"
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
import {
  useAddReturnItem,
  useAddReturnShipping,
  useCancelReturn,
  useConfirmReturnRequest,
  useDeleteReturnShipping,
  useRemoveReturnItem,
  useUpdateReturnItem,
  useUpdateReturnShipping,
} from "../../../../../hooks/api/returns"
import { currencies } from "../../../../../lib/data/currencies"
import { sdk } from "../../../../../lib/client"

type ReturnCreateFormProps = {
  order: AdminOrder
  activeReturn: ReturnDTO // TODO: AdminReturn
  preview: AdminOrder // TODO
}

let selectedItems: string[] = []

export const ReturnCreateForm = ({
  order,
  preview,
  activeReturn,
}: ReturnCreateFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  /**
   * STATE
   */
  const { setIsOpen } = useStackedModal()
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
  const { mutateAsync: confirmReturnRequest, isPending: isConfirming } =
    useConfirmReturnRequest(activeReturn.id)

  const { mutateAsync: cancelReturnRequest, isPending: isCanceling } =
    useCancelReturn(activeReturn.id)

  const { mutateAsync: addReturnShipping, isPending: isAddingReturnShipping } =
    useAddReturnShipping(activeReturn.id, order.id)

  const {
    mutateAsync: updateReturnShipping,
    isPending: isUpdatingReturnShipping,
  } = useUpdateReturnShipping(activeReturn.id, order.id)

  const {
    mutateAsync: deleteReturnShipping,
    isPending: isDeletingReturnShipping,
  } = useDeleteReturnShipping(activeReturn.id, order.id)

  const { mutateAsync: addReturnItem, isPending: isAddingReturnItem } =
    useAddReturnItem(activeReturn.id, order.id)

  const { mutateAsync: removeReturnItem, isPending: isRemovingReturnItem } =
    useRemoveReturnItem(activeReturn.id, order.id)

  const { mutateAsync: updateReturnItem, isPending: isUpdatingReturnItem } =
    useUpdateReturnItem(activeReturn.id, order.id)

  const isRequestLoading =
    isConfirming ||
    isCanceling ||
    isAddingReturnShipping ||
    isUpdatingReturnShipping ||
    isDeletingReturnShipping ||
    isAddingReturnItem ||
    isRemovingReturnItem ||
    isUpdatingReturnItem

  /**
   * FORM
   */

  const form = useForm<ReturnCreateSchemaType>({
    /**
     * TODO: reason selection once Return reason settings are added
     */
    defaultValues: () => {
      const method = preview.shipping_methods.find(
        (s) => !!s.actions?.find((a) => a.action === "SHIPPING_ADD")
      )

      return Promise.resolve({
        items: preview.items
          .filter((i) => !!i.detail.return_requested_quantity)
          .map((i) => ({
            item_id: i.id,
            quantity: i.detail.return_requested_quantity,
            note: i.actions?.find((a) => a.action === "RETURN_ITEM")
              ?.internal_note,
            reason_id: i.actions?.find((a) => a.action === "RETURN_ITEM")
              ?.details?.reason_id,
          })),
        option_id: method ? method.shipping_option_id : "",
        location_id: "",
        send_notification: false,
      })
    },
    resolver: zodResolver(ReturnCreateSchema),
  })

  const itemsMap = useMemo(
    () => new Map(order.items.map((i) => [i.id, i])),
    [order.items]
  )

  const previewItemsMap = useMemo(
    () => new Map(preview.items.map((i) => [i.id, i])),
    [preview.items]
  )

  const {
    fields: items,
    append,
    remove,
    update,
  } = useFieldArray({
    name: "items",
    control: form.control,
  })

  useEffect(() => {
    const existingItemsMap = {}

    preview.items.forEach((i) => {
      const ind = items.findIndex((field) => field.item_id === i.id)

      /**
       * THESE ITEMS ARE REMOVED FROM RETURN REQUEST
       */
      if (!i.detail.return_requested_quantity) {
        return
      }

      existingItemsMap[i.id] = true

      if (ind > -1) {
        if (items[ind].quantity !== i.detail.return_requested_quantity) {
          const returnItemAction = i.actions?.find(
            (a) => a.action === "RETURN_ITEM"
          )

          update(ind, {
            ...items[ind],
            quantity: i.detail.return_requested_quantity,
            note: returnItemAction?.internal_note,
            reason_id: returnItemAction?.details?.reason_id,
          })
        }
      } else {
        append({ item_id: i.id, quantity: i.detail.return_requested_quantity })
      }
    })

    items.forEach((i, ind) => {
      if (!(i.item_id in existingItemsMap)) {
        remove(ind)
      }
    })
  }, [preview.items])

  useEffect(() => {
    const method = preview.shipping_methods.find(
      (s) => !!s.actions?.find((a) => a.action === "SHIPPING_ADD")
    )

    if (method) {
      form.setValue("option_id", method.shipping_option_id)
    }
  }, [preview.shipping_methods])

  const showPlaceholder = !items.length
  const locationId = form.watch("location_id")
  const shippingOptionId = form.watch("option_id")

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await confirmReturnRequest({ no_notification: !data.send_notification })

      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  const onItemsSelected = () => {
    addReturnItem({
      items: selectedItems.map((id) => ({
        id,
        quantity: 1,
      })),
    })

    setIsOpen("items", false)
  }

  const onShippingOptionChange = async (selectedOptionId: string) => {
    const promises = preview.shipping_methods
      .map((s) => s.actions?.find((a) => a.action === "SHIPPING_ADD")?.id)
      .filter(Boolean)
      .map(deleteReturnShipping)

    await Promise.all(promises)

    await addReturnShipping({ shipping_option_id: selectedOptionId })
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

  /**
   * TODO: which difference we show?
   */
  const returnTotal = preview.summary.temporary_difference

  const shippingTotal = preview.shipping_total
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
                previewItem={previewItemsMap.get(item.item_id)!}
                currencyCode={order.currency_code}
                form={form}
                onRemove={() => {
                  const actionId = preview.items
                    .find((i) => i.id === item.item_id)
                    ?.actions.find((a) => a.action === "RETURN_ITEM")?.id

                  if (actionId) {
                    removeReturnItem(actionId)
                  }
                }}
                onUpdate={(payload) => {
                  const actionId = preview.items
                    .find((i) => i.id === item.item_id)
                    ?.actions.find((a) => a.action === "RETURN_ITEM")?.id

                  if (actionId) {
                    updateReturnItem({ ...payload, actionId })
                  }
                }}
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
                                onShippingOptionChange(v)
                              }}
                              {...field}
                              options={(shipping_options ?? [])
                                .filter(
                                  (so) =>
                                    (locationId
                                      ? so.service_zone.fulfillment_set!
                                          .location.id === locationId
                                      : true) &&
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
                      onBlur={() => {
                        let actionId

                        preview.shipping_methods.forEach((s) => {
                          if (s.actions) {
                            for (let a of s.actions) {
                              if (a.action === "SHIPPING_ADD") {
                                actionId = a.id
                              }
                            }
                          }
                        })

                        if (actionId) {
                          updateReturnShipping({
                            actionId,
                            custom_price:
                              typeof customShippingAmount === "string"
                                ? null
                                : customShippingAmount,
                          })
                        }
                        setIsShippingPriceEdit(false)
                      }}
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
                <Button
                  // onClick={() => cancelReturnRequest()}
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
