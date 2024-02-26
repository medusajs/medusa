import {
  LineItem,
  Fulfillment as MedusaFulfillment,
  Order,
} from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  Tooltip,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useAdminStockLocation } from "medusa-react"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Skeleton } from "../../../../../components/common/skeleton"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { getFormattedAmount } from "../../../../../lib/money-amount-helpers"

type OrderFulfillmentSectionProps = {
  order: Order
}

export const OrderFulfillmentSection = ({
  order,
}: OrderFulfillmentSectionProps) => {
  const fulfillments = order.fulfillments || []

  return (
    <div className="flex flex-col gap-y-2">
      <UnfulfilledItemBreakdown order={order} />
      {fulfillments.map((f, index) => (
        <Fulfillment key={f.id} index={index} fulfillment={f} />
      ))}
    </div>
  )
}

const UnfulfilledItem = ({
  item,
  currencyCode,
}: {
  item: LineItem
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
            {getFormattedAmount(item.unit_price, currencyCode)}
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text>
            <span className="tabular-nums">{item.quantity}</span>x
          </Text>
        </div>
        <div className="flex items-center justify-end">
          <Text size="small">
            {getFormattedAmount(item.subtotal || 0, currencyCode)}
          </Text>
        </div>
      </div>
    </div>
  )
}

const UnfulfilledItemBreakdown = ({ order }: { order: Order }) => {
  const fulfillmentItems = order.fulfillments?.map((f) =>
    f.items.map((i) => ({ id: i.item_id, quantity: i.quantity }))
  )

  // Create an array of order items that haven't been fulfilled or at least not fully fulfilled
  const unfulfilledItems = order.items.filter(
    (i) =>
      !fulfillmentItems?.some((fi) =>
        fi.some((f) => f.id === i.id && f.quantity === i.quantity)
      )
  )

  if (!unfulfilledItems.length) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Unfulfilled items</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge color="red">Awaiting Fulfillment</StatusBadge>
          <ActionMenu groups={[]} />
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
  index,
}: {
  fulfillment: MedusaFulfillment
  index: number
}) => {
  const showLocation = !!fulfillment.location_id

  const { stock_location, isError, error } = useAdminStockLocation(
    fulfillment.location_id!,
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

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Fulfillment #{index + 1}</Heading>
        <div className="flex items-center gap-x-4">
          <Tooltip
            content={format(
              new Date(statusTimestamp),
              "dd MMM, yyyy, HH:mm:ss"
            )}
          >
            <StatusBadge color={statusColor}>{statusText}</StatusBadge>
          </Tooltip>
          <ActionMenu groups={[]} />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Items
        </Text>
        <ul>
          {fulfillment.items.map((f_item) => (
            <li key={f_item.item_id}>
              <Text size="small" leading="compact">
                {f_item.item.quantity}x {f_item.item.title}
              </Text>
            </li>
          ))}
        </ul>
      </div>
      {showLocation && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            Shipping from
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Tracking
        </Text>
        <div>
          {fulfillment.tracking_links ? (
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
