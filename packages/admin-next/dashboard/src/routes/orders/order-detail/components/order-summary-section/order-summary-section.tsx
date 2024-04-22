import { Buildings, PencilSquare, ArrowUturnLeft } from "@medusajs/icons"
import { LineItem, Order } from "@medusajs/medusa"
import { ReservationItemDTO } from "@medusajs/types"
import { Container, Copy, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useAdminReservations } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"

type OrderSummarySectionProps = {
  order: Order
}

export const OrderSummarySection = ({ order }: OrderSummarySectionProps) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} />
      <ItemBreakdown order={order} />
      <CostBreakdown order={order} />
      <Total order={order} />
    </Container>
  )
}

const Header = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("orders.summary.editItems"),
                to: `/orders/${order.id}/edit`,
                icon: <PencilSquare />,
              },
              {
                label: t("orders.summary.allocateItems"),
                to: "#", // TODO: Open modal to allocate items
                icon: <Buildings />,
              },
              {
                label: t("orders.summary.requestReturn"),
                to: `/orders/${order.id}/returns`,
                icon: <ArrowUturnLeft />,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

const Item = ({
  item,
  currencyCode,
  reservation,
}: {
  item: LineItem
  currencyCode: string
  reservation?: ReservationItemDTO | null
}) => {
  const { t } = useTranslation()

  return (
    <div
      key={item.id}
      className="text-ui-fg-subtle grid grid-cols-2 items-start gap-x-4 px-6 py-4"
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
        <div className="flex items-center justify-end gap-x-4">
          <Text size="small">
            {getLocaleAmount(item.unit_price, currencyCode)}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="w-fit min-w-[27px]">
            <Text>
              <span className="tabular-nums">{item.quantity}</span>x
            </Text>
          </div>
          <div className="overflow-visible">
            <StatusBadge
              color={reservation ? "green" : "orange"}
              className="text-nowrap"
            >
              {reservation
                ? t("orders.reservations.allocatedLabel")
                : t("orders.reservations.notAllocatedLabel")}
            </StatusBadge>
          </div>
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

const ItemBreakdown = ({ order }: { order: Order }) => {
  const { reservations, isError, error } = useAdminReservations({
    line_item_id: order.items.map((i) => i.id),
  })

  if (isError) {
    throw error
  }

  return (
    <div>
      {order.items.map((item) => {
        const reservation = reservations
          ? reservations.find((r) => r.line_item_id === item.id)
          : null

        return (
          <Item
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
            reservation={reservation}
          />
        )
      })}
    </div>
  )
}

const Cost = ({
  label,
  value,
  secondaryValue,
}: {
  label: string
  value: string | number
  secondaryValue: string
}) => (
  <div className="grid grid-cols-3 items-center">
    <Text size="small" leading="compact">
      {label}
    </Text>
    <div className="text-right">
      <Text size="small" leading="compact">
        {secondaryValue}
      </Text>
    </div>
    <div className="text-right">
      <Text size="small" leading="compact">
        {value}
      </Text>
    </div>
  </div>
)

const CostBreakdown = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t("fields.subtotal")}
        secondaryValue={t("general.items", { count: order.items.length })}
        value={getLocaleAmount(order.subtotal, order.currency_code)}
      />
      <Cost
        label={t("fields.discount")}
        secondaryValue={
          order.discounts.length > 0
            ? order.discounts.map((d) => d.code).join(", ")
            : "-"
        }
        value={
          order.discount_total > 0
            ? `- ${getLocaleAmount(order.discount_total, order.currency_code)}`
            : "-"
        }
      />
      <Cost
        label={t("fields.shipping")}
        secondaryValue={order.shipping_methods
          .map((sm) => sm.shipping_option.name)
          .join(", ")}
        value={getLocaleAmount(order.shipping_total, order.currency_code)}
      />
      <Cost
        label={t("fields.tax")}
        secondaryValue={`${order.tax_rate || 0}%`}
        value={
          order.tax_total
            ? getLocaleAmount(order.tax_total, order.currency_code)
            : "-"
        }
      />
    </div>
  )
}

const Total = ({ order }: { order: Order }) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-base flex items-center justify-between px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.total")}
      </Text>
      <Text size="small" leading="compact" weight="plus">
        {getStylizedAmount(order.total, order.currency_code)}
      </Text>
    </div>
  )
}
