import { ArrowDownRightMini, DocumentText, XCircle } from "@medusajs/icons"
import {
  Payment as MedusaPayment,
  Refund as MedusaRefund,
} from "@medusajs/medusa"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useCapturePayment } from "../../../../../hooks/api"
import { formatCurrency } from "../../../../../lib/format-currency"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getOrderPaymentStatus } from "../../../../../lib/order-helpers"

type OrderPaymentSectionProps = {
  order: HttpTypes.AdminOrder
}

const getPaymentsFromOrder = (order: HttpTypes.AdminOrder) => {
  return order.payment_collections
    .map((collection: HttpTypes.AdminPaymentCollection) => collection.payments)
    .flat(1)
    .filter(Boolean)
}

export const OrderPaymentSection = ({ order }: OrderPaymentSectionProps) => {
  const payments = getPaymentsFromOrder(order)

  const refunds = payments
    .map((payment) => payment?.refunds)
    .flat(1)
    .filter(Boolean)

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />

      <PaymentBreakdown
        order={order}
        payments={payments}
        refunds={refunds}
        currencyCode={order.currency_code}
      />

      <Total payments={payments} currencyCode={order.currency_code} />
    </Container>
  )
}

const Header = ({ order }) => {
  const { t } = useTranslation()
  const { label, color } = getOrderPaymentStatus(t, order.payment_status)

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("orders.payment.title")}</Heading>

      <StatusBadge color={color} className="text-nowrap">
        {label}
      </StatusBadge>
    </div>
  )
}

const Refund = ({
  refund,
  currencyCode,
}: {
  refund: HttpTypes.AdminRefund
  currencyCode: string
}) => {
  const { t } = useTranslation()
  const RefundReasonBadge = refund?.refund_reason && (
    <Badge
      size="2xsmall"
      className="cursor-default select-none capitalize"
      rounded="full"
    >
      {refund.refund_reason.label}
    </Badge>
  )

  const RefundNoteIndicator = refund.note && (
    <Tooltip content={refund.note}>
      <DocumentText className="text-ui-tag-neutral-icon inline ml-1" />
    </Tooltip>
  )

  return (
    <div className="bg-ui-bg-subtle text-ui-fg-subtle grid grid-cols-[1fr_1fr_1fr_20px] items-center gap-x-4 px-6 py-4">
      <div className="flex flex-row">
        <div className="self-center pr-3">
          <ArrowDownRightMini className="text-ui-fg-muted" />
        </div>
        <div>
          <Text size="small" leading="compact" weight="plus">
            {t("orders.payment.refund")} {RefundNoteIndicator}
          </Text>
          <Text size="small" leading="compact">
            {format(new Date(refund.created_at), "dd MMM, yyyy, HH:mm:ss")}
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-end">{RefundReasonBadge}</div>
      <div className="flex items-center justify-end">
        <Text size="small" leading="compact">
          - {getLocaleAmount(refund.amount, currencyCode)}
        </Text>
      </div>
    </div>
  )
}

const Payment = ({
  order,
  payment,
  refunds,
  currencyCode,
}: {
  order: HttpTypes.AdminOrder
  payment: MedusaPayment
  refunds: MedusaRefund[]
  currencyCode: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useCapturePayment(payment.id)

  const handleCapture = async () => {
    const res = await prompt({
      title: t("orders.payment.capture"),
      description: t("orders.payment.capturePayment", {
        amount: formatCurrency(payment.amount, currencyCode),
      }),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
      variant: "confirmation",
    })

    if (!res) {
      return
    }

    await mutateAsync(
      { amount: payment.amount },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.capturePaymentSuccess", {
              amount: formatCurrency(payment.amount, currencyCode),
            })
          )
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const [status, color] = (
    payment.captured_at ? ["Captured", "green"] : ["Pending", "orange"]
  ) as [string, "green" | "orange"]

  const cleanId = payment.id.replace("pay_", "")
  const showCapture =
    payment.captured_at === null && payment.canceled_at === null

  return (
    <div className="divide-y divide-dashed">
      <div className="text-ui-fg-subtle grid grid-cols-[1fr_1fr_1fr_1fr_20px] items-center gap-x-4 px-6 py-4">
        <div className="w-full overflow-hidden">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="truncate"
          >
            {cleanId}
          </Text>
          <Text size="small" leading="compact">
            {format(new Date(payment.created_at), "dd MMM, yyyy, HH:mm:ss")}
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" leading="compact" className="capitalize">
            {payment.provider_id}
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <StatusBadge color={color} className="text-nowrap">
            {status}
          </StatusBadge>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" leading="compact">
            {getLocaleAmount(payment.amount, payment.currency_code)}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("orders.payment.refund"),
                  icon: <XCircle />,
                  to: `/orders/${order.id}/payments/${payment.id}/refund`,
                  disabled: !payment.captured_at,
                },
              ],
            },
          ]}
        />
      </div>
      {showCapture && (
        <div className="bg-ui-bg-subtle flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-2">
            <ArrowDownRightMini className="text-ui-fg-muted" />
            <Text size="small" leading="compact">
              {t("orders.payment.isReadyToBeCaptured", {
                id: cleanId,
              })}
            </Text>
          </div>

          <Button size="small" variant="secondary" onClick={handleCapture}>
            {t("orders.payment.capture")}
          </Button>
        </div>
      )}
      {refunds.map((refund) => (
        <Refund key={refund.id} refund={refund} currencyCode={currencyCode} />
      ))}
    </div>
  )
}

const PaymentBreakdown = ({
  order,
  payments,
  refunds,
  currencyCode,
}: {
  order: HttpTypes.AdminOrder
  payments: MedusaPayment[]
  refunds: MedusaRefund[]
  currencyCode: string
}) => {
  /**
   * Refunds that are not associated with a payment.
   */
  const orderRefunds = refunds.filter((refund) => refund.payment_id === null)

  const entries = [...orderRefunds, ...payments]
    .sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })
    .map((entry) => {
      return {
        event: entry,
        type: entry.id.startsWith("pay_") ? "payment" : "refund",
      }
    }) as (
    | { type: "payment"; event: MedusaPayment }
    | { type: "refund"; event: MedusaRefund }
  )[]

  return (
    <div className="flex flex-col divide-y divide-dashed">
      {entries.map(({ type, event }) => {
        switch (type) {
          case "payment":
            return (
              <Payment
                key={event.id}
                order={order}
                payment={event}
                refunds={refunds.filter(
                  (refund) => refund.payment_id === event.id
                )}
                currencyCode={currencyCode}
              />
            )
          case "refund":
            return (
              <Refund
                key={event.id}
                refund={event}
                currencyCode={currencyCode}
              />
            )
        }
      })}
    </div>
  )
}

const Total = ({
  payments,
  currencyCode,
}: {
  payments: MedusaPayment[]
  currencyCode: string
}) => {
  const { t } = useTranslation()

  const refunds = payments.map((payment) => payment.refunds).flat(1)
  const paid = payments.reduce((acc, payment) => acc + payment.amount, 0)
  const refunded = refunds.reduce(
    (acc, refund) => acc + (refund.amount || 0),
    0
  )

  const total = paid - refunded

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Text size="small" weight="plus" leading="compact">
        {t("orders.payment.totalPaidByCustomer")}
      </Text>
      <Text size="small" weight="plus" leading="compact">
        {getStylizedAmount(total, currencyCode)}
      </Text>
    </div>
  )
}
