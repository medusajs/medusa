import { ArrowDownRightMini, XCircle } from "@medusajs/icons"
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
  Tooltip,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"

type OrderPaymentSectionProps = {
  order: Order
}

export const OrderPaymentSection = ({ order }: OrderPaymentSectionProps) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />
      <PaymentBreakdown
        payments={order.payments}
        refunds={order.refunds}
        currencyCode={order.currency_code}
      />
      <Total payments={order.payments} currencyCode={order.currency_code} />
    </Container>
  )
}

const Header = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const hasCapturedPayment = order.payments.some((p) => !!p.captured_at)

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("orders.payment.title")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("orders.payment.refund"),
                icon: <ArrowDownRightMini />,
                to: `/orders/${order.id}/refund`,
                disabled: !hasCapturedPayment,
              },
            ],
          },
        ]}
      />
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
  const { t } = useTranslation()
  const hasPayment = refund.payment_id !== null

  const BadgeComponent = (
    <Badge size="2xsmall" className="cursor-default select-none capitalize">
      {refund.reason}
    </Badge>
  )

  const Render = refund.note ? (
    <Tooltip content={refund.note}>{BadgeComponent}</Tooltip>
  ) : (
    BadgeComponent
  )

  return (
    <div className="bg-ui-bg-subtle text-ui-fg-subtle grid grid-cols-[1fr_1fr_1fr_1fr_20px] items-center gap-x-4 px-6 py-4">
      <div>
        {hasPayment && <ArrowDownRightMini className="text-ui-fg-muted" />}
        <Text size="small" leading="compact" weight="plus">
          {t("orders.payment.refund")}
        </Text>
      </div>
      <div className="flex items-center justify-end">
        <Text size="small" leading="compact">
          {format(new Date(refund.created_at), "dd MMM, yyyy, HH:mm:ss")}
        </Text>
      </div>
      <div className="flex items-center justify-end">{Render}</div>
      <div className="flex items-center justify-end">
        <Text size="small" leading="compact">
          - {getLocaleAmount(refund.amount, currencyCode)}
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
  const { t } = useTranslation()

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
                  to: `/orders/${payment.order_id}/refund?paymentId=${payment.id}`,
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
          <Button size="small" variant="secondary">
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
  const { t } = useTranslation()

  const paid = payments.reduce((acc, payment) => acc + payment.amount, 0)
  const refunded = payments.reduce(
    (acc, payment) => acc + (payment.amount_refunded || 0),
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
