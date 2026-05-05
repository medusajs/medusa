import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  CurrencyInput,
  Label,
  Select,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { formatValue } from "react-currency-input-field"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useRefundPayment, useRefundReasons } from "../../../../../hooks/api"
import { currencies } from "../../../../../lib/data/currencies"
import { formatCurrency } from "../../../../../lib/format-currency"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { getPaymentsFromOrder } from "../../../../../lib/orders"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { formatProvider } from "../../../../../lib/format-provider.ts"

type CreateRefundFormProps = {
  order: HttpTypes.AdminOrder
}

const CreateRefundSchema = zod.object({
  amount: zod.object({
    value: zod.string().or(zod.number()),
    float: zod.number().or(zod.null()),
  }),
  note: zod.string().optional(),
  refund_reason_id: zod.string().optional(),
})

export const CreateRefundForm = ({ order }: CreateRefundFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { refund_reasons } = useRefundReasons()

  const [searchParams] = useSearchParams()
  const hasPaymentIdInSearchParams = !!searchParams.get("paymentId")
  const [paymentId, setPaymentId] = useState<string | undefined>(
    searchParams.get("paymentId") || undefined
  )
  const payments = getPaymentsFromOrder(order)
  const payment = payments.find((p) => p.id === paymentId)
  const paymentAmount = payment?.amount || 0

  const currency = useMemo(
    () => currencies[order.currency_code.toUpperCase()],
    [order.currency_code]
  )

  const direction = useDocumentDirection()
  const form = useForm<zod.infer<typeof CreateRefundSchema>>({
    defaultValues: {
      amount: {
        value: paymentAmount.toFixed(currency.decimal_digits),
        float: paymentAmount,
      },
    },
    resolver: zodResolver(CreateRefundSchema),
  })

  useEffect(() => {
    const pendingDifference = order.summary.pending_difference as number
    const paymentAmount = (payment?.amount || 0) as number
    const pendingAmount =
      pendingDifference < 0
        ? Math.min(Math.abs(pendingDifference), paymentAmount)
        : paymentAmount

    const normalizedAmount =
      pendingAmount < 0 ? pendingAmount * -1 : pendingAmount

    form.setValue("amount", {
      value: normalizedAmount.toFixed(currency.decimal_digits),
      float: normalizedAmount,
    })
  }, [payment?.id || ""])

  const { mutateAsync, isPending } = useRefundPayment(order.id, payment?.id!)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        amount: data.amount.float!,
        note: data.note,
        refund_reason_id: data.refund_reason_id,
      },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.refundPaymentSuccess", {
              amount: formatCurrency(
                data.amount.float!,
                payment?.currency_code!
              ),
            })
          )

          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex-1 overflow-auto">
          <div className="flex flex-col gap-y-4">
            {!hasPaymentIdInSearchParams && (
              <Select
                dir={direction}
                value={paymentId}
                onValueChange={(value) => {
                  setPaymentId(value)
                }}
              >
                <Label className="txt-compact-small mb-[-6px] font-sans font-medium">
                  {t("orders.payment.selectPaymentToRefund")}
                </Label>

                <Select.Trigger>
                  <Select.Value
                    placeholder={t("orders.payment.selectPaymentToRefund")}
                  />
                </Select.Trigger>

                <Select.Content>
                  {payments.map((payment) => {
                    const totalRefunded =
                      payment.refunds?.reduce(
                        (acc, next) => next.amount + acc,
                        0
                      ) || 0

                    return (
                      <Select.Item
                        value={payment!.id}
                        key={payment.id}
                        disabled={
                          !!payment.canceled_at ||
                          totalRefunded >= payment.amount
                        }
                        className="flex items-center justify-center"
                      >
                        <span>
                          {getLocaleAmount(
                            payment.amount as number,
                            payment.currency_code
                          )}
                          {" - "}
                        </span>
                        <span>{formatProvider(payment.provider_id)}</span>
                        <span> - (#{payment.id.substring(23)})</span>
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select>
            )}
            {hasPaymentIdInSearchParams && (
              <div className="flex items-center">
                <span>
                  {getLocaleAmount(
                    payment!.amount as number,
                    payment!.currency_code
                  )}
                </span>
                <span>&nbsp;-&nbsp;</span>
                <span>(#{payment!.id.substring(23)})</span>
              </div>
            )}

            <Form.Field
              control={form.control}
              name="amount"
              rules={{
                required: true,
                min: 0,
                max: paymentAmount,
              }}
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.amount")}</Form.Label>

                    <Form.Control>
                      <CurrencyInput
                        {...field}
                        min={0}
                        placeholder={formatValue({
                          value: "0",
                          decimalScale: currency.decimal_digits,
                        })}
                        decimalScale={currency.decimal_digits}
                        symbol={currency.symbol_native}
                        code={currency.code}
                        value={field.value.value}
                        onValueChange={(_value, _name, values) =>
                          onChange({
                            value: values?.value ?? "",
                            float: values?.float ?? null,
                          })
                        }
                        autoFocus
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="refund_reason_id"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.refundReason")}</Form.Label>

                    <Form.Control>
                      <Select
                        dir={direction}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>

                        <Select.Content>
                          {refund_reasons?.map((reason) => (
                            <Select.Item key={reason.id} value={reason.id}>
                              {reason.label}
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
              name={`note`}
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
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
              disabled={!!Object.keys(form.formState.errors || {}).length}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
