import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  ArrowDownRightMini,
  ArrowLongRight,
  ArrowPath,
  ArrowUturnLeft,
  DocumentText,
  ExclamationCircle,
} from "@medusajs/icons"
import {
  AdminClaim,
  AdminExchange,
  AdminOrder,
  AdminOrderLineItem,
  AdminOrderPreview,
  AdminReturn,
  ReservationItemDTO,
} from "@medusajs/types"
import {
  Badge,
  Button,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  Tooltip,
} from "@medusajs/ui"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { ButtonMenu } from "../../../../../components/common/button-menu/button-menu.tsx"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useClaims } from "../../../../../hooks/api/claims.tsx"
import { useExchanges } from "../../../../../hooks/api/exchanges.tsx"
import { useOrderPreview } from "../../../../../hooks/api/orders.tsx"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import { useReturns } from "../../../../../hooks/api/returns"
import { useDate } from "../../../../../hooks/use-date"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getTotalCaptured } from "../../../../../lib/payment.ts"
import { CopyPaymentLink } from "../copy-payment-link/copy-payment-link.tsx"
import { getReturnableQuantity } from "../../../../../lib/rma.ts"

type OrderSummarySectionProps = {
  order: AdminOrder
}

function delay(t, val) {
  return new Promise((resolve) => setTimeout(resolve, t, val))
}

export const OrderSummarySection = ({ order }: OrderSummarySectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { reservations } = useReservationItems({
    line_item_id: order.items.map((i) => i.id),
  })

  const { order: orderPreview } = useOrderPreview(order.id!)

  const { returns = [] } = useReturns({
    status: "requested",
    order_id: order.id,
    fields: "+received_at",
  })

  const showReturns = !!returns.length

  /**
   * Show Allocation button only if there are unfulfilled items that don't have reservations
   */
  const showAllocateButton = useMemo(() => {
    if (!reservations) {
      return false
    }

    const reservationsMap = new Map(
      reservations.map((r) => [r.line_item_id, r.id])
    )

    for (const item of order.items) {
      // Inventory is managed
      if (item.variant?.manage_inventory) {
        // There are items that are unfulfilled
        if (item.quantity - item.detail.fulfilled_quantity > 0) {
          // Reservation for this item doesn't exist
          if (!reservationsMap.has(item.id)) {
            return true
          }
        }
      }
    }

    return false
  }, [reservations])

  const showPayment = (orderPreview?.summary?.pending_difference || 0) > 0
  const showRefund = (orderPreview?.summary?.pending_difference || 0) < 0

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} orderPreview={orderPreview} />
      <ItemBreakdown order={order} />
      <CostBreakdown order={order} />
      <Total order={order} />

      {(showAllocateButton || showReturns || showPayment) && (
        <div className="bg-ui-bg-subtle flex items-center justify-end rounded-b-xl px-4 py-4 gap-x-2">
          {showReturns && (
            <ButtonMenu
              groups={[
                {
                  actions: returns.map((r) => ({
                    label: t("orders.returns.receive.receive", {
                      label: `#${r.id.slice(-7)}`,
                    }),
                    icon: <ArrowLongRight />,
                    to: `/orders/${order.id}/returns/${r.id}/receive`,
                  })),
                },
              ]}
            >
              <Button variant="secondary" size="small">
                {t("orders.returns.receive.action")}
              </Button>
            </ButtonMenu>
          )}

          {showAllocateButton && (
            <Button
              onClick={() => navigate(`./allocate-items`)}
              variant="secondary"
            >
              {t("orders.allocateItems.action")}
            </Button>
          )}

          {showPayment && <CopyPaymentLink order={order} />}
        </div>
      )}
    </Container>
  )
}

