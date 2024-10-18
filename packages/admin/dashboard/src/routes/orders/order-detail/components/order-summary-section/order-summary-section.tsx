import { ReactNode, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  ArrowDownRightMini,
  ArrowLongRight,
  ArrowPath,
  ArrowUturnLeft,
  DocumentText,
  ExclamationCircle,
  PencilSquare,
  TriangleDownMini,
} from "@medusajs/icons"
import {
  AdminClaim,
  AdminExchange,
  AdminOrder,
  AdminOrderLineItem,
  AdminOrderPreview,
  AdminRegion,
  AdminReturn,
} from "@medusajs/types"
import {
  Badge,
  Button,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  toast,
  Tooltip,
  usePrompt,
  clx,
} from "@medusajs/ui"

import { AdminPaymentCollection } from "../../../../../../../../core/types/dist/http/payment/admin/entities"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { ButtonMenu } from "../../../../../components/common/button-menu/button-menu"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useClaims } from "../../../../../hooks/api/claims"
import { useExchanges } from "../../../../../hooks/api/exchanges"
import { useOrderPreview } from "../../../../../hooks/api/orders"
import { useMarkPaymentCollectionAsPaid } from "../../../../../hooks/api/payment-collections"
import { useReservationItems } from "../../../../../hooks/api/reservations"
import { useReturns } from "../../../../../hooks/api/returns"
import { useDate } from "../../../../../hooks/use-date"
import { formatCurrency } from "../../../../../lib/format-currency"
import {
  getLocaleAmount,
  getStylizedAmount,
} from "../../../../../lib/money-amount-helpers"
import { getTotalCaptured } from "../../../../../lib/payment"
import { getReturnableQuantity } from "../../../../../lib/rma"
import { CopyPaymentLink } from "../copy-payment-link/copy-payment-link"
import ReturnInfoPopover from "./return-info-popover"
import ShippingInfoPopover from "./shipping-info-popover"
import { AdminReservation } from "@medusajs/types/src/http"

type OrderSummarySectionProps = {
  order: AdminOrder
}

