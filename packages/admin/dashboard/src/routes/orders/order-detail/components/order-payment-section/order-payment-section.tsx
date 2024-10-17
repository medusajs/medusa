import { ArrowDownRightMini, DocumentText, XCircle } from "@medusajs/icons"
import { AdminPaymentCollection, HttpTypes } from "@medusajs/types"
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
import { useCapturePayment } from "../../../../../hooks/api"
import { formatCurrency } from "../../../../../lib/format-currency"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getOrderPaymentStatus } from "../../../../../lib/order-helpers"
import { getTotalCaptured, getTotalPending } from "../../../../../lib/payment"
import DisplayId from "../../../../../components/common/display-id/display-id"

type OrderPaymentSectionProps = {
  order: HttpTypes.AdminOrder
}

export const getPaymentsFromOrder = (order: HttpTypes.AdminOrder) => {
  return order.payment_collections
    .map((collection: HttpTypes.AdminPaymentCollection) => collection.payments)
    .flat(1)
    .filter(Boolean) as HttpTypes.AdminPayment[]
}

export const OrderPaymentSection = ({ order }: OrderPaymentSectionProps) => {
  const payments = getPaymentsFromOrder(order)

  const refunds = payments
    .map((payment) => payment?.refunds)
    .flat(1)
    .filter(Boolean) as HttpTypes.AdminRefund[]

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />

      <PaymentBreakdown
        order={order}
        payments={payments}
        refunds={refunds}
        currencyCode={order.currency_code}
      />

      <Total
        paymentCollections={order.payment_collections}
        currencyCode={order.currency_code}
      />
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
  order: HttpTypes.AdminOrder
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

  const [status, color] = (
    payment.captured_at ? ["Captured", "green"] : ["Pending", "orange"]
  ) as [string, "green" | "orange"]

  const showCapture =
    payment.captured_at === null && payment.canceled_at === null

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
            <ArrowDownRightMini className="text-ui-fg-muted shrink-0" />
            <Text size="small" leading="compact">
              <Trans
                i18nKey="orders.payment.isReadyToBeCaptured"
                components={[<DisplayId id={payment.id} />]}
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

const PaymentBreakdown = ({
  order,
  payments,
  refunds,
  currencyCode,
}: {
  order: HttpTypes.AdminOrder
  payments: HttpTypes.AdminPayment[]
  refunds: HttpTypes.AdminRefund[]
  currencyCode: string
}) => {
  /**
   * Refunds that are not associated with a payment.
   */
  const orderRefunds = refunds.filter((refund) => refund.payment_id === null)

  const entries = [...orderRefunds, ...payments]
    .sort((a, b) => {
      return (
        new Date(a.created_at as string).getTime() -
        new Date(b.created_at as string).getTime()
      )
    })
    .map((entry) => {
      return {
        event: entry,
        type: entry.id.startsWith("pay_") ? "payment" : "refund",
      }
    }) as (
    | { type: "payment"; event: HttpTypes.AdminPayment }
    | { type: "refund"; event: HttpTypes.AdminRefund }
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
  paymentCollections,
  currencyCode,
}: {
  paymentCollections: AdminPaymentCollection[]
  currencyCode: string
}) => {
  const { t } = useTranslation()
  const totalPending = getTotalPending(paymentCollections)

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("orders.payment.totalPaidByCustomer")}
        </Text>

        <Text size="small" weight="plus" leading="compact">
          {getStylizedAmount(
            getTotalCaptured(paymentCollections),
            currencyCode
          )}
        </Text>
      </div>

      {totalPending > 0 && (
        <div className="flex items-center justify-between px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            Total pending
          </Text>

          <Text size="small" weight="plus" leading="compact">
            {getStylizedAmount(totalPending, currencyCode)}
          </Text>
        </div>
      )}
    </div>
  )
}
