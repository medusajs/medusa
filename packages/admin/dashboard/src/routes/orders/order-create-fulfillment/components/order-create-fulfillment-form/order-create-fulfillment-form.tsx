import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminOrder, HttpTypes } from "@medusajs/types"
import { Alert, Button, Switch, toast } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateOrderFulfillment } from "../../../../../hooks/api/orders"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { CreateFulfillmentSchema } from "./constants"
import { OrderCreateFulfillmentItem } from "./order-create-fulfillment-item"
import {
  shippingOptionsQueryKeys,
  useReservationItems,
  useShippingOption,
} from "../../../../../hooks/api"
import { getReservationsLimitCount } from "../../../../../lib/orders"
import { sdk } from "../../../../../lib/client"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { Combobox } from "../../../../../components/inputs/combobox"

type OrderCreateFulfillmentFormProps = {
  order: AdminOrder & {
    no_notification?: boolean
  }
  requiresShipping: boolean
}

export function OrderCreateFulfillmentForm({
  order,
  requiresShipping,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { mutateAsync: createOrderFulfillment, isPending: isMutating } =
    useCreateOrderFulfillment(order.id)

  const { reservations } = useReservationItems({
    line_item_id: order.items.map((i) => i.id),
    limit: getReservationsLimitCount(order),
  })

  const [fulfillableItems, setFulfillableItems] = useState(() =>
    (order.items || []).filter(
      (item) =>
        item.requires_shipping === requiresShipping &&
        getFulfillableQuantity(item) > 0
    )
  )

  const form = useForm<zod.infer<typeof CreateFulfillmentSchema>>({
    defaultValues: {
      quantity: fulfillableItems.reduce((acc, item) => {
        acc[item.id] = getFulfillableQuantity(item)
        return acc
      }, {} as Record<string, number>),
      send_notification: !order.no_notification,
    },
    resolver: zodResolver(CreateFulfillmentSchema),
  })

  const selectedLocationId = useWatch({
    name: "location_id",
    control: form.control,
  })

  const stockLocations = useComboboxData({
    queryFn: (params) => sdk.admin.stockLocation.list(params),
    queryKey: ["stock_locations"],
    getOptions: (data) =>
      data.stock_locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    selectedValue: selectedLocationId,
  })

  const selectedShippingOptionId = useWatch({
    name: "shipping_option_id",
    control: form.control,
  })

  const shippingOptions = useComboboxData({
    queryFn: (params) =>
      sdk.admin.shippingOption.list({
        ...params,
        stock_location_id: selectedLocationId,
        // is_return: false, // TODO: 500 when enabled
      }),
    queryKey: shippingOptionsQueryKeys.list(selectedLocationId),
    getOptions: (data) =>
      data.shipping_options.map((shippingOption) => ({
        label: shippingOption.name,
        value: shippingOption.id,
        shippingOption,
      })),
    selectedValue: selectedShippingOptionId,
    enabled: !!selectedLocationId,
  })

  const selectedShippingOption = shippingOptions.options.find(
    (o) => o.value === selectedShippingOptionId
  )?.shippingOption

  const initialShippingOptionId =
    order.shipping_methods?.[0]?.shipping_option_id

  // Needed to guarantee we have the initial location_id
  const { shipping_option: initialShippingOption } = useShippingOption(
    initialShippingOptionId!,
    { fields: "+service_zone.fulfillment_set.location.id" },
    { enabled: !!initialShippingOptionId }
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!selectedShippingOption) {
      form.setError("shipping_option_id", {
        type: "manual",
        message: t("orders.fulfillment.error.noShippingOption"),
      })
      return
    }

    if (!selectedLocationId) {
      form.setError("location_id", {
        type: "manual",
        message: t("orders.fulfillment.error.noLocation"),
      })
      return
    }

    let items = Object.entries(data.quantity)
      .map(([id, quantity]) => ({
        id,
        quantity,
      }))
      .filter(({ quantity }) => !!quantity)

    /**
     * If items require shipping fulfill only items with matching shipping profile.
     */
    if (requiresShipping) {
      const selectedShippingProfileId =
        selectedShippingOption?.shipping_profile_id

      const itemShippingProfileMap = order.items.reduce((acc, item) => {
        acc[item.id] = item.variant?.product?.shipping_profile?.id
        return acc
      }, {} as any)

      items = items.filter(
        ({ id }) => itemShippingProfileMap[id] === selectedShippingProfileId
      )
    }

    const payload: HttpTypes.AdminCreateOrderFulfillment = {
      location_id: selectedLocationId,
      shipping_option_id: selectedShippingOptionId,
      no_notification: !data.send_notification,
      items,
    }

    try {
      await createOrderFulfillment(payload)

      toast.success(t("orders.fulfillment.toast.created"))
      handleSuccess(`/orders/${order.id}`)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : t("errorBoundary.defaultTitle")
      )
    }
  })

  useEffect(() => {
    if (!initialShippingOption) {
      return
    }

    form.setValue(
      "location_id",
      initialShippingOption.service_zone.fulfillment_set.location.id
    )
    form.setValue("shipping_option_id", initialShippingOption.id)
  }, [initialShippingOption])

  const fulfilledQuantityArray = (order.items || []).map(
    (item) =>
      item.requires_shipping === requiresShipping &&
      item.detail.fulfilled_quantity
  )

  useEffect(() => {
    const itemsToFulfill =
      order?.items?.filter(
        (item) =>
          item.requires_shipping === requiresShipping &&
          getFulfillableQuantity(item) > 0
      ) || []

    setFulfillableItems(itemsToFulfill)

    if (itemsToFulfill.length) {
      form.clearErrors("root")
    } else {
      form.setError("root", {
        type: "manual",
        message: t("orders.fulfillment.error.noItems"),
      })
    }

    const quantityMap = itemsToFulfill.reduce((acc, item) => {
      acc[item.id] = getFulfillableQuantity(item)
      return acc
    }, {} as Record<string, number>)

    form.setValue("quantity", quantityMap)
  }, [...fulfilledQuantityArray, requiresShipping])

  const differentOptionSelected =
    selectedShippingOptionId &&
    order.shipping_methods?.[0]?.shipping_option_id !== selectedShippingOptionId

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />

        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col divide-y divide-dashed">
                <div className="pb-8">
                  <Form.Field
                    control={form.control}
                    name="location_id"
                    render={({ field: { ...field } }) => {
                      return (
                        <Form.Item>
                          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                            <div className="flex-1">
                              <Form.Label>{t("fields.location")}</Form.Label>
                              <Form.Hint>
                                {t("orders.fulfillment.locationDescription")}
                              </Form.Hint>
                            </div>
                            <div className="flex-1">
                              <Form.Control>
                                <Combobox
                                  {...field}
                                  options={stockLocations.options}
                                  searchValue={stockLocations.searchValue}
                                  onSearchValueChange={
                                    stockLocations.onSearchValueChange
                                  }
                                  disabled={stockLocations.disabled}
                                />
                              </Form.Control>
                            </div>
                          </div>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                <div className="py-8">
                  <Form.Field
                    control={form.control}
                    name="shipping_option_id"
                    render={({ field: { ...field } }) => {
                      return (
                        <Form.Item>
                          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                            <div className="flex-1">
                              <Form.Label>
                                {t("fields.shippingMethod")}
                              </Form.Label>
                              <Form.Hint>
                                {t("orders.fulfillment.methodDescription")}
                              </Form.Hint>
                            </div>
                            <div className="flex-1">
                              <Form.Control>
                                <Combobox
                                  {...field}
                                  options={shippingOptions.options}
                                  searchValue={shippingOptions.searchValue}
                                  onSearchValueChange={
                                    shippingOptions.onSearchValueChange
                                  }
                                  fetchNextPage={shippingOptions.fetchNextPage}
                                  disabled={shippingOptions.disabled}
                                />
                              </Form.Control>
                            </div>
                          </div>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />

                  {differentOptionSelected && (
                    <Alert className="mt-4 p-4" variant="warning">
                      <span className="-mt-[3px] block font-medium">
                        {t("labels.beaware")}
                      </span>
                      <span className="text-ui-fg-muted">
                        {t("orders.fulfillment.differentOptionSelected")}
                      </span>
                    </Alert>
                  )}
                </div>
                <div>
                  <Form.Item className="mt-8">
                    <Form.Label>
                      {t("orders.fulfillment.itemsToFulfill")}
                    </Form.Label>
                    <Form.Hint>
                      {t("orders.fulfillment.itemsToFulfillDesc")}
                    </Form.Hint>

                    <div className="flex flex-col gap-y-1">
                      {fulfillableItems.map((item) => {
                        const isShippingProfileMatching =
                          selectedShippingOption?.shipping_profile_id ===
                          item.variant?.product?.shipping_profile?.id

                        return (
                          <OrderCreateFulfillmentItem
                            key={item.id}
                            form={form}
                            item={item}
                            locationId={selectedLocationId}
                            disabled={
                              requiresShipping && !isShippingProfileMatching
                            }
                            reservations={reservations ?? []}
                            currencyCode={order.currency_code}
                          />
                        )
                      })}
                    </div>
                  </Form.Item>
                  {form.formState.errors.root && (
                    <Alert
                      variant="error"
                      dismissible={false}
                      className="flex items-center"
                    >
                      {form.formState.errors.root.message}
                    </Alert>
                  )}
                </div>

                <div className="mt-8 pt-8 ">
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
                                  dir="ltr"
                                  className="rtl:rotate-180"
                                  checked={!!value}
                                  onCheckedChange={onChange}
                                  {...field}
                                />
                              </Form.Control>
                            </Form.Control>
                          </div>
                          <Form.Hint className="!mt-1">
                            {t("orders.fulfillment.sendNotificationHint")}
                          </Form.Hint>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              type="submit"
              isLoading={isMutating}
              disabled={!selectedShippingOptionId}
            >
              {t("orders.fulfillment.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
