import { zodResolver } from "@hookform/resolvers/zod"
import { PencilSquare } from "@medusajs/icons"
import {
  AdminClaim,
  AdminOrder,
  AdminOrderPreview,
  InventoryLevelDTO,
} from "@medusajs/types"
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
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  RouteFocusModal,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../../../../../components/modals"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { useShippingOptions } from "../../../../../hooks/api/shipping-options"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { AddClaimItemsTable } from "../add-claim-items-table"
import { ClaimInboundItem } from "./claim-inbound-item.tsx"
import { ClaimCreateSchema, CreateClaimSchemaType } from "./schema"

import {
  useAddClaimInboundItems,
  useAddClaimInboundShipping,
  useCancelClaimRequest,
  useDeleteClaimInboundShipping,
  useRemoveClaimInboundItem,
  useUpdateClaimInboundItem,
  useUpdateClaimInboundShipping,
} from "../../../../../hooks/api/claims"
import { sdk } from "../../../../../lib/client"
import { currencies } from "../../../../../lib/data/currencies"
import { ClaimOutboundSection } from "./claim-outbound-section"
import { ItemPlaceholder } from "./item-placeholder"

type ReturnCreateFormProps = {
  order: AdminOrder
  claim: AdminClaim
  preview: AdminOrderPreview
}

let itemsToAdd: string[] = []
let itemsToRemove: string[] = []
let IS_CANCELING = false

