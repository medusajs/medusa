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
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useRefundPayment } from "../../../../../hooks/api"
import { getCurrencySymbol } from "../../../../../lib/data/currencies"
import { formatCurrency } from "../../../../../lib/format-currency"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { getPaymentsFromOrder } from "../../../order-detail/components/order-payment-section"

type CreateRefundFormProps = {
  order: HttpTypes.AdminOrder
  refundReasons: HttpTypes.AdminRefundReason[]
}

const CreateRefundSchema = zod.object({
  amount: zod.number(),
  refund_reason_id: zod.string().nullish(),
  note: zod.string().optional(),
})

export const CreateRefundForm = ({
  order,
  refundReasons,
}: CreateRefundFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get("paymentId")
  const payments = getPaymentsFromOrder(order)
  const payment = payments.find((p) => p.id === paymentId)!
  const paymentAmount = (payment?.amount || 0) as number

  const form = useForm<zod.infer<typeof CreateRefundSchema>>({
    defaultValues: {
      amount: paymentAmount,
      note: "",
    },
    resolver: zodResolver(CreateRefundSchema),
  })

  useEffect(() => {
    const pendingDifference = order.summary.pending_difference as number
    const paymentAmount = (payment?.amount || 0) as number
    const pendingAmount =
      pendingDifference < 0
        ? Math.min(pendingDifference, paymentAmount)
        : paymentAmount

    const normalizedAmount =
      pendingAmount < 0 ? pendingAmount * -1 : pendingAmount

    form.setValue("amount", normalizedAmount as number)
  }, [payment])

  const { mutateAsync, isPending } = useRefundPayment(order.id, payment?.id!)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        amount: data.amount,
        refund_reason_id: data.refund_reason_id,
        note: data.note,
      },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.refundPaymentSuccess", {
              amount: formatCurrency(data.amount, payment?.currency_code!),
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
            <Select
              value={payment?.id}
              onValueChange={(value) => {
                navigate(`/orders/${order.id}/refund?paymentId=${value}`, {
                  replace: true,
                })
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
                {payments.map((payment) => (
                  <Select.Item value={payment!.id} key={payment.id}>
                    <span>
                      {getLocaleAmount(
                        payment.amount as number,
                        payment.currency_code
                      )}
                      {" - "}
                    </span>
                    <span>{payment.provider_id}</span>
                    <span> - ({payment.id.replace("pay_", "")})</span>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>

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
                        onChange={(e) => {
                          const val =
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)

                          onChange(val)

                          if (val && !isNaN(val)) {
                            if (val < 0 || val > paymentAmount) {
                              form.setError(`amount`, {
                                type: "manual",
                                message: t(
                                  "orders.payment.createRefundWrongQuantity",
                                  { number: paymentAmount }
                                ),
                              })
                            } else {
                              form.clearErrors(`amount`)
                            }
                          }
                        }}
                        code={order.currency_code}
                        symbol={getCurrencySymbol(order.currency_code)}
                        value={field.value}
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            {/* TODO: Bring this back when we have a refund reason management UI */}
            {/* <Form.Field
              control={form.control}
              name="refund_reason_id"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.refundReason")}</Form.Label>

                    <Form.Control>
                      <Combobox
                        {...field}
                        options={refundReasons.map((pp) => ({
                          label: upperCaseFirst(pp.label),
                          value: pp.id,
                        }))}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            /> */}

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
