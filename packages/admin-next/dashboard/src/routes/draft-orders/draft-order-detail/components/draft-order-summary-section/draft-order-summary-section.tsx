import { Buildings } from "@medusajs/icons"
import { Cart, DraftOrder, LineItem } from "@medusajs/medusa"
import { ReservationItemDTO } from "@medusajs/types"
import { Container, Copy, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useAdminReservations } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { Divider } from "../../../../../components/common/divider"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"

type DraftOrderSummarySectionProps = {
  draftOrder: DraftOrder
}

export const DraftOrderSummarySection = ({
  draftOrder,
}: DraftOrderSummarySectionProps) => {
  return (
    <Container className="divide-y divide-dashed p-0">
      <Header />
      <ItemBreakdown draftOrder={draftOrder} />
      <CostBreakdown draftOrder={draftOrder} />
      <Total draftOrder={draftOrder} />
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("orders.summary.allocateItems"),
                to: "#", // TODO: Open modal to allocate items
                icon: <Buildings />,
              },
            ],
          },
        ]}
      />
    </div>
  )
}

const CustomItem = ({
  item,
  currencyCode,
  reservation,
}: {
  item: {
    id: string
    title: string
    unit_price: number
    subtotal: number
    quantity: number
  }
  currencyCode: string
  reservation?: ReservationItemDTO | null
}) => {
  const { t } = useTranslation()

  return (
    <div
      key={item.id}
      className="text-ui-fg-subtle grid grid-cols-2 items-start gap-x-4 px-6 py-4"
    >
      <Text
        size="small"
        leading="compact"
        weight="plus"
        className="text-ui-fg-base"
      >
        {item.title}
      </Text>
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
          <Text size="small">{item.variant.title}</Text>
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

const ItemBreakdown = ({ draftOrder }: { draftOrder: DraftOrder }) => {
  const { reservations, isError, error } = useAdminReservations({
    line_item_id: draftOrder.cart.items.map((i) => i.id),
  })

  if (isError) {
    throw error
  }

  const variantBasedItems = draftOrder.cart.items.filter(
    (i) => i.variant_id !== null
  )

  const customItems = draftOrder.cart.items.filter((i) => i.variant_id === null)

  const showDivider = variantBasedItems.length > 0 && customItems.length > 0

  console.log("customItems", customItems)

  return (
    <div>
      {variantBasedItems.map((item) => {
        const reservation = reservations
          ? reservations.find((r) => r.line_item_id === item.id)
          : null

        return (
          <Item
            key={item.id}
            item={item}
            currencyCode={draftOrder.cart.region.currency_code}
            reservation={reservation}
          />
        )
      })}
      {showDivider && <Divider variant="dashed" />}
      {customItems.map((item) => {
        const reservation = reservations
          ? reservations.find((r) => r.line_item_id === item.id)
          : null

        return (
          <CustomItem
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              unit_price: item.unit_price,
              subtotal: item.unit_price * item.quantity,
              quantity: item.quantity,
            }}
            currencyCode={draftOrder.cart.region.currency_code}
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

const calculateCartTaxRate = (cart: Cart) => {
  const {
    tax_total,
    subtotal = 0,
    discount_total = 0,
    gift_card_total = 0,
    shipping_total = 0,
  } = cart

  const preTaxTotal =
    subtotal - discount_total - gift_card_total + shipping_total

  return ((tax_total || 0) / preTaxTotal) * 100
}

const CostBreakdown = ({ draftOrder }: { draftOrder: DraftOrder }) => {
  const { t } = useTranslation()

  // Calculate tax rate since it's not included in the cart
  const taxRate = calculateCartTaxRate(draftOrder.cart).toFixed(2)

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t("fields.subtotal")}
        secondaryValue={t("general.items", {
          count: draftOrder.cart.items.length,
        })}
        value={getLocaleAmount(
          draftOrder.cart.subtotal || 0,
          draftOrder.cart.region.currency_code
        )}
      />
      <Cost
        label={t("fields.discount")}
        secondaryValue={
          draftOrder.cart.discounts.length > 0
            ? draftOrder.cart.discounts.map((d) => d.code).join(", ")
            : "-"
        }
        value={
          (draftOrder.cart.discount_total || 0) > 0
            ? `- ${getLocaleAmount(
                draftOrder.cart.discount_total || 0,
                draftOrder.cart.region.currency_code
              )}`
            : "-"
        }
      />
      <Cost
        label={t("fields.shipping")}
        secondaryValue={draftOrder.cart.shipping_methods
          .map((sm) => sm.shipping_option.name)
          .join(", ")}
        value={getLocaleAmount(
          draftOrder.cart.shipping_total || 0,
          draftOrder.cart.region.currency_code
        )}
      />
      <Cost
        label={t("fields.tax")}
        secondaryValue={`${taxRate || 0} %`}
        value={
          draftOrder.cart.tax_total
            ? getLocaleAmount(
                draftOrder.cart.tax_total || 0,
                draftOrder.cart.region.currency_code
              )
            : "-"
        }
      />
    </div>
  )
}

const Total = ({ draftOrder }: { draftOrder: DraftOrder }) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-base flex items-center justify-between px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        {t("fields.total")}
      </Text>
      <Text size="small" leading="compact" weight="plus">
        {getStylizedAmount(
          draftOrder.cart.total || 0,
          draftOrder.cart.region.currency_code
        )}
      </Text>
    </div>
  )
}