export const OrderSummarySection = ({ order }: OrderSummarySectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { reservations } = useReservationItems(
    {
      line_item_id: order?.items?.map((i) => i.id),
    },
    { enabled: Array.isArray(order?.items) }
  )

  const { order: orderPreview } = useOrderPreview(order.id!)

  const { returns = [] } = useReturns({
    status: "requested",
    order_id: order.id,
    fields: "+received_at",
  })

  const receivableReturns = useMemo(
    () => returns.filter((r) => !r.canceled_at),
    [returns]
  )

  const showReturns = !!receivableReturns.length

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

  const unpaidPaymentCollection = order.payment_collections.find(
    (pc) => pc.status === "not_paid"
  )

  const { mutateAsync: markAsPaid } = useMarkPaymentCollectionAsPaid(
    order.id,
    unpaidPaymentCollection?.id!
  )

  const showPayment =
    unpaidPaymentCollection && (order?.summary?.pending_difference || 0) > 0
  const showRefund = (order?.summary?.pending_difference || 0) < 0

  const handleMarkAsPaid = async (
    paymentCollection: AdminPaymentCollection
  ) => {
    const res = await prompt({
      title: t("orders.payment.markAsPaid"),
      description: t("orders.payment.markAsPaidPayment", {
        amount: formatCurrency(
          paymentCollection.amount as number,
          order.currency_code
        ),
      }),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
      variant: "confirmation",
    })

    if (!res) {
      return
    }

    await markAsPaid(
      { order_id: order.id },
      {
        onSuccess: () => {
          toast.success(
            t("orders.payment.markAsPaidPaymentSuccess", {
              amount: formatCurrency(
                paymentCollection.amount as number,
                order.currency_code
              ),
            })
          )
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <Container className="divide-y divide-dashed p-0">
      <Header order={order} orderPreview={orderPreview} />
      <ItemBreakdown order={order} reservations={reservations!} />
      <CostBreakdown order={order} />
      <Total order={order} />

      {(showAllocateButton || showReturns || showPayment || showRefund) && (
        <div className="bg-ui-bg-subtle flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
          {showReturns &&
            (receivableReturns.length === 1 ? (
              <Button
                onClick={() =>
                  navigate(
                    `/orders/${order.id}/returns/${receivableReturns[0].id}/receive`
                  )
                }
                variant="secondary"
                size="small"
              >
                {t("orders.returns.receive.action")}
              </Button>
            ) : (
              <ButtonMenu
                groups={[
                  {
                    actions: receivableReturns.map((r) => {
                      let id = r.id
                      let returnType = "Return"

                      if (r.exchange_id) {
                        id = r.exchange_id
                        returnType = "Exchange"
                      }

                      if (r.claim_id) {
                        id = r.claim_id
                        returnType = "Claim"
                      }

                      return {
                        label: t("orders.returns.receive.receiveItems", {
                          id: `#${id.slice(-7)}`,
                          returnType,
                        }),
                        icon: <ArrowLongRight />,
                        to: `/orders/${order.id}/returns/${r.id}/receive`,
                      }
                    }),
                  },
                ]}
              >
                <Button variant="secondary" size="small">
                  {t("orders.returns.receive.action")}
                </Button>
              </ButtonMenu>
            ))}

          {showAllocateButton && (
            <Button
              onClick={() => navigate(`./allocate-items`)}
              variant="secondary"
            >
              {t("orders.allocateItems.action")}
            </Button>
          )}

          {showPayment && (
            <CopyPaymentLink
              paymentCollection={unpaidPaymentCollection}
              order={order}
            />
          )}

          {showPayment && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleMarkAsPaid(unpaidPaymentCollection)}
            >
              {t("orders.payment.markAsPaid")}
            </Button>
          )}

          {showRefund && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => navigate(`/orders/${order.id}/refund`)}
            >
              {t("orders.payment.refundAmount", {
                amount: getStylizedAmount(
                  (order?.summary?.pending_difference || 0) * -1,
                  order?.currency_code
                ),
              })}
            </Button>
          )}
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

  const isOrderEditActive = orderPreview?.order_change?.change_type === "edit"
  // State where creation of order edit was interrupted i.e. order edit is drafted but not confirmed
  const isOrderEditPending =
    orderPreview?.order_change?.change_type === "edit" &&
    orderPreview?.order_change?.status === "pending"

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.summary")}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t(
                  isOrderEditPending
                    ? "orders.summary.editOrderContinue"
                    : "orders.summary.editOrder"
                ),
                to: `/orders/${order.id}/edits`,
                icon: <PencilSquare />,
                disabled:
                  (orderPreview?.order_change &&
                    orderPreview?.order_change?.change_type !== "edit") ||
                  (orderPreview?.order_change?.change_type === "edit" &&
                    orderPreview?.order_change?.status === "requested"),
              },
            ],
          },
          {
            actions: [
              {
                label: t("orders.returns.create"),
                to: `/orders/${order.id}/returns`,
                icon: <ArrowUturnLeft />,
                disabled:
                  shouldDisableReturn ||
                  isOrderEditActive ||
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
                  isOrderEditActive ||
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
                  isOrderEditActive ||
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
  reservation?: AdminReservation
  returns: AdminReturn[]
  claims: AdminClaim[]
  exchanges: AdminExchange[]
}) => {
  const { t } = useTranslation()

  const isInventoryManaged = item.variant?.manage_inventory
  const hasInventoryKit =
    isInventoryManaged && (item.variant?.inventory_items?.length || 0) > 1
  const hasUnfulfilledItems = item.quantity - item.detail.fulfilled_quantity > 0

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
              {isInventoryManaged && hasUnfulfilledItems && (
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

      {hasInventoryKit && <InventoryKitBreakdown item={item} />}

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

const ItemBreakdown = ({
  order,
  reservations,
}: {
  order: AdminOrder
  reservations?: AdminReservation[]
}) => {
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

  const reservationsMap = useMemo(
    () => new Map((reservations || []).map((r) => [r.line_item_id, r])),
    [reservations]
  )

  return (
    <div>
      {order.items?.map((item) => {
        const reservation = reservationsMap.get(item.id)

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
  tooltip,
}: {
  label: ReactNode
  value: string | number
  secondaryValue?: string
  tooltip?: ReactNode
}) => (
  <div className="grid grid-cols-3 items-center">
    <Text size="small" leading="compact">
      {label} {tooltip}
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

const CostBreakdown = ({
  order,
}: {
  order: AdminOrder & { region: AdminRegion }
}) => {
  const { t } = useTranslation()
  const [isTaxOpen, setIsTaxOpen] = useState(false)
  const [isShippingOpen, setIsShippingOpen] = useState(false)

  const discountCodes = useMemo(() => {
    const codes = new Set()
    order.items.forEach((item) =>
      item.adjustments?.forEach((adj) => {
        codes.add(adj.code)
      })
    )

    return Array.from(codes).sort()
  }, [order])

  const taxCodes = useMemo(() => {
    const taxCodeMap = {}

    order.items.forEach((item) => {
      item.tax_lines?.forEach((line) => {
        taxCodeMap[line.code] = (taxCodeMap[line.code] || 0) + line.total
      })
    })

    order.shipping_methods.forEach((sm) => {
      sm.tax_lines?.forEach((line) => {
        taxCodeMap[line.code] = (taxCodeMap[line.code] || 0) + line.total
      })
    })

    return taxCodeMap
  }, [order])

  const automaticTaxesOn = !!order.region!.automatic_taxes
  const hasTaxLines = !!Object.keys(taxCodes).length

  const discountTotal = automaticTaxesOn
    ? order.discount_total
    : order.discount_subtotal

  return (
    <div className="text-ui-fg-subtle flex flex-col gap-y-2 px-6 py-4">
      <Cost
        label={t(
          automaticTaxesOn
            ? "orders.summary.itemTotal"
            : "orders.summary.itemSubtotal"
        )}
        value={getLocaleAmount(order.item_total, order.currency_code)}
      />
      <Cost
        label={
          <div
            onClick={() => setIsShippingOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-1"
          >
            <span>
              {t(
                automaticTaxesOn
                  ? "orders.summary.shippingTotal"
                  : "orders.summary.shippingSubtotal"
              )}
            </span>
            <TriangleDownMini
              style={{
                transform: `rotate(${isShippingOpen ? 0 : -90}deg)`,
              }}
            />
          </div>
        }
        value={getLocaleAmount(
          automaticTaxesOn ? order.shipping_total : order.shipping_subtotal,
          order.currency_code
        )}
      />

      {isShippingOpen && (
        <div className="flex flex-col gap-1 pl-5">
          {(order.shipping_methods || [])
            .sort((m1, m2) =>
              (m1.created_at as string).localeCompare(m2.created_at as string)
            )
            .map((sm, i) => {
              return (
                <div
                  key={sm.id}
                  className="flex items-center justify-between gap-x-2"
                >
                  <div>
                    <span className="txt-small text-ui-fg-subtle font-medium">
                      {sm.name}
                      {sm.detail.return_id &&
                        ` (${t("fields.returnShipping")})`}{" "}
                      <ShippingInfoPopover key={i} shippingMethod={sm} />
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
                  </div>
                  <span className="txt-small text-ui-fg-muted">
                    {getLocaleAmount(
                      automaticTaxesOn ? sm.total : sm.subtotal,
                      order.currency_code
                    )}
                  </span>
                </div>
              )
            })}
        </div>
      )}

      <Cost
        label={t(
          automaticTaxesOn
            ? "orders.summary.discountTotal"
            : "orders.summary.discountSubtotal"
        )}
        secondaryValue={discountCodes.join(", ")}
        value={
          discountTotal > 0
            ? `- ${getLocaleAmount(discountTotal, order.currency_code)}`
            : "-"
        }
      />

      <>
        <div className="flex justify-between">
          <div
            onClick={() => hasTaxLines && setIsTaxOpen((o) => !o)}
            className={clx("flex items-center gap-1", {
              "cursor-pointer": hasTaxLines,
            })}
          >
            <span className="txt-small select-none">
              {t(
                automaticTaxesOn
                  ? "orders.summary.taxTotalIncl"
                  : "orders.summary.taxTotal"
              )}
            </span>
            {hasTaxLines && (
              <TriangleDownMini
                style={{
                  transform: `rotate(${isTaxOpen ? 0 : -90}deg)`,
                }}
              />
            )}
          </div>

          <div className="text-right">
            <Text size="small" leading="compact">
              {getLocaleAmount(order.tax_total, order.currency_code)}
            </Text>
          </div>
        </div>
        {isTaxOpen && (
          <div className="flex flex-col gap-1 pl-5">
            {Object.entries(taxCodes).map(([code, total]) => {
              return (
                <div
                  key={code}
                  className="flex items-center justify-between gap-x-2"
                >
                  <div>
                    <span className="txt-small text-ui-fg-subtle font-medium">
                      {code}
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
                  </div>
                  <span className="txt-small text-ui-fg-muted">
                    {getLocaleAmount(total, order.currency_code)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </>
    </div>
  )
}

const InventoryKitBreakdown = ({ item }: { item: AdminOrderLineItem }) => {
  const { t } = useTranslation()

  const [isOpen, setIsOpen] = useState(false)

  const inventory = item.variant.inventory_items

  return (
    <>
      <div
        onClick={() => setIsOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 border-t border-dashed px-6 py-4"
      >
        <TriangleDownMini
          style={{
            transform: `rotate(${isOpen ? 0 : -90}deg)`,
          }}
        />
        <span className="text-ui-fg-muted txt-small select-none">
          {t("orders.summary.inventoryKit", { count: inventory.length })}
        </span>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-1 px-6 pb-4">
          {inventory.map((i) => {
            return (
              <div
                key={i.inventory.id}
                className="flex items-center justify-between gap-x-2"
              >
                <div>
                  <span className="txt-small text-ui-fg-subtle font-medium">
                    {i.inventory.title}

                    {i.inventory.sku && (
                      <span className="text-ui-fg-subtle font-normal">
                        {" "}
                        ⋅ {i.inventory.sku}
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative flex-1">
                  <div className="bottom-[calc(50% - 2px)] absolute h-[1px] w-full border-b border-dashed" />
                </div>
                <span className="txt-small text-ui-fg-muted">
                  {i.required_quantity}x
                </span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

const ReturnBreakdownWithDamages = ({
  orderReturn,
  itemId,
}: {
  orderReturn: AdminReturn
  itemId: string
}) => {
  const { t } = useTranslation()

  const item = orderReturn?.items?.find((ri) => ri.item_id === itemId)
  const damagedQuantity = item?.damaged_quantity || 0

  return (
    item && (
      <div
        key={orderReturn.id}
        className="txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-subtle flex flex-row justify-between gap-y-2 border-t-2 border-dotted px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <ArrowDownRightMini className="text-ui-fg-muted" />
          <Text size="small">
            {t(`orders.returns.damagedItemsReturned`, {
              quantity: damagedQuantity,
            })}
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

        <Text size="small" leading="compact" className="text-ui-fg-muted">
          {t(`orders.returns.damagedItemReceived`)}

          <span className="ml-2">
            <ReturnInfoPopover orderReturn={orderReturn} />
          </span>
        </Text>
      </div>
    )
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
  const damagedQuantity = item?.damaged_quantity || 0

  return (
    item && (
      <>
        {damagedQuantity > 0 && (
          <ReturnBreakdownWithDamages
            orderReturn={orderReturn}
            itemId={itemId}
          />
        )}
        <div
          key={item.id}
          className="txt-compact-small-plus text-ui-fg-subtle bg-ui-bg-subtle flex flex-row justify-between gap-y-2 border-t-2 border-dotted px-6 py-4"
        >
          <div className="flex items-center gap-2">
            <ArrowDownRightMini className="text-ui-fg-muted" />
            <Text size="small">
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

          {orderReturn && isRequested && (
            <Text size="small" leading="compact" className="text-ui-fg-muted">
              {getRelativeDate(orderReturn.created_at)}
              <span className="ml-2">
                <ReturnInfoPopover orderReturn={orderReturn} />
              </span>
            </Text>
          )}

          {orderReturn && !isRequested && (
            <Text size="small" leading="compact" className="text-ui-fg-muted">
              {t(`orders.returns.itemReceived`)}

              <span className="ml-2">
                <ReturnInfoPopover orderReturn={orderReturn} />
              </span>
            </Text>
          )}
        </div>
      </>
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

          <Text size="small">
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
          <Text size="small">
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
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {t("fields.total")}
        </Text>
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {getStylizedAmount(order.total, order.currency_code)}
        </Text>
      </div>

      <div className="text-ui-fg-base flex items-center justify-between">
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
          {t("fields.paidTotal")}
        </Text>
        <Text
          weight="plus"
          className="text-ui-fg-subtle"
          size="small"
          leading="compact"
        >
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
          weight="plus"
        >
          {t("orders.returns.outstandingAmount")}
        </Text>
        <Text
          className="text-ui-fg-subtle text-bold"
          size="small"
          leading="compact"
          weight="plus"
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
