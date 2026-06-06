import { zodResolver } from "@hookform/resolvers/zod"
import { AdminOrder, AdminPayment } from "@zjedene-medusa/types"
import {
  Button,
  clx,
  CurrencyInput,
  Divider,
  Label,
  RadioGroup,
  Select,
  Textarea,
  toast,
} from "@zjedene-medusa/ui"
import { useEffect, useMemo, useState } from "react"
import { formatValue } from "react-currency-input-field"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  useCreateOrderCreditLine,
  useRefundPayment,
} from "../../../../../hooks/api"
import { currencies } from "../../../../../lib/data/currencies"
import { formatCurrency } from "../../../../../lib/format-currency"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { getPaymentsFromOrder } from "../../../../../lib/orders"

const OrderBalanceSettlementSchema = zod.object({
  settlement_type: zod.enum(["credit_line", "refund"]),
  refund: zod
    .object({
      amount: zod.object({
        value: zod.string().or(zod.number()).optional(),
        float: zod.number().or(zod.null()),
      }),
      note: zod.string().optional(),
    })
    .optional(),
  credit_line: zod
    .object({
      amount: zod.object({
        value: zod.string().or(zod.number()).optional(),
        float: zod.number().or(zod.null()),
      }),
      note: zod.string().optional(),
    })
    .optional(),
})

export const OrderBalanceSettlementForm = ({
  order,
}: {
  order: AdminOrder
}) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { handleSuccess } = useRouteModal()
  const paymentId = searchParams.get("paymentId")
  const payments = getPaymentsFromOrder(order)
  const pendingDifference = order.summary.pending_difference * -1

  const [activePayment, setActivePayment] = useState<AdminPayment | null>(
    paymentId ? payments.find((p) => p.id === paymentId) || null : null
  )

  const form = useForm<zod.infer<typeof OrderBalanceSettlementSchema>>({
    defaultValues: {
      settlement_type: "refund",
      refund: {
        amount: {
          value: "",
          float: null,
        },
      },
      credit_line: {
        amount: {
          value: "",
          float: null,
        },
      },
    },
    resolver: zodResolver(OrderBalanceSettlementSchema),
  })

  const { mutateAsync: createCreditLine, isPending: isCreditLinePending } =
    useCreateOrderCreditLine(order.id)

  const { mutateAsync: createRefund, isPending: isRefundPending } =
    useRefundPayment(order.id, activePayment?.id!)

  const settlementType = form.watch("settlement_type")

  const handleSubmit = form.handleSubmit(async (data) => {
    if (data.settlement_type === "credit_line") {
      if (data.credit_line?.amount.float === null) {
        return
      }
      await createCreditLine(
        {
          amount: data.credit_line!.amount.float! * -1,
          reference: "refund",
          reference_id: order.id,
        },
        {
          onSuccess: () => {
            toast.success(t("orders.creditLines.createCreditLineSuccess"))

            handleSuccess()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    }

    if (data.settlement_type === "refund") {
      if (data.refund?.amount.float === null) {
        return
      }
      await createRefund(
        {
          amount: data.refund!.amount!.float!,
          note: data.refund!.note,
        },
        {
          onSuccess: () => {
            toast.success(
              t("orders.payment.refundPaymentSuccess", {
                amount: formatCurrency(
                  data.refund!.amount!.float!,
                  order.currency_code!
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
    }
  })

  const currency = useMemo(
    () => currencies[order.currency_code.toUpperCase()],
    [order.currency_code]
  )

  useEffect(() => {
    form.clearErrors()

    const _minimum = activePayment?.amount
      ? Math.min(pendingDifference, activePayment.amount)
      : pendingDifference

    const minimum = {
      value: _minimum.toFixed(currency.decimal_digits),
      float: _minimum,
    }

    if (settlementType === "refund") {
      form.setValue("refund.amount", minimum)
    }

    if (settlementType === "credit_line") {
      form.setValue("credit_line.amount", minimum)
    }
  }, [settlementType, activePayment, pendingDifference, form, currency])

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex-1 overflow-auto">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4">
              <Label className="txt-compact-small font-sans font-medium">
                {t("orders.balanceSettlement.settlementType")}
              </Label>

              <RadioGroup
                className="flex flex-col gap-y-3"
                value={settlementType}
                onValueChange={(value: "credit_line" | "refund") =>
                  form.setValue("settlement_type", value)
                }
              >
                <RadioGroup.ChoiceBox
                  value={"refund"}
                  description={t(
                    "orders.balanceSettlement.settlementTypes.paymentMethodDescription"
                  )}
                  label={t(
                    "orders.balanceSettlement.settlementTypes.paymentMethod"
                  )}
                  className={clx("basis-1/2")}
                />

                <RadioGroup.ChoiceBox
                  value={"credit_line"}
                  description={t(
                    "orders.balanceSettlement.settlementTypes.creditLineDescription"
                  )}
                  label={t(
                    "orders.balanceSettlement.settlementTypes.creditLine"
                  )}
                  className={clx("basis-1/2")}
                />
              </RadioGroup>
            </div>

            <Divider />

            {settlementType === "refund" && (
              <>
                <div className="flex flex-col gap-y-4">
                  <Select
                    defaultValue={activePayment?.id}
                    onValueChange={(value) => {
                      setActivePayment(payments.find((p) => p.id === value)!)
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
                          ) ?? 0

                        return (
                          <Select.Item
                            value={payment!.id}
                            key={payment.id}
                            disabled={
                              !!payment.canceled_at ||
                              totalRefunded >= payment.amount
                            }
                          >
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
                        )
                      })}
                    </Select.Content>
                  </Select>
                </div>

                <Form.Field
                  control={form.control}
                  name="refund.amount"
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
                  name={`refund.note`}
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
              </>
            )}

            {settlementType === "credit_line" && (
              <>
                <Form.Field
                  control={form.control}
                  name="credit_line.amount"
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
                            onValueChange={(_value, _name, values) => {
                              onChange({
                                value: values?.value ?? "",
                                float: values?.float ?? null,
                              })
                            }}
                            autoFocus
                          />
                        </Form.Control>

                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </>
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
              isLoading={isCreditLinePending || isRefundPending}
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
