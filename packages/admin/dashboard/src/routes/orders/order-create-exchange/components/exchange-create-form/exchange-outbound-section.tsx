import {
  AdminExchange,
  AdminOrder,
  AdminOrderPreview,
  InventoryLevelDTO,
} from "@medusajs/types"
import { Alert, Button, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteFocusModal,
  StackedFocusModal,
  useStackedModal,
} from "../../../../../components/modals"
import {
  useAddExchangeOutboundItems,
  useAddExchangeOutboundShipping,
  useDeleteExchangeOutboundShipping,
  useRemoveExchangeOutboundItem,
  useUpdateExchangeOutboundItems,
} from "../../../../../hooks/api/exchanges"
import { useShippingOptions } from "../../../../../hooks/api/shipping-options"
import { sdk } from "../../../../../lib/client"
import { OutboundShippingPlaceholder } from "../../../common/placeholders"
import { ItemPlaceholder } from "../../../order-create-claim/components/claim-create-form/item-placeholder"
import { AddExchangeOutboundItemsTable } from "../add-exchange-outbound-items-table"
import { ExchangeOutboundItem } from "./exchange-outbound-item"
import { CreateExchangeSchemaType } from "./schema"

type ExchangeOutboundSectionProps = {
  order: AdminOrder
  exchange: AdminExchange
  preview: AdminOrderPreview
  form: UseFormReturn<CreateExchangeSchemaType>
}

let itemsToAdd: string[] = []
let itemsToRemove: string[] = []

