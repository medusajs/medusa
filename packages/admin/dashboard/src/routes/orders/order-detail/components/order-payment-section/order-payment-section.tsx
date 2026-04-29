import { OrderCreditLineDTO } from "@medusajs/types"
import { ArrowDownRightMini, DocumentText, XCircle } from "@medusajs/icons"
import { AdminOrder, AdminPayment, HttpTypes } from "@medusajs/types"
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
import { Trans, useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import DisplayId from "../../../../../components/common/display-id/display-id"
import { useCapturePayment } from "../../../../../hooks/api"
import { formatCurrency } from "../../../../../lib/format-currency"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getOrderPaymentStatus } from "../../../../../lib/order-helpers"
import { getPaymentsFromOrder } from "../../../../../lib/orders"
import { getTotalCaptured, getTotalPending } from "../../../../../lib/payment"
import { getLoyaltyPlugin } from "../../../../../lib/plugins"
import { ExtendedOrder, ExtendedRefund } from "../../constants"

type OrderPaymentSectionProps = {
  order: ExtendedOrder
  plugins: HttpTypes.AdminPlugin[]
}

export const OrderPaymentSection = ({
  order,
  plugins,
}: OrderPaymentSectionProps) => {
  const payments = getPaymentsFromOrder(order)

  const refunds = payments
    .map((payment) => payment?.refunds)
    .flat(1)
    .filter(Boolean) as ExtendedRefund[]

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />

      <PaymentBreakdown
        order={order}
        plugins={plugins}
        payments={payments}
        refunds={refunds}
        currencyCode={order.currency_code}
      />

      <Total order={order} />
    </Container>
  )
}

const Header = ({ order }: { order: ExtendedOrder }) => {
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
      <DocumentText className="text-ui-tag-neutral-icon ml-1 inline" />
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
          - {getLocaleAmount(refund.amount as number, currencyCode)}
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
  order: ExtendedOrder
  payment: HttpTypes.AdminPayment
  refunds: HttpTypes.AdminRefund[]
  currencyCode: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useCapturePayment(order.id, payment.id)

  const handleCapture = async () => {
    const res = await prompt({
      title: t("orders.payment.capture"),
      description: t("orders.payment.capturePayment", {
        amount: formatCurrency(payment.amount as number, currencyCode),
      }),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
      variant: "confirmation",
    })

    if (!res) {
      return
    }

    await mutateAsync(
      { amount: payment.amount as number },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.capturePaymentSuccess", {
              amount: formatCurrency(payment.amount as number, currencyCode),
            })
          )
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const getPaymentStatusAttributes = (payment: AdminPayment) => {
    if (payment.canceled_at) {
      return ["Canceled", "red"]
    } else if (payment.captured_at) {
      return ["Captured", "green"]
    } else {
      return ["Pending", "orange"]
    }
  }

  const [status, color] = getPaymentStatusAttributes(payment) as [
    string,
    "green" | "orange" | "red"
  ]

  const showCapture =
    payment.captured_at === null && payment.canceled_at === null

  const totalRefunded = (payment.refunds ?? []).reduce(
    (acc, next) => next.amount + acc,
    0
  )

  return (
    <div className="divide-y divide-dashed">
      <div className="text-ui-fg-subtle grid grid-cols-[1fr_1fr_1fr_20px] items-center gap-x-4 px-6 py-4 sm:grid-cols-[1fr_1fr_1fr_1fr_20px]">
        <div className="w-full min-w-[60px] overflow-hidden">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="truncate"
          >
            <DisplayId id={payment.id} />
          </Text>
          <Text size="small" leading="compact">
            {format(
              new Date(payment.created_at as string),
              "dd MMM, yyyy, HH:mm:ss"
            )}
          </Text>
        </div>
        <div className="hidden items-center justify-end sm:flex">
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
            {getLocaleAmount(payment.amount as number, payment.currency_code)}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("orders.payment.refund"),
                  icon: <XCircle />,
                  to: `/orders/${order.id}/refund?paymentId=${payment.id}`,
                  disabled:
                    !payment.captured_at ||
                    !!payment.canceled_at ||
                    totalRefunded >= payment.amount,
                },
              ],
            },
          ]}
        />
      </div>
      {showCapture && (
        <div className="bg-ui-bg-subtle flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-2">
            <ArrowDownRightMini className="text-ui-fg-muted shrink-0" />
            <Text size="small" leading="compact">
              <Trans
                i18nKey="orders.payment.isReadyToBeCaptured"
                components={[<DisplayId key={payment.id} id={payment.id} />]}
              />
            </Text>
          </div>

          <Button
            className="shrink-0"
            size="small"
            variant="secondary"
            onClick={handleCapture}
          >
            <span className="hidden sm:block">
              {t("orders.payment.capture")}
            </span>
            <span className="sm:hidden">
              {t("orders.payment.capture_short")}
            </span>
          </Button>
        </div>
      )}
      {refunds.map((refund) => (
        <Refund key={refund.id} refund={refund} currencyCode={currencyCode} />
      ))}
    </div>
  )
}

