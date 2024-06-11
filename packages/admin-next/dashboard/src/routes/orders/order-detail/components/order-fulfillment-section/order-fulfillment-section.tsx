import { Buildings, XCircle } from "@medusajs/icons"
import { AdminOrder, FulfillmentDTO, OrderLineItemDTO } from "@medusajs/types"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  Tooltip,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Skeleton } from "../../../../../components/common/skeleton"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useStockLocation } from "../../../../../hooks/api/stock-locations"
import { formatProvider } from "../../../../../lib/format-provider"
import { getLocaleAmount } from "../../../../../lib/money-amount-helpers"
import { useCancelOrderFulfillment } from "../../../../../hooks/api/orders"

type OrderFulfillmentSectionProps = {
  order: AdminOrder
}

export const OrderFulfillmentSection = ({
  order,
}: OrderFulfillmentSectionProps) => {
  const fulfillments = order.fulfillments || []

  return (
    <div className="flex flex-col gap-y-3">
      <UnfulfilledItemBreakdown order={order} />
      {fulfillments.map((f, index) => (
        <Fulfillment key={f.id} index={index} fulfillment={f} order={order} />
      ))}
    </div>
  )
}

const UnfulfilledItem = ({
  item,
  currencyCode,
}: {
  item: OrderLineItemDTO & { variant: HttpTypes.AdminProductVariant }
  currencyCode: string
}) => {
  return (
    <div
      key={item.id}
      className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4"
    >
      <div className="flex items-start gap-x-4">
        <Thumbnail src={item.thumbnail} />
        <div>
          <Text
            size="small"
            leading="compact"
            weight="plus"
            className="text-ui-fg-base"
          >
            {item.title}
          </Text>
          {item.variant.sku && (
            <div className="flex items-center gap-x-1">
              <Text size="small">{item.variant.sku}</Text>
              <Copy content={item.variant.sku} className="text-ui-fg-muted" />
            </div>
          )}
          <Text size="small">
            {item.variant.options.map((o) => o.value).join(" · ")}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-3 items-center gap-x-4">
        <div className="flex items-center justify-end">
          <Text size="small">
            {getLocaleAmount(item.unit_price, currencyCode)}
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text>
            <span className="tabular-nums">
              {item.quantity - item.detail.fulfilled_quantity}
            </span>
            x
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small">
            {getLocaleAmount(item.subtotal || 0, currencyCode)}
          </Text>
        </div>
      </div>
    </div>
  )
}

const UnfulfilledItemBreakdown = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  // Create an array of order items that haven't been fulfilled or at least not fully fulfilled
  const unfulfilledItems = order.items!.filter(
    (i) => i.detail.fulfilled_quantity < i.quantity
  )

  if (!unfulfilledItems.length) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("orders.fulfillment.unfulfilledItems")}</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge color="red" className="text-nowrap">
            {t("orders.fulfillment.awaitingFulfillmentBadge")}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("orders.fulfillment.fulfillItems"),
                    icon: <Buildings />,
                    to: `/orders/${order.id}/fulfillment`,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div>
        {unfulfilledItems.map((item) => (
          <UnfulfilledItem
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
          />
        ))}
      </div>
    </Container>
  )
}

const Fulfillment = ({
  fulfillment,
  order,
  index,
}: {
  fulfillment: FulfillmentDTO
  order: AdminOrder
  index: number
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const showLocation = !!fulfillment.location_id

  const { stock_location, isError, error } = useStockLocation(
    fulfillment.location_id!,
    undefined,
    {
      enabled: showLocation,
    }
  )

  let statusText = "Fulfilled"
  let statusColor: "orange" | "green" | "red" = "orange"
  let statusTimestamp = fulfillment.created_at

  if (fulfillment.canceled_at) {
    statusText = "Canceled"
    statusColor = "red"
    statusTimestamp = fulfillment.canceled_at
  } else if (fulfillment.shipped_at) {
    statusText = "Shipped"
    statusColor = "green"
    statusTimestamp = fulfillment.shipped_at
  }

  const { mutateAsync } = useCancelOrderFulfillment(order.id, fulfillment.id)

  const handleCancel = async () => {
    if (fulfillment.shipped_at) {
      toast.warning(t("general.warning"), {
        description: t("orders.fulfillment.toast.fulfillmentShipped"),
        dismissLabel: t("actions.close"),
      })
      return
    }

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("orders.fulfillment.cancelWarning"),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (res) {
      try {
        await mutateAsync()

        toast.success(t("general.success"), {
          description: t("orders.fulfillment.toast.canceled"),
          dismissLabel: t("actions.close"),
        })
      } catch (e) {
        toast.error(t("general.error"), {
          description: e.message,
          dismissLabel: t("actions.close"),
        })
      }
    }
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {t("orders.fulfillment.number", {
            number: index + 1,
          })}
        </Heading>
        <div className="flex items-center gap-x-4">
          <Tooltip
            content={format(
              new Date(statusTimestamp),
              "dd MMM, yyyy, HH:mm:ss"
            )}
          >
            <StatusBadge color={statusColor} className="text-nowrap">
              {statusText}
            </StatusBadge>
          </Tooltip>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.cancel"),
                    icon: <XCircle />,
                    onClick: handleCancel,
                    disabled: !!fulfillment.canceled_at,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("orders.fulfillment.itemsLabel")}
        </Text>
        <ul>
          {fulfillment.items.map((f_item) => (
            <li key={f_item.line_item_id}>
              <Text size="small" leading="compact">
                {f_item.quantity}x {f_item.title}
              </Text>
            </li>
          ))}
        </ul>
      </div>
      {showLocation && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("orders.fulfillment.shippingFromLabel")}
          </Text>
          {stock_location ? (
            <Link
              to={`/settings/locations/${stock_location.id}`}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
            >
              <Text size="small" leading="compact">
                {stock_location.name}
              </Text>
            </Link>
          ) : (
            <Skeleton className="w-16" />
          )}
        </div>
      )}
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.provider")}
        </Text>

        <Text size="small" leading="compact">
          {formatProvider(fulfillment.provider_id)}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("orders.fulfillment.trackingLabel")}
        </Text>
        <div>
          {fulfillment.tracking_links &&
          fulfillment.tracking_links.length > 0 ? (
            <ul>
              {fulfillment.tracking_links.map((tlink) => {
                const hasUrl = tlink.url && tlink.url.length > 0

                if (hasUrl) {
                  return (
                    <li key={tlink.tracking_number}>
                      <a
                        href={tlink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
                      >
                        <Text size="small" leading="compact">
                          {tlink.tracking_number}
                        </Text>
                      </a>
                    </li>
                  )
                }

                return (
                  <li key={tlink.tracking_number}>
                    <Text size="small" leading="compact">
                      {tlink.tracking_number}
                    </Text>
                  </li>
                )
              })}
            </ul>
          ) : (
            <Text size="small" leading="compact">
              -
            </Text>
          )}
        </div>
      </div>
    </Container>
  )
}
