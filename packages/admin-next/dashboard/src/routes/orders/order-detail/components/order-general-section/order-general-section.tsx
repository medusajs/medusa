import { XCircle } from "@medusajs/icons"
import { Order } from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useAdminCancelOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type OrderGeneralSectionProps = {
  order: Order
}

export const OrderGeneralSection = ({ order }: OrderGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminCancelOrder(order.id)

  const handleCancel = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("orders.cancelOrderWarning", {
        id: `#${order.display_id}`,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
  }

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="flex items-center gap-x-1">
          <Heading>#{order.display_id}</Heading>
          <Copy content={`#${order.display_id}`} className="text-ui-fg-muted" />
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.onDateFromSalesChannel", {
            date: format(new Date(order.created_at), "dd MMM, yyyy, HH:mm:ss"),
            salesChannel: order.sales_channel.name,
          })}
        </Text>
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1.5">
          <PaymentBadge order={order} />
          <FulfillmentBadge order={order} />
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.cancel"),
                  onClick: handleCancel,
                  icon: <XCircle />,
                },
              ],
            },
          ]}
        />
      </div>
    </Container>
  )
}

const FulfillmentBadge = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const [label, color] = {
    not_fulfilled: [t("orders.fulfillmentStatus.notFulfilled"), "red"],
    partially_fulfilled: [
      t("orders.fulfillmentStatus.partiallyFulfilled"),
      "orange",
    ],
    fulfilled: [t("orders.fulfillmentStatus.fulfilled"), "green"],
    partially_shipped: [
      t("orders.fulfillmentStatus.partiallyShipped"),
      "orange",
    ],
    shipped: [t("orders.fulfillmentStatus.shipped"), "green"],
    partially_returned: [
      t("orders.fulfillmentStatus.partiallyReturned"),
      "orange",
    ],
    returned: [t("orders.fulfillmentStatus.returned"), "green"],
    canceled: [t("orders.fulfillmentStatus.canceled"), "red"],
    requires_action: [t("orders.fulfillmentStatus.requresAction"), "orange"],
  }[order.fulfillment_status] as [string, "red" | "orange" | "green"]

  return <StatusBadge color={color}>{label}</StatusBadge>
}

const PaymentBadge = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  const [label, color] = {
    not_paid: [t("orders.paymentStatus.notPaid"), "red"],
    awaiting: [t("orders.paymentStatus.awaiting"), "orange"],
    captured: [t("orders.paymentStatus.captured"), "green"],
    refunded: [t("orders.paymentStatus.refunded"), "green"],
    partially_refunded: [t("orders.paymentStatus.partiallyRefunded"), "orange"],
    canceled: [t("orders.paymentStatus.canceled"), "red"],
    requires_action: [t("orders.paymentStatus.requresAction"), "orange"],
  }[order.payment_status] as [string, "red" | "orange" | "green"]

  return <StatusBadge color={color}>{label}</StatusBadge>
}
