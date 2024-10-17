import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminOrder } from "@medusajs/types"
import { Alert, Button, Select, Switch, toast } from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"

import { OrderLineItemDTO } from "@medusajs/types"
import { useSearchParams } from "react-router-dom"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateOrderFulfillment } from "../../../../../hooks/api/orders"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { getFulfillableQuantity } from "../../../../../lib/order-item"
import { CreateFulfillmentSchema } from "./constants"
import { OrderCreateFulfillmentItem } from "./order-create-fulfillment-item"

type OrderCreateFulfillmentFormProps = {
  order: AdminOrder
  requiresShipping: boolean
}

export function OrderCreateFulfillmentForm({
  order,
  requiresShipping,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const [searchParams] = useSearchParams()

  const { mutateAsync: createOrderFulfillment, isPending: isMutating } =
    useCreateOrderFulfillment(order.id)

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

  const { stock_locations = [] } = useStockLocations()

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createOrderFulfillment({
        location_id: data.location_id,
        // shipping_option_id: data.shipping_option_id,
        no_notification: !data.send_notification,
        items: Object.entries(data.quantity)
          .filter(([, value]) => !!value)
          .map(([id, quantity]) => ({
            id,
            quantity,
          })),
      })

      toast.success(t("orders.fulfillment.toast.created"))
      handleSuccess(`/orders/${order.id}`)
    } catch (e) {
      toast.error(e.message)
    }
  })

  useEffect(() => {
    if (stock_locations?.length) {
      form.setValue("location_id", stock_locations[0].id)
    }
  }, [stock_locations?.length])

  const selectedLocationId = useWatch({
    name: "location_id",
    control: form.control,
  })

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
      acc[item.id] = getFulfillableQuantity(item as OrderLineItemDTO)
      return acc
    }, {} as Record<string, number>)

    form.setValue("quantity", quantityMap)
  }, [...fulfilledQuantityArray, requiresShipping])

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("orders.fulfillment.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>

        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col divide-y divide-dashed">
                <div className="pb-8">
                  <Form.Field
                    control={form.control}
                    name="location_id"
                    render={({ field: { onChange, ref, ...field } }) => {
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
                                <Select onValueChange={onChange} {...field}>
                                  <Select.Trigger
                                    className="bg-ui-bg-base"
                                    ref={ref}
                                  >
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
                            </div>
                          </div>
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />
                </div>

                {/* <div className="py-8">*/}
                {/*  <Form.Field*/}
                {/*    control={form.control}*/}
                {/*    name="shipping_option_id"*/}
                {/*    render={({ field: { onChange, ref, ...field } }) => {*/}
                {/*      return (*/}
                {/*        <Form.Item>*/}
                {/*          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">*/}
                {/*            <div className="flex-1">*/}
                {/*              <Form.Label>*/}
                {/*                {t("fields.shippingMethod")}*/}
                {/*              </Form.Label>*/}
                {/*              <Form.Hint>*/}
                {/*                {t("orders.fulfillment.methodDescription")}*/}
                {/*              </Form.Hint>*/}
                {/*            </div>*/}
                {/*            <div className="flex-1">*/}
                {/*              <Form.Control>*/}
                {/*                <Select onValueChange={onChange} {...field}>*/}
                {/*                  <Select.Trigger*/}
                {/*                    className="bg-ui-bg-base"*/}
                {/*                    ref={ref}*/}
                {/*                  >*/}
                {/*                    <Select.Value />*/}
                {/*                  </Select.Trigger>*/}
                {/*                  <Select.Content>*/}
                {/*                    {shipping_options.map((o) => (*/}
                {/*                      <Select.Item key={o.id} value={o.id}>*/}
                {/*                        {o.name}*/}
                {/*                      </Select.Item>*/}
                {/*                    ))}*/}
                {/*                  </Select.Content>*/}
                {/*                </Select>*/}
                {/*              </Form.Control>*/}
                {/*            </div>*/}
                {/*          </div>*/}
                {/*          <Form.ErrorMessage />*/}
                {/*        </Form.Item>*/}
                {/*      )*/}
                {/*    }}*/}
                {/*  />*/}
                {/* </div>*/}
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
                        return (
                          <OrderCreateFulfillmentItem
                            key={item.id}
                            form={form}
                            item={item}
                            locationId={selectedLocationId}
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
                      classNameInner="flex justify-between flex-1 items-center"
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
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
