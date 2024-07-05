import React, { useMemo } from "react"
import { Order, Payment } from "@medusajs/medusa"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import {
  Alert,
  Button,
  CurrencyInput,
  Select,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import {
  adminOrderKeys,
  useAdminPaymentsRefundPayment,
  useAdminRefundPayment,
} from "medusa-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateRefundSchema } from "../../schema"
import { castNumber } from "../../../../../lib/cast-number"
import { Form } from "../../../../../components/common/form"
import { getCurrencySymbol } from "../../../../../lib/currencies"
import { queryClient } from "../../../../../lib/medusa"
import {
  getDbAmount,
  getPresentationalAmount,
} from "../../../../../lib/money-amount-helpers"

const reasonOptions = [
  { label: "Discount", value: "discount" },
  { label: "Other", value: "other" },
]

type OrderRefundFormProps = {
  order: Order
  payment?: Payment
}

export function OrderRefundForm({ order, payment }: OrderRefundFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const isSpecificPaymentRefund = !!payment

  const refundable = useMemo(() => {
    return order.paid_total - order.refunded_total
  }, [order])

  const form = useForm<z.infer<typeof CreateRefundSchema>>({
    defaultValues: {
      amount: isSpecificPaymentRefund
        ? getPresentationalAmount(payment!.amount, order.currency_code)
        : "",
      note: "",
      reason: "",
      notification_enabled: !order.no_notification,
    },
    resolver: zodResolver(CreateRefundSchema),
  })

  let { mutateAsync: createOrderRefund, isLoading: isOrderRefundLoading } =
    useAdminRefundPayment(order.id)
  let { mutateAsync: createPaymentRefund, isLoading: isPaymentRefundLoading } =
    useAdminPaymentsRefundPayment(payment?.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    if (values.amount === "" || values.amount === undefined) {
      form.setError("amount", {
        type: "manual",
        message: t("Please enter an amount for refund"),
      })
      return
    }

    const amount = castNumber(values.amount)
    const dbAmount = getDbAmount(amount, order.currency_code)

    if (dbAmount > refundable) {
      form.setError("amount", {
        type: "manual",
        message: t("orders.refund.error.amountToLarge"),
      })
      return
    }

    if (amount < 0) {
      form.setError("amount", {
        type: "manual",
        message: t("orders.refund.error.amountNegative"),
      })
      return
    }

    const payload = {
      amount: dbAmount,
      note: values.note,
      reason: values.reason,
      no_notification: !values.notification_enabled,
    }

    const mutate = isSpecificPaymentRefund
      ? createPaymentRefund
      : createOrderRefund

    if (isSpecificPaymentRefund) {
      delete payload.no_notification
    }

    await mutate(payload)

    if (isSpecificPaymentRefund) {
      await queryClient.invalidateQueries(adminOrderKeys.detail(order.id))
    }

    handleSuccess()
  })

  const isSystemPayment = order.payments.some((p) => p.provider_id === "system")

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="size-full flex-1 overflow-auto">
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="amount"
              led={isSpecificPaymentRefund}
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.refundAmount")}</Form.Label>
                    <Form.Control>
                      <CurrencyInput
                        min={0}
                        max={refundable}
                        onValueChange={onChange}
                        code={order.currency_code}
                        symbol={getCurrencySymbol(order.currency_code)}
                        {...field}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="reason"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.reason")}</Form.Label>
                    <Form.Control>
                      <Select onValueChange={onChange} {...field}>
                        <Select.Trigger className="txt-small" ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {reasonOptions.map((i) => (
                            <Select.Item key={i.value} value={i.value}>
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

            {isSystemPayment && (
              <Alert variant="warning" dismissible className="mt-8 p-5">
                <div className="text-ui-fg-subtle txt-small pb-2 font-medium leading-[20px]">
                  {t("orders.refund.systemPayment")}
                </div>
                <Text className="text-ui-fg-subtle txt-small leading-normal">
                  {t("orders.refund.systemPaymentDesc")}
                </Text>
              </Alert>
            )}
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button
              type="submit"
              isLoading={isOrderRefundLoading || isPaymentRefundLoading}
              size="small"
            >
              {t("actions.complete")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}

export default OrderRefundForm
