import React from "react"
import * as zod from "zod"
import { useTranslation } from "react-i18next"

import { useForm } from "react-hook-form"
import { Order } from "@medusajs/medusa"
import { Button, Select, Switch } from "@medusajs/ui"

import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CreateFulfillmentSchema } from "./constants"
import { useAdminStockLocations } from "medusa-react"
import { Form } from "../../../../../components/common/form"
import { OrderCreateFulfillmentItem } from "./order-create-fulfillment-item.tsx"

type OrderCreateFulfillmentFormProps = {
  order: Order
}

export function OrderCreateFulfillmentForm({
  order,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const isMutating = false

  const form = useForm<zod.infer<typeof CreateFulfillmentSchema>>({
    defaultValues: {
      quantity: {},
    },
  })

  const { stock_locations = [] } = useAdminStockLocations({})

  const handleSubmit = form.handleSubmit(async (data) => {
    handleSuccess(`/orders/${order.id}`)
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
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
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex h-full w-full flex-col items-center divide-y overflow-y-auto">
          <div className="flex size-full flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[736px] flex-col justify-center px-2 pb-2">
              <div className="flex flex-col divide-y">
                <div className="flex-1">
                  <Form.Field
                    control={form.control}
                    name="location"
                    render={({ field: { onChange, ref, ...field } }) => {
                      return (
                        <Form.Item>
                          <Form.Label> {t("fields.location")}</Form.Label>
                          <Form.Hint>
                            {t("orders.fulfillment.locationDescription")}
                          </Form.Hint>
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
                          <Form.ErrorMessage />
                        </Form.Item>
                      )
                    }}
                  />

                  <Form.Item className="mt-8">
                    <Form.Label>
                      {t("orders.fulfillment.itemsToFulfill")}
                    </Form.Label>
                    <Form.Hint>
                      {t("orders.fulfillment.itemsToFulfillDesc")}
                    </Form.Hint>

                    <div className="flex flex-col gap-y-1">
                      {order.items.map((item) => (
                        <OrderCreateFulfillmentItem
                          key={item.id}
                          form={form}
                          item={item}
                          currencyCode={order.currency_code}
                        />
                      ))}
                    </div>
                  </Form.Item>
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
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
