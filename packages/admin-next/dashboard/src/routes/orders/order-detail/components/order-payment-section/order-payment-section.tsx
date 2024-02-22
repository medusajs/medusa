import { Payment as MedusaPayment, Order } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { format } from "date-fns"
import { getFormattedAmount } from "../../../../../lib/money-amount-helpers"

type OrderPaymentSectionProps = {
  order: Order
}

export const OrderPaymentSection = ({ order }: OrderPaymentSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header />
      <PaymentBreakdown payments={order.payments} />
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

/**
 * TODO:
 *
 * - Add capture and refund actions for the individual payments.
 * - Show refund for the individual payments.
 */
const Payment = ({ payment }: { payment: MedusaPayment }) => {
  const [status, color] = (
    payment.captured_at ? ["Captured", "green"] : ["Pending", "orange"]
  ) as [string, "green" | "orange"]

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-start">
      <div>
        <Text
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-base"
        >
          {payment.id}
        </Text>
        <Text size="small" leading="compact">
          {format(new Date(payment.created_at), "dd MMM, yyyy, HH:mm:ss")}
        </Text>
      </div>
      <div className="grid grid-cols-3 items-start">
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
      </div>
    </div>
  )
}

const PaymentBreakdown = ({ payments }: { payments: MedusaPayment[] }) => {
  return (
    <div className="flex flex-col gap-y-4 px-6 py-4">
      {payments.map((payment) => (
        <Payment key={payment.id} payment={payment} />
      ))}
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
