import { ArrowDownRightMini } from "@medusajs/icons"
import {
  Payment as MedusaPayment,
  Refund as MedusaRefund,
  Order,
} from "@medusajs/medusa"
import {
  Badge,
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
} from "@medusajs/ui"
import { format } from "date-fns"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { getFormattedAmount } from "../../../../../lib/money-amount-helpers"

type OrderPaymentSectionProps = {
  order: Order
}

export const OrderPaymentSection = ({ order }: OrderPaymentSectionProps) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header />
      <PaymentBreakdown
        payments={order.payments}
        refunds={order.refunds}
        currencyCode={order.currency_code}
      />
      <Total payments={order.payments} currencyCode={order.currency_code} />
    </Container>
  )
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">Payments</Heading>
    </div>
  )
}

const Refund = ({
  refund,
  currencyCode,
}: {
  refund: MedusaRefund
  currencyCode: string
}) => {
  const hasPayment = refund.payment_id !== null
  const cleanId = refund.id.replace("ref_", "")

  /**
   * If the refund is associated with a payment, we render it as a
   * subrow in the payment breakdown.
   */
  if (hasPayment) {
    return (
      <div className="bg-ui-bg-subtle px-6 py-4">
        <div className="flex items-center gap-x-2">
          <ArrowDownRightMini className="text-ui-fg-muted" />
          <Text size="small" leading="compact">
            Refund {cleanId} of {getFormattedAmount(refund.amount, "usd")}
          </Text>
        </div>
      </div>
    )
  }

  /**
   * If the refund is not associated with a payment, we render it as a
   * standalone row.
   */
  return (
    <div className="bg-ui-bg-subtle text-ui-fg-subtle grid grid-cols-4 gap-x-4 px-6 py-4">
      <div>
        <Text size="small" leading="compact" weight="plus">
          {cleanId}
        </Text>
        <Text size="small" leading="compact">
          {format(new Date(refund.created_at), "dd MMM, yyyy, HH:mm:ss")}
        </Text>
      </div>
      <div className="flex items-center justify-end">
        <Badge size="2xsmall" className="capitalize">
          {refund.reason}
        </Badge>
      </div>
      <div className="flex items-center justify-end">
        <Text size="small" leading="compact">
          {refund.reason}
        </Text>
      </div>
      <div className="flex items-center justify-end">
        <Text size="small" leading="compact">
          - {getFormattedAmount(refund.amount, currencyCode)}
        </Text>
      </div>
    </div>
  )
}

const Payment = ({
  payment,
  refunds,
  currencyCode,
}: {
  payment: MedusaPayment
  refunds: MedusaRefund[]
  currencyCode: string
}) => {
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
          <StatusBadge color={color}>{status}</StatusBadge>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" leading="compact">
            {getFormattedAmount(payment.amount, payment.currency_code)}
          </Text>
        </div>
        <ActionMenu groups={[]} />
      </div>
      {showCapture && (
        <div className="bg-ui-bg-subtle flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-2">
            <ArrowDownRightMini className="text-ui-fg-muted" />
            <Text size="small" leading="compact">
              Payment {cleanId} is ready to be captured
            </Text>
          </div>
          <Button size="small" variant="secondary">
            Capture
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
  payments,
  refunds,
  currencyCode,
}: {
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
  const paid = payments.reduce((acc, payment) => acc + payment.amount, 0)
  const refunded = payments.reduce(
    (acc, payment) => acc + (payment.amount_refunded || 0),
    0
  )

  const total = paid - refunded

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Text size="small" weight="plus" leading="compact">
        Total paid by customer
      </Text>
      <Text size="small" weight="plus" leading="compact">
        {getFormattedAmount(total, currencyCode)}
      </Text>
    </div>
  )
}
