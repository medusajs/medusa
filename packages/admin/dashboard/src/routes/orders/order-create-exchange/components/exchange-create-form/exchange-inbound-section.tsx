import {
  AdminExchange,
  AdminOrder,
  AdminOrderPreview,
  AdminReturn,
  InventoryLevelDTO,
} from "@medusajs/types"
import { Alert, Button, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteFocusModal,
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals"
import { useShippingOptions, useStockLocations } from "../../../../../hooks/api"
import {
  useAddExchangeInboundItems,
  useAddExchangeInboundShipping,
  useDeleteExchangeInboundShipping,
  useRemoveExchangeInboundItem,
  useUpdateExchangeInboundItem,
} from "../../../../../hooks/api/exchanges"
import { useUpdateReturn } from "../../../../../hooks/api/returns"
import { sdk } from "../../../../../lib/client"
import { ReturnShippingPlaceholder } from "../../../common/placeholders"
import { ItemPlaceholder } from "../../../order-create-claim/components/claim-create-form/item-placeholder"
import { AddExchangeInboundItemsTable } from "../add-exchange-inbound-items-table"
import { ExchangeInboundItem } from "./exchange-inbound-item"
import { CreateExchangeSchemaType } from "./schema"

type ExchangeInboundSectionProps = {
  order: AdminOrder
  orderReturn?: AdminReturn
  exchange: AdminExchange
  preview: AdminOrderPreview
  form: UseFormReturn<CreateExchangeSchemaType>
}

let itemsToAdd: string[] = []
let itemsToRemove: string[] = []

export const ExchangeInboundSection = ({
  order,
  preview,
  exchange,
  form,
  orderReturn,
}: ExchangeInboundSectionProps) => {
  const { t } = useTranslation()

  /**
   * STATE
   */
  const { setIsOpen } = useStackedModal()
  const [inventoryMap, setInventoryMap] = useState<
    Record<string, InventoryLevelDTO[]>
  >({})

  /**
   * MUTATIONS
   */
  const { mutateAsync: updateReturn } = useUpdateReturn(
    preview?.order_change?.return_id!,
    order.id
  )

  const { mutateAsync: addInboundShipping } = useAddExchangeInboundShipping(
    exchange.id,
    order.id
  )

  const { mutateAsync: deleteInboundShipping } =
    useDeleteExchangeInboundShipping(exchange.id, order.id)

  const { mutateAsync: addInboundItem } = useAddExchangeInboundItems(
    exchange.id,
    order.id
  )

  const { mutateAsync: updateInboundItem } = useUpdateExchangeInboundItem(
    exchange.id,
    order.id
  )

  const { mutateAsync: removeInboundItem } = useRemoveExchangeInboundItem(
    exchange.id,
    order.id
  )

  /**
   * Only consider items that belong to this exchange.
   */
  const previewInboundItems = useMemo(
    () =>
      preview?.items?.filter(
        (i) => !!i.actions?.find((a) => a.exchange_id === exchange.id)
      ),
    [preview.items]
  )

  const inboundPreviewItems = previewInboundItems.filter(
    (item) => !!item.actions?.find((a) => a.action === "RETURN_ITEM")
  )

  const itemsMap = useMemo(
    () => new Map(order?.items?.map((i) => [i.id, i])),
    [order.items]
  )

  const locationId = form.watch("location_id")

  /**
   * HOOKS
   */
  const { stock_locations = [] } = useStockLocations({ limit: 999 })
  const { shipping_options = [] } = useShippingOptions(
    {
      limit: 999,
      fields: "*prices,+service_zone.fulfillment_set.location.id",
      stock_location_id: locationId,
    },
    {
      enabled: !!locationId,
    }
  )

  const inboundShippingOptions = shipping_options.filter(
    (shippingOption) =>
      !!shippingOption.rules.find(
        (r) => r.attribute === "is_return" && r.value === "true"
      )
  )

  const {
    fields: inboundItems,
    append,
    remove,
    update,
  } = useFieldArray({
    name: "inbound_items",
    control: form.control,
  })

  const inboundItemsMap = useMemo(
    () => new Map(previewInboundItems.map((i) => [i.id, i])),
    [previewInboundItems, inboundItems]
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
        append(
          { item_id: i.id, quantity: i.detail.return_requested_quantity },
          { shouldFocus: false }
        )
      }
    })

    inboundItems.forEach((i, ind) => {
      if (!(i.item_id in existingItemsMap)) {
        remove(ind)
      }
    })
  }, [previewInboundItems])

  useEffect(() => {
    const inboundShippingMethod = preview.shipping_methods.find((s) =>
      s.actions?.find((a) => a.action === "SHIPPING_ADD" && !!a.return_id)
    )

    if (inboundShippingMethod) {
      form.setValue(
        "inbound_option_id",
        inboundShippingMethod.shipping_option_id
      )
    } else {
      form.setValue("inbound_option_id", null)
    }
  }, [preview.shipping_methods])

  useEffect(() => {
    form.setValue("location_id", orderReturn?.location_id)
  }, [orderReturn])

  const showInboundItemsPlaceholder = !inboundItems.length

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
      const actionId = previewInboundItems
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
    await updateReturn({ location_id: selectedLocationId })
  }

  const onShippingOptionChange = async (selectedOptionId: string) => {
    const inboundShippingMethods = preview.shipping_methods.filter((s) =>
      s.actions?.find((a) => a.action === "SHIPPING_ADD" && !!a.return_id)
    )

    const promises = inboundShippingMethods
      .filter(Boolean)
      .map((inboundShippingMethod) => {
        const action = inboundShippingMethod.actions?.find(
          (a) => a.action === "SHIPPING_ADD" && !!a.return_id
        )

        if (action) {
          return deleteInboundShipping(action.id)
        }
      })

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
        ret[variant.id] = variant.inventory?.[0]?.location_levels || []
      })

      return ret
    }

    getInventoryMap().then((map) => {
      setInventoryMap(map)
    })
  }, [inboundItems])

  return (
    <div>
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

            <AddExchangeInboundItemsTable
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
                    <Button type="button" variant="secondary" size="small">
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
          inboundItemsMap.get(item.item_id) &&
          itemsMap.get(item.item_id)! && (
            <ExchangeInboundItem
              key={item.id}
              item={itemsMap.get(item.item_id)!}
              previewItem={inboundItemsMap.get(item.item_id)!}
              currencyCode={order.currency_code}
              form={form}
              onRemove={() => {
                const actionId = previewInboundItems
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
              onUpdate={(payload: HttpTypes.AdminUpdateReturnItems) => {
                const action = previewInboundItems
                  .find((i) => i.id === item.item_id)
                  ?.actions?.find((a) => a.action === "RETURN_ITEM")

                if (action) {
                  updateInboundItem(
                    { ...payload, actionId: action.id },
                    {
                      onError: (error) => {
                        if (action.details?.quantity && payload.quantity) {
                          form.setValue(
                            `inbound_items.${index}.quantity`,
                            action.details?.quantity as number
                          )
                        }

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
                        {...field}
                        value={value ?? undefined}
                        onChange={(v) => {
                          onChange(v)
                          onLocationChange(v)
                        }}
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
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-muted inline ml-1"
                >
                  ({t("fields.optional")})
                </Text>
              </Form.Label>

              <Form.Hint className="!mt-1">
                {t("orders.returns.inboundShippingHint")}
              </Form.Hint>
            </div>

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
                        options={inboundShippingOptions.map((so) => ({
                          label: so.name,
                          value: so.id,
                        }))}
                        disabled={!locationId}
                        noResultsPlaceholder={<ReturnShippingPlaceholder />}
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
    </div>
  )
}
