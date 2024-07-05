import { CreditCard, Trash } from "@medusajs/icons"
import { DraftOrder, Order } from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import {
  useAdminDeleteDraftOrder,
  useAdminDraftOrderRegisterPayment,
  useAdminStore,
} from "medusa-react"
import { useTranslation } from "react-i18next"

import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { InlineLink } from "../../../../../components/common/inline-link"
import { Skeleton } from "../../../../../components/common/skeleton"

type DraftOrderGeneralSectionProps = {
  draftOrder: DraftOrder
}

export const DraftOrderGeneralSection = ({
  draftOrder,
}: DraftOrderGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { color, label } = {
    open: {
      color: "orange",
      label: t("draftOrders.status.open"),
    },
    completed: {
      color: "green",
      label: t("draftOrders.status.completed"),
    },
  }[draftOrder.status] as { color: "green" | "orange"; label: string }

  const { mutateAsync } = useAdminDeleteDraftOrder(draftOrder.id)
  const { mutateAsync: markAsPaid } = useAdminDraftOrderRegisterPayment(
    draftOrder.id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("orders.cancelWarning", {
        id: `#${draftOrder.display_id}`,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
  }

  const handleMarkAsPaid = async () => {
    const res = await prompt({
      title: t("draftOrders.markAsPaid.warningTitle"),
      description: t("draftOrders.markAsPaid.warningDescription"),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
      variant: "confirmation",
    })

    if (!res) {
      return
    }

    await markAsPaid(undefined, {
      onSuccess: ({ order }) => {
        navigate(`/orders/${order.id}`)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="flex items-center gap-x-1">
            <Heading>#{draftOrder.display_id}</Heading>
            <Copy
              content={`#${draftOrder.display_id}`}
              className="text-ui-fg-muted"
            />
          </div>
          <Text size="small" className="text-ui-fg-subtle">
            {format(new Date(draftOrder.created_at), "dd MMM, yyyy, HH:mm:ss")}
          </Text>
        </div>
        <div className="flex items-center gap-x-4">
          <StatusBadge color={color}>{label}</StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("draftOrders.markAsPaid.label"),
                    onClick: handleMarkAsPaid,
                    icon: <CreditCard />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <OrderLink order={draftOrder.order} />
      {!draftOrder.order && <PaymentLink cartId={draftOrder.cart_id} />}
    </Container>
  )
}

const OrderLink = ({ order }: { order: Order | null }) => {
  const { t } = useTranslation()

  if (!order) {
    return null
  }

  return (
    <div className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.order")}
      </Text>
      <InlineLink to={`/orders/${order.id}`}>
        <Text size="small">{`#${order.display_id}`}</Text>
      </InlineLink>
    </div>
  )
}

const formatPaymentLink = (paymentLink: string, cartId: string) => {
  // Validate that the payment link template is valid
  if (!/{.*?}/.test(paymentLink)) {
    return null
  }

  return paymentLink.replace(/{.*?}/, cartId)
}

const PaymentLink = ({ cartId }: { cartId: string }) => {
  const { t } = useTranslation()
  const { store, isLoading, isError, error } = useAdminStore()

  /**
   * If the store has a payment link template, we format the payment link.
   * Otherwise, we display the cart id.
   */
  const paymentLink = store?.payment_link_template
    ? formatPaymentLink(store.payment_link_template, cartId)
    : null

  if (isError) {
    throw error
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4">
          <Skeleton className="w-[120px]" />
          <Skeleton className="w-full max-w-[190px]" />
        </div>
      )
    }

    if (paymentLink) {
      return (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("draftOrders.paymentLinkLabel")}
          </Text>
          <div className="flex w-full items-start gap-x-1 overflow-hidden">
            <InlineLink
              to={paymentLink}
              rel="noopener"
              target="_blank"
              className="w-fit overflow-hidden"
            >
              <Text size="small" className="truncate">
                {paymentLink}
              </Text>
            </InlineLink>
            <Copy className="text-ui-fg-muted" content={cartId} />
          </div>
        </div>
      )
    }

    return (
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start gap-x-4 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("draftOrders.cartIdLabel")}
        </Text>
        <div className="flex w-full items-start gap-x-1 overflow-hidden">
          <Text size="small" className="truncate">
            {cartId}
          </Text>
          <Copy className="text-ui-fg-muted" content={cartId} />
        </div>
      </div>
    )
  }

  return renderContent()
}
