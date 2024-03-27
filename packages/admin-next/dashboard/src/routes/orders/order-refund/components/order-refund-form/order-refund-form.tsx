import React from "react"
import { Order } from "@medusajs/medusa"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { Button, Select, Switch, Text, Textarea } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { useAdminRefundPayment } from "medusa-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateRefundSchema } from "../../schema"
import { Form } from "../../../../../components/common/form"

type OrderRefundFormProps = {
  order: Order
}

export function OrderRefundForm({ order }: OrderRefundFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateRefundSchema>>({
    defaultValues: {
      amount: 0,
    },
    resolver: zodResolver(CreateRefundSchema),
  })

  const { mutateAsync, isLoading } = useAdminRefundPayment()

  const handleSumbit = form.handleSubmit(async (values) => {
    // await mutateAsync(values)

    handleSuccess()
  })
  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSumbit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full flex-1 overflow-auto">
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="reason"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.reason")}</Form.Label>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger
                          className="bg-ui-bg-base txt-small"
                          ref={ref}
                        >
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {[].map((i) => (
                            <Select.Item key={i.id} value={i.id}>
                              {i.label}
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

            <Form.Field
              control={form.control}
              name="note"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.note")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="notification_enabled"
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
                      {t("orders.refund.sendNotificationHint")}
                    </Form.Hint>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" isLoading={isLoading} size="small">
              {t("actions.complete")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}

export default OrderRefundForm
