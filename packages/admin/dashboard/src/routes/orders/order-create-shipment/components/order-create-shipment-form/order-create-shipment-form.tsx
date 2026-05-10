import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Button, clx, Heading, Input, Switch, toast } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateOrderShipment } from "../../../../../hooks/api"
import { CreateShipmentSchema } from "./constants"
import {
  ExtendedOrderFulfillment,
  ExtendedOrder,
} from "../../../order-detail/constants"

type OrderCreateFulfillmentFormProps = {
  order: ExtendedOrder
  fulfillment?: ExtendedOrderFulfillment
}

export function OrderCreateShipmentForm({
  order,
  fulfillment,
}: OrderCreateFulfillmentFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync: createShipment, isPending: isMutating } =
    useCreateOrderShipment(order.id, fulfillment?.id ?? "")

  const form = useForm<zod.infer<typeof CreateShipmentSchema>>({
    defaultValues: {
      send_notification: !order.no_notification,
    },
    resolver: zodResolver(CreateShipmentSchema),
  })

  const { fields: labels, append } = useFieldArray({
    name: "labels",
    control: form.control,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const addedLabels = data.labels
      .filter((l) => !!l.tracking_number || !!l.tracking_url || !!l.label_url)
      .map((l) => ({
        tracking_number: l.tracking_number,
        tracking_url: l.tracking_url || "#",
        label_url: l.label_url || "#",
      }))

    await createShipment(
      {
        items:
          fulfillment?.items
            ?.filter((i) => !!i.line_item_id)
            .map((i) => ({
              id: i.line_item_id!,
              quantity: i.quantity,
            })) || [],
        labels: [...addedLabels, ...(fulfillment?.labels || [])],
        no_notification: !data.send_notification,
      },
      {
        onSuccess: () => {
          toast.success(t("orders.shipment.toastCreated"))
          handleSuccess(`/orders/${order.id}`)
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

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
              <div className="flex flex-col divide-y">
                <div className="flex flex-1 flex-col">
                  <Heading className="mb-4">
                    {t("orders.shipment.title")}
                  </Heading>

                  <div className="flex flex-col max-md:gap-y-2 max-md:divide-y">
                    {labels.map((label, index) => (
                      <div
                        key={label.id}
                        className={clx(
                          "grid grid-cols-1 gap-x-4 md:grid-cols-3",
                          { "max-md:pt-4": index > 0 }
                        )}
                      >
                        <Form.Field
                          control={form.control}
                          name={`labels.${index}.tracking_number`}
                          render={({ field }) => {
                            return (
                              <Form.Item className="mb-2">
                                <Form.Label
                                  className={clx({ "md:hidden": index > 0 })}
                                >
                                  {t("orders.shipment.trackingNumber")}
                                </Form.Label>

                                <Form.Control>
                                  <Input {...field} placeholder="123-456-789" />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                        <Form.Field
                          control={form.control}
                          name={`labels.${index}.tracking_url`}
                          render={({ field }) => {
                            return (
                              <Form.Item className="mb-2">
                                <Form.Label
                                  className={clx({ "md:hidden": index > 0 })}
                                >
                                  {t("orders.shipment.trackingUrl")}
                                </Form.Label>
                                <Form.Control>
                                  <Input
                                    {...field}
                                    placeholder="https://example.com/tracking/123"
                                  />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                        <Form.Field
                          control={form.control}
                          name={`labels.${index}.label_url`}
                          render={({ field }) => {
                            return (
                              <Form.Item className="mb-2">
                                <Form.Label
                                  className={clx({ "md:hidden": index > 0 })}
                                >
                                  {t("orders.shipment.labelUrl")}
                                </Form.Label>
                                <Form.Control>
                                  <Input
                                    {...field}
                                    placeholder="https://example.com/label/123"
                                  />
                                </Form.Control>
                                <Form.ErrorMessage />
                              </Form.Item>
                            )
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        tracking_number: "",
                        label_url: "",
                        tracking_url: "",
                      })
                    }
                    className="mt-2 self-end"
                    variant="secondary"
                  >
                    {t("orders.shipment.addTracking")}
                  </Button>
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
                              {t("orders.shipment.sendNotification")}
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
                            {t("orders.shipment.sendNotificationHint")}
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
          <RouteFocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteFocusModal.Close>
          <Button size="small" type="submit" isLoading={isMutating}>
            {t("actions.save")}
          </Button>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