const Header = ({
  order,
  orderPreview,
}: {
  order: AdminOrder
  orderPreview?: AdminOrderPreview
}) => {
  const { t } = useTranslation()

  // is ture if there is no shipped items ATM
  const shouldDisableReturn = order.items.every(
    (i) => !(getReturnableQuantity(i) > 0)
  )

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              // {
              //   label: t("orders.summary.editItems"),
              //   to: `/orders/${order.id}/edit`,
              //   icon: <PencilSquare />,
              // },
              // {
              //   label: t("orders.summary.allocateItems"),
              //   to: "#", // TODO: Open modal to allocate items
              //   icon: <Buildings />,
              // },
              {
                label: t("orders.returns.create"),
                to: `/orders/${order.id}/returns`,
                icon: <ArrowUturnLeft />,
                disabled:
                  shouldDisableReturn ||
                  !!orderPreview?.order_change?.exchange_id ||
                  !!orderPreview?.order_change?.claim_id,
              },
              {
                label:
                  orderPreview?.order_change?.id &&
                  orderPreview?.order_change?.exchange_id
                    ? t("orders.exchanges.manage")
                    : t("orders.exchanges.create"),
                to: `/orders/${order.id}/exchanges`,
                icon: <ArrowPath />,
                disabled:
                  shouldDisableReturn ||
                  (!!orderPreview?.order_change?.return_id &&
                    !!!orderPreview?.order_change?.exchange_id) ||
                  !!orderPreview?.order_change?.claim_id,
              },
              {
                label:
                  orderPreview?.order_change?.id &&
                  orderPreview?.order_change?.claim_id
                    ? t("orders.claims.manage")
                    : t("orders.claims.create"),
                to: `/orders/${order.id}/claims`,
                icon: <ExclamationCircle />,
                disabled:
                  shouldDisableReturn ||
                  (!!orderPreview?.order_change?.return_id &&
                    !!!orderPreview?.order_change?.claim_id) ||
                  !!orderPreview?.order_change?.exchange_id,
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
  returns,
  claims,
  exchanges,
}: {
  item: AdminOrderLineItem
  currencyCode: string
  reservation?: ReservationItemDTO | null
  returns: AdminReturn[]
  claims: AdminClaim[]
  exchanges: AdminExchange[]
}) => {
  const { t } = useTranslation()
  const isInventoryManaged = item.variant?.manage_inventory

  return (
    <>
      <div
        key={item.id}
        className="text-ui-fg-subtle grid grid-cols-2 items-center gap-x-4 px-6 py-4"
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

            {item.variant_sku && (
              <div className="flex items-center gap-x-1">
                <Text size="small">{item.variant_sku}</Text>
                <Copy content={item.variant_sku} className="text-ui-fg-muted" />
              </div>
            )}
            <Text size="small">
              {item.variant?.options?.map((o) => o.value).join(" · ")}
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
              <Text size="small">
                <span className="tabular-nums">{item.quantity}</span>x
              </Text>
            </div>

            <div className="overflow-visible">
              {isInventoryManaged && (
                <StatusBadge
                  color={reservation ? "green" : "orange"}
                  className="text-nowrap"
                >
                  {reservation
                    ? t("orders.reservations.allocatedLabel")
                    : t("orders.reservations.notAllocatedLabel")}
                </StatusBadge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Text size="small" className="pt-[1px]">
              {getLocaleAmount(item.subtotal || 0, currencyCode)}
            </Text>
          </div>
        </div>
      </div>

      {returns.map((r) => (
        <ReturnBreakdown key={r.id} orderReturn={r} itemId={item.id} />
      ))}

      {claims.map((claim) => (
        <ClaimBreakdown key={claim.id} claim={claim} itemId={item.id} />
      ))}

      {exchanges.map((exchange) => (
        <ExchangeBreakdown
          key={exchange.id}
          exchange={exchange}
          itemId={item.id}
        />
      ))}
    </>
  )
}

const ItemBreakdown = ({ order }: { order: AdminOrder }) => {
  const { reservations } = useReservationItems({
    line_item_id: order.items.map((i) => i.id),
  })

  const { claims = [] } = useClaims({
    order_id: order.id,
    fields: "*additional_items",
  })

  const { exchanges = [] } = useExchanges({
    order_id: order.id,
    fields: "*additional_items",
  })

  const { returns = [] } = useReturns({
    order_id: order.id,
    fields: "*items,*items.reason",
  })

  return (
    <div>
      {order.items?.map((item) => {
        const reservation = reservations
          ? reservations.find((r) => r.line_item_id === item.id)
          : null

        return (
          <Item
            key={item.id}
            item={item}
            currencyCode={order.currency_code}
            reservation={reservation}
            returns={returns}
            exchanges={exchanges}
            claims={claims}
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

const CostBreakdown = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t("fields.discount")}
        // TODO: DISCOUNTS -> moved to line items now
        // secondaryValue={
        //   order.discounts.length > 0
        //     ? order.discounts.map((d) => d.code).join(", ")
        //     : "-"
        // }
        value={
          order.discount_total > 0
            ? `- ${getLocaleAmount(order.discount_total, order.currency_code)}`
            : "-"
        }
      />
      <Cost
        label={t("fields.shipping")}
        secondaryValue={order.shipping_methods.map((sm) => sm.name).join(", ")}
        value={getLocaleAmount(order.shipping_total, order.currency_code)}
      />
    </div>
  )
}

const ReturnBreakdown = ({
  orderReturn,
  itemId,
}: {
  orderReturn: AdminReturn
  itemId: string
}) => {
  const { t } = useTranslation()
  const { getRelativeDate } = useDate()

  if (
    !["requested", "received", "partially_received"].includes(
      orderReturn.status || ""
    )
  ) {
    return null
  }

  const isRequested = orderReturn.status === "requested"
  const item = orderReturn?.items?.find((ri) => ri.item_id === itemId)

  return (
    item && (
      <div
        key={orderReturn.id}
        className="txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-subtle flex flex-row justify-between gap-y-2 border-b-2 border-t-2 border-dotted px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <ArrowDownRightMini className="text-ui-fg-muted" />
          <Text>
            {t(
              `orders.returns.${
                isRequested ? "returnRequestedInfo" : "returnReceivedInfo"
              }`,
              {
                requestedItemsCount:
                  item?.[isRequested ? "quantity" : "received_quantity"],
              }
            )}
          </Text>

          {item?.note && (
            <Tooltip content={item.note}>
              <DocumentText className="text-ui-tag-neutral-icon ml-1 inline" />
            </Tooltip>
          )}

          {item?.reason && (
            <Badge
              size="2xsmall"
              className="cursor-default select-none capitalize"
              rounded="full"
            >
              {item?.reason?.label}
            </Badge>
          )}
        </div>

        {orderReturn && (
          <Text size="small" leading="compact" className="text-ui-fg-muted">
            {getRelativeDate(
              isRequested ? orderReturn.created_at : orderReturn.received_at
            )}
          </Text>
        )}
      </div>
    )
  )
}

const ClaimBreakdown = ({
  claim,
  itemId,
}: {
  claim: AdminClaim
  itemId: string
}) => {
  const { t } = useTranslation()
  const { getRelativeDate } = useDate()
  const items = claim.additional_items.filter(
    (item) => item.item?.id === itemId
  )

  return (
    !!items.length && (
      <div
        key={claim.id}
        className="txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-subtle flex flex-row justify-between gap-y-2 border-b-2 border-t-2 border-dotted px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <ArrowDownRightMini className="text-ui-fg-muted" />
          <Text>
            {t(`orders.claims.outboundItemAdded`, {
              itemsCount: items.reduce(
                (acc, item) => (acc = acc + item.quantity),
                0
              ),
            })}
          </Text>
        </div>

        <Text size="small" leading="compact" className="text-ui-fg-muted">
          {getRelativeDate(claim.created_at)}
        </Text>
      </div>
    )
  )
}

const ExchangeBreakdown = ({
  exchange,
  itemId,
}: {
  exchange: AdminExchange
  itemId: string
}) => {
  const { t } = useTranslation()
  const { getRelativeDate } = useDate()
  const items = exchange.additional_items.filter(
    (item) => item?.item?.id === itemId
  )

  return (
    !!items.length && (
      <div
        key={exchange.id}
        className="txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-subtle flex flex-row justify-between gap-y-2 border-b-2 border-t-2 border-dotted px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <ArrowDownRightMini className="text-ui-fg-muted" />
          <Text>
            {t(`orders.exchanges.outboundItemAdded`, {
              itemsCount: items.reduce(
                (acc, item) => (acc = acc + item.quantity),
                0
              ),
            })}
          </Text>
        </div>

        <Text size="small" leading="compact" className="text-ui-fg-muted">
          {getRelativeDate(exchange.created_at)}
        </Text>
      </div>
    )
  )
}

const Total = ({ order }: { order: AdminOrder }) => {
  const { t } = useTranslation()

  return (
    <div className=" flex flex-col gap-y-2 px-6 py-4">
      <div className="text-ui-fg-base flex items-center justify-between">
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {t("fields.total")}
        </Text>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {getStylizedAmount(order.total, order.currency_code)}
        </Text>
      </div>

      <div className="text-ui-fg-base flex items-center justify-between">
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {t("fields.paidTotal")}
        </Text>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          {getStylizedAmount(
            getTotalCaptured(order.payment_collections || []),
            order.currency_code
          )}
        </Text>
      </div>

      <div className="text-ui-fg-base flex items-center justify-between">
        <Text
          className="text-ui-fg-subtle text-semibold"
          size="small"
          leading="compact"
        >
          {t("orders.returns.outstandingAmount")}
        </Text>
        <Text
          className="text-ui-fg-subtle text-bold"
          size="small"
          leading="compact"
        >
          {getStylizedAmount(
            order.summary.pending_difference || 0,
            order.currency_code
          )}
        </Text>
      </div>
    </div>
  )
}