const CreditLine = ({
  creditLine,
  currencyCode,
  plugins,
}: {
  creditLine: OrderCreditLineDTO
  currencyCode: string
  plugins: HttpTypes.AdminPlugin[]
}) => {
  const loyaltyPlugin = getLoyaltyPlugin(plugins)

  if (!loyaltyPlugin) {
    return null
  }

  const prettyReference = creditLine.reference
    ?.split("_")
    .join(" ")
    .split("-")
    .join(" ")

  const prettyReferenceId = creditLine.reference_id ? (
    <DisplayId id={creditLine.reference_id} />
  ) : null

  return (
    <div className="divide-y divide-dashed">
      <div className="text-ui-fg-subtle grid grid-cols-[1fr_1fr_20px] items-center gap-x-4 px-6 py-4 sm:grid-cols-[1fr_1fr_1fr_20px]">
        <div className="w-full min-w-[60px] overflow-hidden">
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="truncate"
          >
            {loyaltyPlugin ? (
              <Text size="small" leading="compact" weight="plus">
                Store credit refund
              </Text>
            ) : (
              <DisplayId id={creditLine.id} />
            )}
          </Text>
          <Text size="small" leading="compact">
            {format(
              new Date(creditLine.created_at as unknown as string),
              "dd MMM, yyyy, HH:mm:ss"
            )}
          </Text>
        </div>
        <div className="hidden items-center justify-end sm:flex">
          <Text size="small" leading="compact" className="capitalize">
            {prettyReference} ({prettyReferenceId})
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small" leading="compact">
            {getLocaleAmount(creditLine.amount as number, currencyCode)}
          </Text>
        </div>
      </div>
    </div>
  )
}

const PaymentBreakdown = ({
  order,
  payments,
  refunds,
  currencyCode,
  plugins,
}: {
  order: ExtendedOrder
  payments: HttpTypes.AdminPayment[]
  refunds: ExtendedRefund[]
  currencyCode: string
  plugins: HttpTypes.AdminPlugin[]
}) => {
  /**
   * Refunds that are not associated with a payment.
   */
  const orderRefunds = refunds.filter((refund) => refund.payment_id === null)
  const creditLines = order.credit_lines ?? []
  const creditLineRefunds = creditLines.filter(
    (creditLine) => (creditLine.amount as number) < 0
  )

  const entries = [...orderRefunds, ...payments, ...creditLineRefunds]
    .sort((a, b) => {
      return (
        new Date(a.created_at as string).getTime() -
        new Date(b.created_at as string).getTime()
      )
    })
    .map((entry) => {
      let type = entry.id.startsWith("pay_") ? "payment" : "refund"

      if (entry.id.startsWith("ordcl_")) {
        type = "credit_line_refund"
      }

      return { event: entry, type }
    }) as (
    | { type: "payment"; event: HttpTypes.AdminPayment }
    | { type: "refund"; event: HttpTypes.AdminRefund }
    | {
        type: "credit_line_refund"
        event: OrderCreditLineDTO
      }
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
          case "credit_line_refund":
            return (
              <CreditLine
                key={event.id}
                creditLine={event}
                currencyCode={currencyCode}
                plugins={plugins}
              />
            )
        }
      })}
    </div>
  )
}

const Total = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()
  const totalPending = getTotalPending(order.payment_collections)

  return (
    <div className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Text size="small" weight="plus" leading="compact">
          {t("orders.payment.totalPaidByCustomer")}
        </Text>

        <Text size="small" weight="plus" leading="compact">
          {getStylizedAmount(
            getTotalCaptured(order.payment_collections),
            order.currency_code
          )}
        </Text>
      </div>

      {order.status !== "canceled" && totalPending > 0 && (
        <div className="flex items-center justify-between">
          <Text size="small" weight="plus" leading="compact">
            Total pending
          </Text>

          <Text size="small" weight="plus" leading="compact">
            {getStylizedAmount(totalPending, order.currency_code)}
          </Text>
        </div>
      )}
    </div>
  )
}