export const ClaimCreateForm = ({
  order,
  preview,
  claim,
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
  // TODO: implement confirm claim request
  const { mutateAsync: confirmClaimRequest, isPending: isConfirming } = {} // useConfirmClaimRequest(claim.id, order.id)

  const { mutateAsync: cancelClaimRequest, isPending: isCanceling } =
    useCancelClaimRequest(claim.id, order.id)

  // TODO: implement update claim request
  const { mutateAsync: updateClaimRequest, isPending: isUpdating } = {} // useUpdateClaim(claim.id, order.id)

  const {
    mutateAsync: addInboundShipping,
    isPending: isAddingInboundShipping,
  } = useAddClaimInboundShipping(claim.id, order.id)

  const {
    mutateAsync: updateInboundShipping,
    isPending: isUpdatingInboundShipping,
  } = useUpdateClaimInboundShipping(claim.id, order.id)

  const {
    mutateAsync: deleteInboundShipping,
    isPending: isDeletingInboundShipping,
  } = useDeleteClaimInboundShipping(claim.id, order.id)

  const { mutateAsync: addInboundItem, isPending: isAddingInboundItem } =
    useAddClaimInboundItems(claim.id, order.id)

  const { mutateAsync: updateInboundItem, isPending: isUpdatingInboundItem } =
    useUpdateClaimInboundItem(claim.id, order.id)

  const { mutateAsync: removeInboundItem, isPending: isRemovingInboundItem } =
    useRemoveClaimInboundItem(claim.id, order.id)

  const isRequestLoading =
    isConfirming ||
    isCanceling ||
    isAddingInboundShipping ||
    isUpdatingInboundShipping ||
    isDeletingInboundShipping ||
    isAddingInboundItem ||
    isRemovingInboundItem ||
    isUpdatingInboundItem ||
    isUpdating

  /**
   * Only consider items that belong to this claim.
   */
  const previewItems = useMemo(
    () =>
      preview?.items?.filter(
        (i) => !!i.actions?.find((a) => a.claim_id === claim.id)
      ),
    [preview.items]
  )

  const inboundPreviewItems = previewItems.filter(
    (item) => !!item.actions?.find((a) => a.action === "RETURN_ITEM")
  )

  const outboundPreviewItems = previewItems.filter(
    (item) => !!item.actions?.find((a) => a.action === "ITEM_ADD")
  )

  const itemsMap = useMemo(
    () => new Map(order?.items?.map((i) => [i.id, i])),
    [order.items]
  )

  /**
   * FORM
   */
  const form = useForm<CreateClaimSchemaType>({
    defaultValues: () => {
      const method = preview.shipping_methods.find(
        (s) => !!s.actions?.find((a) => a.action === "SHIPPING_ADD")
      )

      return Promise.resolve({
        inbound_items: inboundPreviewItems.map((i) => {
          const inboundAction = i.actions?.find(
            (a) => a.action === "RETURN_ITEM"
          )

          return {
            item_id: i.id,
            variant_id: i.variant_id,
            quantity: i.detail.return_requested_quantity,
            note: inboundAction?.internal_note,
            reason_id: inboundAction?.details?.reason_id as string | undefined,
          }
        }),
        outbound_items: outboundPreviewItems.map((i) => ({
          item_id: i.id,
          variant_id: i.variant_id,
          quantity: i.detail.quantity,
        })),
        inbound_option_id: method ? method.shipping_option_id : "",
        // TODO: pick up shipping method for outbound when available
        outbound_option_id: method ? method.shipping_option_id : "",
        location_id: "",
        send_notification: false,
      })
    },
    resolver: zodResolver(ClaimCreateSchema),
  })

  const {
    fields: inboundItems,
    append,
    remove,
    update,
  } = useFieldArray({
    name: "inbound_items",
    control: form.control,
  })

  const previewItemsMap = useMemo(
    () => new Map(previewItems.map((i) => [i.id, i])),
    [previewItems, inboundItems]
  )

  useEffect(() => {
    const existingItemsMap: Record<string, boolean> = {}

    inboundPreviewItems.forEach((i) => {
      const ind = inboundItems.findIndex((field) => field.item_id === i.id)

      existingItemsMap[i.id] = true

      if (ind > -1) {
        if (inboundItems[ind].quantity !== i.detail.return_requested_quantity) {
          const returnItemAction = i.actions?.find(
            (a) => a.action === "RETURN_ITEM"
          )

          update(ind, {
            ...inboundItems[ind],
            quantity: i.detail.return_requested_quantity,
            note: returnItemAction?.internal_note,
            reason_id: returnItemAction?.details?.reason_id as string,
          })
        }
      } else {
        append({ item_id: i.id, quantity: i.detail.return_requested_quantity })
      }
    })

    inboundItems.forEach((i, ind) => {
      if (!(i.item_id in existingItemsMap)) {
        remove(ind)
      }
    })
  }, [previewItems])

  useEffect(() => {
    const method = preview.shipping_methods.find(
      (s) => !!s.actions?.find((a) => a.action === "SHIPPING_ADD")
    )

    if (method) {
      form.setValue("inbound_option_id", method.shipping_option_id)
    }
  }, [preview.shipping_methods])

  const showInboundItemsPlaceholder = !inboundItems.length
  const locationId = form.watch("location_id")
  const shippingOptionId = form.watch("inbound_option_id")

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await confirmClaimRequest({ no_notification: !data.send_notification })

      handleSuccess()
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
      })
    }
  })

  const onItemsSelected = async () => {
    itemsToAdd.length &&
      (await addInboundItem(
        {
          items: itemsToAdd.map((id) => ({
            id,
            quantity: 1,
          })),
        },
        {
          onError: (error) => {
            toast.error(error.message)
          },
        }
      ))

    for (const itemToRemove of itemsToRemove) {
      const actionId = previewItems
        .find((i) => i.id === itemToRemove)
        ?.actions?.find((a) => a.action === "RETURN_ITEM")?.id

      if (actionId) {
        await removeInboundItem(actionId, {
          onError: (error) => {
            toast.error(error.message)
          },
        })
      }
    }

    setIsOpen("inbound-items", false)
  }

  const onLocationChange = async (selectedLocationId?: string | null) => {
    await updateClaimRequest({ location_id: selectedLocationId })
  }

  const onShippingOptionChange = async (selectedOptionId: string) => {
    const promises = preview.shipping_methods
      .map((s) => s.actions?.find((a) => a.action === "SHIPPING_ADD")?.id)
      .filter(Boolean)
      .map(deleteInboundShipping)

    await Promise.all(promises)

    await addInboundShipping(
      { shipping_option_id: selectedOptionId },
      {
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  useEffect(() => {
    if (isShippingPriceEdit) {
      document.getElementById("js-shipping-input")?.focus()
    }
  }, [isShippingPriceEdit])

  const showLevelsWarning = useMemo(() => {
    if (!locationId) {
      return false
    }

    const allItemsHaveLocation = inboundItems
      .map((_i) => {
        const item = itemsMap.get(_i.item_id)
        if (!item?.variant_id || !item?.variant) {
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
  }, [inboundItems, inventoryMap, locationId])

  useEffect(() => {
    const getInventoryMap = async () => {
      const ret: Record<string, InventoryLevelDTO[]> = {}

      if (!inboundItems.length) {
        return ret
      }

      const variantIds = inboundItems
        .map((item) => item?.variant_id)
        .filter(Boolean)

      const variants = (
        await sdk.admin.productVariant.list(
          { id: variantIds },
          { fields: "*inventory,*inventory.location_levels" }
        )
      ).variants

      variants.forEach((variant) => {
        ret[variant.id] = variant.inventory[0]?.location_levels || []
      })

      return ret
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [inboundItems])

  useEffect(() => {
    /**
     * Unmount hook
     */
    return () => {
      if (IS_CANCELING) {
        cancelClaimRequest(undefined, {
          onSuccess: () => {
            toast.success(t("orders.claims.actions.cancelClaim.successToast"))
          },
          onError: (error) => {
            toast.error(error.message)
          },
        })

        // TODO: add this on ESC press
        IS_CANCELING = false
      }
    }
  }, [])

  const shippingTotal = useMemo(() => {
    const method = preview.shipping_methods.find(
      (sm) => !!sm.actions?.find((a) => a.action === "SHIPPING_ADD")
    )

    return (method?.total as number) || 0
  }, [preview.shipping_methods])

  const returnTotal = preview.return_requested_total
  const refundAmount = returnTotal - shippingTotal

  return (
    <RouteFocusModal.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex size-full justify-center overflow-y-auto">
          <div className="mt-16 w-[720px] max-w-[100%] px-4 md:p-0">
            <Heading level="h1">{t("orders.claims.create")}</Heading>
            <div className="mt-8 flex items-center justify-between">
              <Heading level="h2">{t("orders.returns.inbound")}</Heading>

              <StackedFocusModal id="inbound-items">
                <StackedFocusModal.Trigger asChild>
                  <a className="focus-visible:shadow-borders-focus transition-fg txt-compact-small-plus cursor-pointer text-blue-500 outline-none hover:text-blue-400">
                    {t("actions.addItems")}
                  </a>
                </StackedFocusModal.Trigger>
                <StackedFocusModal.Content>
                  <StackedFocusModal.Header />

                  <AddClaimItemsTable
                    items={order.items!}
                    selectedItems={inboundItems.map((i) => i.item_id)}
                    currencyCode={order.currency_code}
                    onSelectionChange={(finalSelection) => {
                      const alreadySelected = inboundItems.map((i) => i.item_id)

                      itemsToAdd = finalSelection.filter(
                        (selection) => !alreadySelected.includes(selection)
                      )
                      itemsToRemove = alreadySelected.filter(
                        (selection) => !finalSelection.includes(selection)
                      )
                    }}
                  />

                  <StackedFocusModal.Footer>
                    <div className="flex w-full items-center justify-end gap-x-4">
                      <div className="flex items-center justify-end gap-x-2">
                        <RouteFocusModal.Close asChild>
                          <Button
                            type="button"
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
                          onClick={async () => await onItemsSelected()}
                        >
                          {t("actions.save")}
                        </Button>
                      </div>
                    </div>
                  </StackedFocusModal.Footer>
                </StackedFocusModal.Content>
              </StackedFocusModal>
            </div>
            {showInboundItemsPlaceholder && <ItemPlaceholder />}
            {inboundItems.map(
              (item, index) =>
                previewItemsMap.get(item.item_id) &&
                itemsMap.get(item.item_id)! && (
                  <ClaimInboundItem
                    key={item.id}
                    item={itemsMap.get(item.item_id)!}
                    previewItem={previewItemsMap.get(item.item_id)!}
                    currencyCode={order.currency_code}
                    form={form}
                    onRemove={() => {
                      const actionId = previewItems
                        .find((i) => i.id === item.item_id)
                        ?.actions?.find((a) => a.action === "RETURN_ITEM")?.id

                      if (actionId) {
                        removeInboundItem(actionId, {
                          onError: (error) => {
                            toast.error(error.message)
                          },
                        })
                      }
                    }}
                    onUpdate={(payload) => {
                      const actionId = previewItems
                        .find((i) => i.id === item.item_id)
                        ?.actions?.find((a) => a.action === "RETURN_ITEM")?.id

                      if (actionId) {
                        updateInboundItem(
                          { ...payload, actionId },
                          {
                            onError: (error) => {
                              toast.error(error.message)
                            },
                          }
                        )
                      }
                    }}
                    index={index}
                  />
                )
            )}
            {!showInboundItemsPlaceholder && (
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
                                onLocationChange(v)
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
                    name="inbound_option_id"
                    render={({ field: { value, onChange, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Control>
                            <Combobox
                              value={value ?? undefined}
                              onChange={(val) => {
                                onChange(val)
                                val && onShippingOptionChange(val)
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

            <ClaimOutboundSection
              form={form}
              preview={preview}
              order={order}
              claim={claim}
            />

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
                      disabled={
                        showInboundItemsPlaceholder || !shippingOptionId
                      }
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
                          updateInboundShipping(
                            {
                              actionId,
                              custom_price:
                                typeof customShippingAmount === "string"
                                  ? null
                                  : customShippingAmount,
                            },
                            {
                              onError: (error) => {
                                toast.error(error.message)
                              },
                            }
                          )
                        }
                        setIsShippingPriceEdit(false)
                      }}
                      symbol={
                        currencies[order.currency_code.toUpperCase()]
                          .symbol_native
                      }
                      code={order.currency_code}
                      onValueChange={(value) =>
                        value && setCustomShippingAmount(parseInt(value))
                      }
                      value={customShippingAmount}
                      disabled={showInboundItemsPlaceholder}
                    />
                  ) : (
                    getStylizedAmount(shippingTotal, order.currency_code)
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-dotted pt-4">
                <span className="txt-small font-medium">
                  {t("orders.claims.refundAmount")}
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
                  type="button"
                  onClick={() => (IS_CANCELING = true)}
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