export const ExchangeOutboundSection = ({
  order,
  preview,
  exchange,
  form,
}: ExchangeOutboundSectionProps) => {
  const { t } = useTranslation()

  const { setIsOpen } = useStackedModal()
  const [inventoryMap, setInventoryMap] = useState<
    Record<string, InventoryLevelDTO[]>
  >({})

  /**
   * HOOKS
   */
  const { shipping_options = [] } = useShippingOptions({
    limit: 999,
    fields: "*prices,+service_zone.fulfillment_set.location.id",
  })

  const { mutateAsync: addOutboundShipping } = useAddExchangeOutboundShipping(
    exchange.id,
    order.id
  )

  const { mutateAsync: deleteOutboundShipping } =
    useDeleteExchangeOutboundShipping(exchange.id, order.id)

  const { mutateAsync: addOutboundItem } = useAddExchangeOutboundItems(
    exchange.id,
    order.id
  )

  const { mutateAsync: updateOutboundItem } = useUpdateExchangeOutboundItems(
    exchange.id,
    order.id
  )

  const { mutateAsync: removeOutboundItem } = useRemoveExchangeOutboundItem(
    exchange.id,
    order.id
  )

  /**
   * Only consider items that belong to this exchange and is an outbound item
   */
  const previewOutboundItems = useMemo(
    () =>
      preview?.items?.filter(
        (i) =>
          !!i.actions?.find(
            (a) => a.exchange_id === exchange.id && a.action === "ITEM_ADD"
          )
      ),
    [preview.items]
  )

  const variantItemMap = useMemo(
    () => new Map(order?.items?.map((i) => [i.variant_id, i])),
    [order.items]
  )

  const {
    fields: outboundItems,
    append,
    remove,
    update,
  } = useFieldArray({
    name: "outbound_items",
    control: form.control,
  })

  const variantOutboundMap = useMemo(
    () => new Map(previewOutboundItems.map((i) => [i.variant_id, i])),
    [previewOutboundItems, outboundItems]
  )

  useEffect(() => {
    const existingItemsMap: Record<string, boolean> = {}

    previewOutboundItems.forEach((i) => {
      const ind = outboundItems.findIndex((field) => field.item_id === i.id)

      existingItemsMap[i.id] = true

      if (ind > -1) {
        if (outboundItems[ind].quantity !== i.detail.quantity) {
          update(ind, {
            ...outboundItems[ind],
            quantity: i.detail.quantity,
          })
        }
      } else {
        append(
          {
            item_id: i.id,
            quantity: i.detail.quantity,
            variant_id: i.variant_id,
          },
          { shouldFocus: false }
        )
      }
    })

    outboundItems.forEach((i, ind) => {
      if (!(i.item_id in existingItemsMap)) {
        remove(ind)
      }
    })
  }, [previewOutboundItems])

  const locationId = form.watch("location_id")
  const showOutboundItemsPlaceholder = !outboundItems.length

  const onItemsSelected = async () => {
    itemsToAdd.length &&
      (await addOutboundItem(
        {
          items: itemsToAdd.map((variantId) => ({
            variant_id: variantId,
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
      const action = previewOutboundItems
        .find((i) => i.variant_id === itemToRemove)
        ?.actions?.find((a) => a.action === "ITEM_ADD")

      if (action?.id) {
        await removeOutboundItem(action?.id, {
          onError: (error) => {
            toast.error(error.message)
          },
        })
      }
    }

    setIsOpen("outbound-items", false)
  }

  useEffect(() => {
    const outboundShipping = preview.shipping_methods.find(
      (s) =>
        !!s.actions?.find((a) => a.action === "SHIPPING_ADD" && !a.return_id)
    )

    if (outboundShipping) {
      form.setValue("outbound_option_id", outboundShipping.shipping_option_id)
    } else {
      form.setValue("outbound_option_id", null)
    }
  }, [preview.shipping_methods])

  const onShippingOptionChange = async (selectedOptionId: string) => {
    const outboundShippingMethods = preview.shipping_methods.filter(
      (s) =>
        !!s.actions?.find((a) => a.action === "SHIPPING_ADD" && !a.return_id)
    )

    const promises = outboundShippingMethods
      .filter(Boolean)
      .map((outboundShippingMethod) => {
        const action = outboundShippingMethod.actions?.find(
          (a) => a.action === "SHIPPING_ADD" && !a.return_id
        )

        if (action) {
          return deleteOutboundShipping(action.id)
        }
      })

    await Promise.all(promises)

    await addOutboundShipping(
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

    const allItemsHaveLocation = outboundItems
      .map((i) => {
        const item = variantItemMap.get(i.variant_id)
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
  }, [outboundItems, inventoryMap, locationId])

  useEffect(() => {
    const getInventoryMap = async () => {
      const ret: Record<string, InventoryLevelDTO[]> = {}

      if (!outboundItems.length) {
        return ret
      }

      const variantIds = outboundItems
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
  }, [outboundItems])

  return (
    <div>
      <div className="mt-8 flex items-center justify-between">
        <Heading level="h2">{t("orders.returns.outbound")}</Heading>

        <StackedFocusModal id="outbound-items">
          <StackedFocusModal.Trigger asChild>
            <a className="focus-visible:shadow-borders-focus transition-fg txt-compact-small-plus cursor-pointer text-blue-500 outline-none hover:text-blue-400">
              {t("actions.addItems")}
            </a>
          </StackedFocusModal.Trigger>
          <StackedFocusModal.Content>
            <StackedFocusModal.Header />

            <AddExchangeOutboundItemsTable
              selectedItems={outboundItems.map((i) => i.variant_id)}
              currencyCode={order.currency_code}
              onSelectionChange={(finalSelection) => {
                const alreadySelected = outboundItems.map((i) => i.variant_id)

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

      {showOutboundItemsPlaceholder && <ItemPlaceholder />}

      {outboundItems.map(
        (item, index) =>
          variantOutboundMap.get(item.variant_id) && (
            <ExchangeOutboundItem
              key={item.id}
              previewItem={variantOutboundMap.get(item.variant_id)!}
              currencyCode={order.currency_code}
              form={form}
              onRemove={() => {
                const actionId = previewOutboundItems
                  .find((i) => i.id === item.item_id)
                  ?.actions?.find((a) => a.action === "ITEM_ADD")?.id

                if (actionId) {
                  removeOutboundItem(actionId, {
                    onError: (error) => {
                      toast.error(error.message)
                    },
                  })
                }
              }}
              onUpdate={(payload) => {
                const actionId = previewOutboundItems
                  .find((i) => i.id === item.item_id)
                  ?.actions?.find((a) => a.action === "ITEM_ADD")?.id

                if (actionId) {
                  updateOutboundItem(
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
      {!showOutboundItemsPlaceholder && (
        <div className="mt-8 flex flex-col gap-y-4">
          {/*OUTBOUND SHIPPING*/}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <Form.Label>{t("orders.exchanges.outboundShipping")}</Form.Label>
              <Form.Hint className="!mt-1">
                {t("orders.exchanges.outboundShippingHint")}
              </Form.Hint>
            </div>

            <Form.Field
              control={form.control}
              name="outbound_option_id"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Combobox
                        noResultsPlaceholder={<OutboundShippingPlaceholder />}
                        value={value ?? undefined}
                        onChange={(val) => {
                          onChange(val)
                          val && onShippingOptionChange(val)
                        }}
                        {...field}
                        options={shipping_options.map((so) => ({
                          label: so.name,
                          value: so.id,
                        }))}
                        disabled={!shipping_options.length}
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
