import { Button, Text, Tooltip, clx, toast, usePrompt } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"

import { PropsWithChildren, ReactNode, useMemo, useState } from "react"

import {
  AdminClaim,
  AdminExchange,
  AdminFulfillment,
  AdminOrder,
  AdminOrderChange,
  AdminReturn,
} from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { AdminOrderLineItem } from "@medusajs/types"
import { By } from "../../../../../components/common/user-link"
import {
  useCancelOrderTransfer,
  useCustomer,
  useOrder,
  useOrderChanges,
  useOrderLineItems,
} from "../../../../../hooks/api"
import { useCancelClaim, useClaims } from "../../../../../hooks/api/claims"
import {
  useCancelExchange,
  useExchanges,
} from "../../../../../hooks/api/exchanges"
import { useCancelReturn, useReturns } from "../../../../../hooks/api/returns"
import { useDate } from "../../../../../hooks/use-date"
import { getFormattedAddress } from "../../../../../lib/addresses"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { getPaymentsFromOrder } from "../../../../../lib/orders"
import ActivityItems from "./activity-items"
import ChangeDetailsTooltip from "./change-details-tooltip"
import { Thumbnail } from "../../../../../components/common/thumbnail"

type OrderTimelineProps = {
  order: AdminOrder
}

/**
 * Arbitrary high limit to ensure all notes are fetched
 */
const NOTE_LIMIT = 9999

/**
 * Order Changes that are not related to RMA flows
 */
const NON_RMA_CHANGE_TYPES = ["transfer", "update_order"]

export const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const items = useActivityItems(order)

  if (items.length <= 3) {
    return (
      <div className="flex flex-col gap-y-0.5">
        {items.map((item, index) => {
          return (
            <OrderActivityItem
              key={index}
              title={item.title}
              timestamp={item.timestamp}
              isFirst={index === items.length - 1}
              itemsToSend={item.itemsToSend}
              itemsToReturn={item.itemsToReturn}
              itemsMap={item.itemsMap}
            >
              {item.children}
            </OrderActivityItem>
          )
        })}
      </div>
    )
  }

  const lastItems = items.slice(0, 2)
  const collapsibleItems = items.slice(2, items.length - 1)
  const firstItem = items[items.length - 1]

  return (
    <div className="flex flex-col gap-y-0.5">
      {lastItems.map((item, index) => {
        return (
          <OrderActivityItem
            key={index}
            title={item.title}
            timestamp={item.timestamp}
            itemsToSend={item.itemsToSend}
            itemsToReturn={item.itemsToReturn}
            itemsMap={item.itemsMap}
          >
            {item.children}
          </OrderActivityItem>
        )
      })}
      <OrderActivityCollapsible activities={collapsibleItems} />
      <OrderActivityItem
        title={firstItem.title}
        timestamp={firstItem.timestamp}
        isFirst
        itemsToSend={firstItem.itemsToSend}
        itemsToReturn={firstItem.itemsToReturn}
        itemsMap={firstItem.itemsMap}
      >
        {firstItem.children}
      </OrderActivityItem>
    </div>
  )
}

type Activity = {
  title: string
  timestamp: string | Date
  children?: ReactNode
  itemsToSend?: (
    | AdminClaim["additional_items"]
    | AdminExchange["additional_items"]
  )[]
  itemsToReturn?: AdminReturn["items"]
  itemsMap?: Map<string, AdminOrderLineItem>
}

const useActivityItems = (order: AdminOrder): Activity[] => {
  const { t } = useTranslation()

  const { order: initialOrder = order } = useOrder(
    order.id,
    {
      version: 1,
      fields: "created_at,total,currency_code",
    },
    { enabled: order.version !== 1 }
  )

  const { order_changes: orderChanges = [] } = useOrderChanges(order.id, {
    change_type: [
      "edit",
      "claim",
      "exchange",
      "return",
      "transfer",
      "update_order",
    ],
  })

  const rmaChanges = orderChanges.filter(
    (oc) => !NON_RMA_CHANGE_TYPES.includes(oc.change_type)
  )

  const missingLineItemIds = getMissingLineItemIds(order, rmaChanges)
  const { order_items: removedLineItems = [] } = useOrderLineItems(
    order.id,

    {
      fields: "+quantity",
      item_id: missingLineItemIds,
    },
    {
      enabled: !!rmaChanges.length,
    }
  )

  const itemsMap = useMemo(() => {
    const _itemsMap = new Map(order?.items?.map((i) => [i.id, i]))

    for (const id of missingLineItemIds) {
      const i = removedLineItems.find((i) => i.item.id === id)

      if (i) {
        _itemsMap.set(id, { ...i.item, quantity: i.quantity }) // copy quantity from OrderItem to OrderLineItem
      }
    }

    return _itemsMap
  }, [order.items, removedLineItems, missingLineItemIds])

  const { returns = [] } = useReturns({
    order_id: order.id,
    fields: "+received_at,*items",
  })

  const { claims = [] } = useClaims({
    order_id: order.id,
    fields: "*additional_items",
  })

  const { exchanges = [] } = useExchanges({
    order_id: order.id,
    fields: "*additional_items",
  })

  const payments = getPaymentsFromOrder(order)

  const notes = []
  const isLoading = false
  // const { notes, isLoading, isError, error } = useNotes(
  //   {
  //     resource_id: order.id,
  //     limit: NOTE_LIMIT,
  //     offset: 0,
  //   },
  //   {
  //     keepPreviousData: true,
  //   }
  // )
  //
  // if (isError) {
  //   throw error
  // }

  return useMemo(() => {
    if (isLoading) {
      return []
    }

    const items: Activity[] = []

    for (const payment of payments) {
      const amount = payment.amount as number

      items.push({
        title: t("orders.activity.events.payment.awaiting"),
        timestamp: payment.created_at!,
        children: (
          <Text size="small" className="text-ui-fg-subtle">
            {getStylizedAmount(amount, payment.currency_code)}
          </Text>
        ),
      })

      if (payment.canceled_at) {
        items.push({
          title: t("orders.activity.events.payment.canceled"),
          timestamp: payment.canceled_at,
          children: (
            <Text size="small" className="text-ui-fg-subtle">
              {getStylizedAmount(amount, payment.currency_code)}
            </Text>
          ),
        })
      }

      if (payment.captured_at) {
        items.push({
          title: t("orders.activity.events.payment.captured"),
          timestamp: payment.captured_at,
          children: (
            <Text size="small" className="text-ui-fg-subtle">
              {getStylizedAmount(amount, payment.currency_code)}
            </Text>
          ),
        })
      }

      for (const refund of payment.refunds || []) {
        items.push({
          title: t("orders.activity.events.payment.refunded"),
          timestamp: refund.created_at,
          children: (
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small">
                {getStylizedAmount(
                  refund.amount as number,
                  payment.currency_code
                )}
              </Text>
              {refund.created_by && (
                <div className="flex items-center gap-x-2 text-sm">
                  {t("fields.by")} <By id={refund.created_by} />
                </div>
              )}
            </div>
          ),
        })
      }
    }

    for (const fulfillment of order.fulfillments || []) {
      items.push({
        title: t("orders.activity.events.fulfillment.created"),
        timestamp: fulfillment.created_at,
        children: (
          <div className="text-ui-fg-subtle flex flex-col gap-y-2">
            <FulfillmentCreatedBody fulfillment={fulfillment} />
            {fulfillment.created_by && (
              <div className="flex items-center gap-x-2 text-sm">
                {t("fields.by")} <By id={fulfillment.created_by} />
              </div>
            )}
          </div>
        ),
      })

      if (fulfillment.delivered_at) {
        items.push({
          title: t("orders.activity.events.fulfillment.delivered"),
          timestamp: fulfillment.delivered_at,
          children: <FulfillmentCreatedBody fulfillment={fulfillment} />,
        })
      }

      if (fulfillment.shipped_at) {
        items.push({
          title: t("orders.activity.events.fulfillment.shipped"),
          timestamp: fulfillment.shipped_at,
          children: (
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <FulfillmentCreatedBody fulfillment={fulfillment} isShipment />
              {fulfillment.marked_shipped_by && (
                <div className="flex items-center gap-x-2 text-sm">
                  {t("fields.by")} <By id={fulfillment.marked_shipped_by} />
                </div>
              )}
            </div>
          ),
        })
      }

      if (fulfillment.canceled_at) {
        items.push({
          title: t("orders.activity.events.fulfillment.canceled"),
          timestamp: fulfillment.canceled_at,
        })
      }
    }

    const returnMap = new Map<string, AdminReturn>()

    for (const ret of returns) {
      returnMap.set(ret.id, ret)

      if (ret.claim_id || ret.exchange_id) {
        continue
      }

      // Always display created action
      items.push({
        title: t("orders.activity.events.return.created", {
          returnId: ret.id.slice(-7),
        }),
        timestamp: ret.created_at,
        itemsToReturn: ret?.items,
        itemsMap,
        children: (
          <div className="text-ui-fg-subtle flex flex-col gap-y-2">
            <ReturnBody orderReturn={ret} isCreated={!ret.canceled_at} />
            {ret.created_by && !ret.canceled_at && (
              <div className="flex items-center gap-x-2 text-sm">
                {t("fields.by")} <By id={ret.created_by} />
              </div>
            )}
          </div>
        ),
      })

      if (ret.canceled_at) {
        items.push({
          title: t("orders.activity.events.return.canceled", {
            returnId: ret.id.slice(-7),
          }),
          timestamp: ret.canceled_at,
        })
      }

      if (ret.status === "received" || ret.status === "partially_received") {
        items.push({
          title: t("orders.activity.events.return.received", {
            returnId: ret.id.slice(-7),
          }),
          timestamp: ret.received_at,
          itemsToReturn: ret?.items,
          itemsMap,
          children: <ReturnBody orderReturn={ret} isReceived />,
        })
      }
    }

    for (const claim of claims) {
      const claimReturn = returnMap.get(claim.return_id!)

      items.push({
        title: t(
          claim.canceled_at
            ? "orders.activity.events.claim.canceled"
            : "orders.activity.events.claim.created",
          {
            claimId: claim.id.slice(-7),
          }
        ),
        timestamp: claim.canceled_at || claim.created_at,
        itemsToSend: claim.additional_items,
        itemsToReturn: claimReturn?.items,
        itemsMap,
        children: (
          <div className="text-ui-fg-subtle flex flex-col gap-y-2">
            <ClaimBody claim={claim} claimReturn={claimReturn} />
            {claim.created_by && !claim.canceled_at && (
              <div className="flex items-center gap-x-2 text-sm">
                {t("fields.by")} <By id={claim.created_by} />
              </div>
            )}
          </div>
        ),
      })
    }

    for (const exchange of exchanges) {
      const exchangeReturn = returnMap.get(exchange.return_id!)

      items.push({
        title: t(
          exchange.canceled_at
            ? "orders.activity.events.exchange.canceled"
            : "orders.activity.events.exchange.created",
          {
            exchangeId: exchange.id.slice(-7),
          }
        ),
        timestamp: exchange.canceled_at || exchange.created_at,
        itemsToSend: exchange.additional_items,
        itemsToReturn: exchangeReturn?.items,
        itemsMap,
        children: (
          <div className="text-ui-fg-subtle flex flex-col gap-y-2">
            <ExchangeBody exchange={exchange} exchangeReturn={exchangeReturn} />
            {exchange.created_by && !exchange.canceled_at && (
              <div className="flex items-center gap-x-2 text-sm">
                {t("fields.by")} <By id={exchange.created_by} />
              </div>
            )}
          </div>
        ),
      })
    }

    for (const edit of orderChanges.filter((oc) => oc.change_type === "edit")) {
      const isConfirmed = edit.status === "confirmed"
      const isPending = edit.status === "pending"

      if (isPending) {
        continue
      }

      items.push({
        title: t(`orders.activity.events.edit.${edit.status}`, {
          editId: edit.id.slice(-7),
        }),
        timestamp:
          edit.status === "requested"
            ? edit.requested_at
            : edit.status === "confirmed"
            ? edit.confirmed_at
            : edit.status === "declined"
            ? edit.declined_at
            : edit.status === "canceled"
            ? edit.canceled_at
            : edit.created_at,
        children: isConfirmed ? <OrderEditBody edit={edit} /> : null,
      })
    }

    for (const transfer of orderChanges.filter(
      (oc) => oc.change_type === "transfer"
    )) {
      if (transfer.requested_at) {
        items.push({
          title: t(`orders.activity.events.transfer.requested`, {
            transferId: transfer.id.slice(-7),
          }),
          timestamp: transfer.requested_at,
          children: <TransferOrderRequestBody transfer={transfer} />,
        })
      }

      if (transfer.confirmed_at) {
        items.push({
          title: t(`orders.activity.events.transfer.confirmed`, {
            transferId: transfer.id.slice(-7),
          }),
          timestamp: transfer.confirmed_at,
        })
      }
      if (transfer.declined_at) {
        items.push({
          title: t(`orders.activity.events.transfer.declined`, {
            transferId: transfer.id.slice(-7),
          }),
          timestamp: transfer.declined_at,
        })
      }
    }

    for (const update of orderChanges.filter(
      (oc) => oc.change_type === "update_order"
    )) {
      const updateType = update.actions[0]?.details?.type

      if (updateType === "shipping_address") {
        items.push({
          title: (
            <ChangeDetailsTooltip
              title={t(`orders.activity.events.update_order.shipping_address`)}
              previous={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {getFormattedAddress({
                    address: update.actions[0].details.old,
                  }).join(", ")}
                </p>
              }
              next={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {getFormattedAddress({
                    address: update.actions[0].details.new,
                  }).join(", ")}
                </p>
              }
            />
          ),
          timestamp: update.created_at,
          children: (
            <div className="text-ui-fg-subtle mt-2 flex gap-x-2 text-sm">
              {t("fields.by")} <By id={update.created_by} />
            </div>
          ),
        })
      }

      if (updateType === "billing_address") {
        items.push({
          title: (
            <ChangeDetailsTooltip
              title={t(`orders.activity.events.update_order.billing_address`)}
              previous={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {getFormattedAddress({
                    address: update.actions[0].details.old,
                  }).join(", ")}
                </p>
              }
              next={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {getFormattedAddress({
                    address: update.actions[0].details.new,
                  }).join(", ")}
                </p>
              }
            />
          ),
          timestamp: update.created_at,
          children: (
            <div className="text-ui-fg-subtle mt-2 flex gap-x-2 text-sm">
              {t("fields.by")} <By id={update.created_by} />
            </div>
          ),
        })
      }

      if (updateType === "email") {
        items.push({
          title: (
            <ChangeDetailsTooltip
              title={t(`orders.activity.events.update_order.email`)}
              previous={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {update.actions[0].details.old}
                </p>
              }
              next={
                <p className="txt-compact-small text-ui-fg-subtle">
                  {update.actions[0].details.new}
                </p>
              }
            />
          ),
          timestamp: update.created_at,
          children: (
            <div className="text-ui-fg-subtle mt-2 flex gap-x-2 text-sm">
              {t("fields.by")} <By id={update.created_by} />
            </div>
          ),
        })
      }
    }

    // for (const note of notes || []) {
    //   items.push({
    //     title: t("orders.activity.events.note.comment"),
    //     timestamp: note.created_at,
    //     children: <NoteBody note={note} />,
    //   })
    // }

    if (order.canceled_at) {
      items.push({
        title: t("orders.activity.events.canceled.title"),
        timestamp: order.canceled_at,
      })
    }

    const sortedActivities = items.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    if (initialOrder.created_at) {
      const createdAt = {
        title: t("orders.activity.events.placed.title"),
        timestamp: initialOrder.created_at,
        children: (
          <Text size="small" className="text-ui-fg-subtle">
            {getStylizedAmount(initialOrder.total, initialOrder.currency_code)}
          </Text>
        ),
      }
      sortedActivities.push(createdAt)
    }

    return [...sortedActivities]
  }, [
    order,
    initialOrder,
    payments,
    returns,
    exchanges,
    orderChanges,
    notes,
    isLoading,
    itemsMap,
  ])
}

type OrderActivityItemProps = PropsWithChildren<{
  title: string
  timestamp: string | Date
  isFirst?: boolean
  itemsToSend?:
    | AdminClaim["additional_items"]
    | AdminExchange["additional_items"]
  itemsToReturn?: AdminReturn["items"]
  itemsMap?: Map<string, AdminOrderLineItem>
}>

const OrderActivityItem = ({
  title,
  timestamp,
  isFirst = false,
  children,
  itemsToSend,
  itemsToReturn,
  itemsMap,
}: OrderActivityItemProps) => {
  const { getFullDate, getRelativeDate } = useDate()

  return (
    <div className="grid grid-cols-[20px_1fr] items-start gap-2">
      <div className="flex size-full flex-col items-center gap-y-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="bg-ui-bg-base shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div className="bg-ui-tag-neutral-icon size-1.5 rounded-full" />
          </div>
        </div>
        {!isFirst && <div className="bg-ui-border-base w-px flex-1" />}
      </div>
      <div
        className={clx({
          "pb-4": !isFirst,
        })}
      >
        <div className="flex items-center justify-between">
          {itemsToSend?.length || itemsToReturn?.length ? (
            <ActivityItems
              key={title}
              title={title}
              itemsToSend={itemsToSend}
              itemsToReturn={itemsToReturn}
              itemsMap={itemsMap}
            />
          ) : (
            <Text size="small" leading="compact" weight="plus">
              {title}
            </Text>
          )}
          {timestamp && (
            <Tooltip
              content={getFullDate({ date: timestamp, includeTime: true })}
            >
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle text-right"
              >
                {getRelativeDate(timestamp)}
              </Text>
            </Tooltip>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

const OrderActivityCollapsible = ({
  activities,
}: {
  activities: Activity[]
}) => {
  const [open, setOpen] = useState(false)

  const { t } = useTranslation()

  if (!activities.length) {
    return null
  }

  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
      {!open && (
        <div className="grid grid-cols-[20px_1fr] items-start gap-2">
          <div className="flex size-full flex-col items-center">
            <div className="border-ui-border-strong w-px flex-1 bg-[linear-gradient(var(--border-strong)_33%,rgba(255,255,255,0)_0%)] bg-[length:1px_3px] bg-right bg-repeat-y" />
          </div>
          <div className="pb-4">
            <RadixCollapsible.Trigger className="text-left">
              <Text
                size="small"
                leading="compact"
                weight="plus"
                className="text-ui-fg-muted"
              >
                {t("orders.activity.showMoreActivities", {
                  count: activities.length,
                })}
              </Text>
            </RadixCollapsible.Trigger>
          </div>
        </div>
      )}
      <RadixCollapsible.Content>
        <div className="flex flex-col gap-y-0.5">
          {activities.map((item, index) => {
            return (
              <OrderActivityItem
                key={index}
                title={item.title}
                timestamp={item.timestamp}
                itemsToSend={item.itemsToSend}
                itemsToReturn={item.itemsToReturn}
                itemsMap={item.itemsMap}
              >
                {item.children}
              </OrderActivityItem>
            )
          })}
        </div>
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}

/**
 * TODO: Add once notes are supported.
 */
// const NoteBody = ({ note }: { note: Note }) => {
//   const { t } = useTranslation()
//   const prompt = usePrompt()

//   const { first_name, last_name, email } = note.author || {}
//   const name = [first_name, last_name].filter(Boolean).join(" ")

//   const byLine = t("orders.activity.events.note.byLine", {
//     author: name || email,
//   })

//   const { mutateAsync } = {} // useAdminDeleteNote(note.id)

//   const handleDelete = async () => {
//     const res = await prompt({
//       title: t("general.areYouSure"),
//       description: "This action cannot be undone",
//       confirmText: t("actions.delete"),
//       cancelText: t("actions.cancel"),
//     })

//     if (!res) {
//       return
//     }

//     await mutateAsync()
//   }

//   return (
//     <div className="flex flex-col gap-y-2 pt-2">
//       <div className="bg-ui-bg-component shadow-borders-base group grid grid-cols-[1fr_20px] items-start gap-x-2 text-pretty rounded-r-2xl rounded-bl-md rounded-tl-xl px-3 py-1.5">
//         <div className="flex h-full min-h-7 items-center">
//           <Text size="xsmall" className="text-ui-fg-subtle">
//             {note.value}
//           </Text>
//         </div>
//         <IconButton
//           size="small"
//           variant="transparent"
//           className="transition-fg invisible opacity-0 group-hover:visible group-hover:opacity-100"
//           type="button"
//           onClick={handleDelete}
//         >
//           <span className="sr-only">
//             {t("orders.activity.comment.deleteButtonText")}
//           </span>
//           <XMarkMini className="text-ui-fg-muted" />
//         </IconButton>
//       </div>
//       <Link
//         to={`/settings/users/${note.author_id}`}
//         className="text-ui-fg-subtle hover:text-ui-fg-base transition-fg w-fit"
//       >
//         <Text size="small">{byLine}</Text>
//       </Link>
//     </div>
//   )
// }

const FulfillmentCreatedBody = ({
  fulfillment,
}: {
  fulfillment: AdminFulfillment
}) => {
  const { t } = useTranslation()

  const numberOfItems = fulfillment.items.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  return (
    <div>
      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.events.fulfillment.items", {
          count: numberOfItems,
        })}
      </Text>
    </div>
  )
}

const ReturnBody = ({
  orderReturn,
  isCreated,
  isReceived,
}: {
  orderReturn: AdminReturn
  isCreated: boolean
  isReceived?: boolean
}) => {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const { mutateAsync: cancelReturnRequest } = useCancelReturn(
    orderReturn.id,
    orderReturn.order_id
  )

  const onCancel = async () => {
    const res = await prompt({
      title: t("orders.returns.cancel.title"),
      description: t("orders.returns.cancel.description"),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await cancelReturnRequest().catch((error) => {
      toast.error(error.message)
    })
  }

  const numberOfItems = orderReturn.items.reduce((acc, item) => {
    return acc + (isReceived ? item.received_quantity : item.quantity) // TODO: revisit when we add dismissed quantity on ReturnItem
  }, 0)

  return (
    <div className="flex items-start gap-1">
      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.events.return.items", {
          count: numberOfItems,
        })}
      </Text>
      {isCreated && (
        <>
          <div className="mt-[2px] flex items-center leading-none">⋅</div>
          <Button
            onClick={onCancel}
            className="text-ui-fg-subtle h-auto px-0 leading-none hover:bg-transparent"
            variant="transparent"
            size="small"
          >
            {t("actions.cancel")}
          </Button>
        </>
      )}
    </div>
  )
}

const ClaimBody = ({
  claim,
  claimReturn,
}: {
  claim: AdminClaim
  claimReturn?: AdminReturn
}) => {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const isCanceled = !!claim.created_at

  const { mutateAsync: cancelClaim } = useCancelClaim(claim.id, claim.order_id)

  const onCancel = async () => {
    const res = await prompt({
      title: t("orders.claims.cancel.title"),
      description: t("orders.claims.cancel.description"),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await cancelClaim().catch((error) => {
      toast.error(error.message)
    })
  }

  const outboundItems = (claim.additional_items || []).reduce(
    (acc, item) => (acc + item.quantity) as number,
    0
  )

  const inboundItems = (claimReturn?.items || []).reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  return (
    <div>
      {outboundItems > 0 && (
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.activity.events.claim.itemsInbound", {
            count: outboundItems,
          })}
        </Text>
      )}

      {inboundItems > 0 && (
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.activity.events.claim.itemsOutbound", {
            count: inboundItems,
          })}
        </Text>
      )}

      {!isCanceled && (
        <Button
          onClick={onCancel}
          className="text-ui-fg-subtle h-auto px-0 leading-none hover:bg-transparent"
          variant="transparent"
          size="small"
        >
          {t("actions.cancel")}
        </Button>
      )}
    </div>
  )
}

const ExchangeBody = ({
  exchange,
  exchangeReturn,
}: {
  exchange: AdminExchange
  exchangeReturn?: AdminReturn
}) => {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const isCanceled = !!exchange.canceled_at

  const { mutateAsync: cancelExchange } = useCancelExchange(
    exchange.id,
    exchange.order_id
  )

  const onCancel = async () => {
    const res = await prompt({
      title: t("orders.exchanges.cancel.title"),
      description: t("orders.exchanges.cancel.description"),
      confirmText: t("actions.confirm"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await cancelExchange().catch((error) => {
      toast.error(error.message)
    })
  }

  const outboundItems = (exchange.additional_items || []).reduce(
    (acc, item) => (acc + item.quantity) as number,
    0
  )

  const inboundItems = (exchangeReturn?.items || []).reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  return (
    <div>
      {outboundItems > 0 && (
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.activity.events.exchange.itemsInbound", {
            count: outboundItems,
          })}
        </Text>
      )}

      {inboundItems > 0 && (
        <Text size="small" className="text-ui-fg-subtle">
          {t("orders.activity.events.exchange.itemsOutbound", {
            count: inboundItems,
          })}
        </Text>
      )}

      {!isCanceled && (
        <Button
          onClick={onCancel}
          className="text-ui-fg-subtle h-auto px-0 leading-none hover:bg-transparent"
          variant="transparent"
          size="small"
        >
          {t("actions.cancel")}
        </Button>
      )}
    </div>
  )
}

const OrderEditBody = ({ edit }: { edit: AdminOrderChange }) => {
  const { t } = useTranslation()

  const isConfirmed = edit.status === "confirmed"
  const isDeclined = edit.status === "declined"
  const isCanceled = edit.status === "canceled"

  const userId = isConfirmed
    ? edit.confirmed_by
    : isDeclined
    ? edit.declined_by
    : isCanceled
    ? edit.canceled_by
    : edit.requested_by

  const [itemsAdded, itemsRemoved] = useMemo(
    () => countItemsChange(edit.actions),
    [edit]
  )

  const ItemChangeDetails = ({
    itemChange,
    version,
  }: {
    itemChange: ItemChange
    version: number
  }) => {
    // We need to know items that were completely removed, not just decreasing in quantity, since to get the item information for them
    // we need to query the line items for the previous version, since the current order change version doesn't contain them
    const deletedItemIdsSet = new Set(
      itemChange.detail
        .filter((item) => item.isDeleted)
        .map((item) => item.lineItemId)
    )
    const isAllDeleted = deletedItemIdsSet.size === itemChange.detail.length
    const isSomeDeleted = deletedItemIdsSet.size > 0

    const { isLoading: isLoadingDeleted, order_items: deletedLineItems = [] } =
      useOrderLineItems(
        edit.order_id,
        {
          item_id: Array.from(deletedItemIdsSet),
          version: version - 1,
        },
        {
          enabled: isSomeDeleted,
        }
      )

    const { isLoading, order_items: nonDeletedLineItems = [] } =
      useOrderLineItems(
        edit.order_id,
        {
          item_id: itemChange.detail
            .filter((item) => !deletedItemIdsSet.has(item.lineItemId))
            .map((item) => item.lineItemId),
          version,
        },
        {
          enabled: !isAllDeleted,
        }
      )

    const lineItems = [...deletedLineItems, ...nonDeletedLineItems]

    const label =
      itemChange.type === "added" ? t("labels.added") : t("labels.removed")

    if (isLoading || isLoadingDeleted) {
      return (
        <Text size="small" className="text-ui-fg-subtle">
          {t("labels.loading")}
        </Text>
      )
    }

    return (
      <div className="text-ui-fg-subtle flex flex-col divide-y divide-dashed">
        {lineItems.map((orderItem) => {
          const itemChangeItem = itemChange.detail.find(
            (item) => item.lineItemId === orderItem.item_id
          )

          if (!itemChangeItem) {
            return null
          }

          const lineItem = orderItem.item

          return (
            <div className="group flex items-start gap-x-4 py-3 first:pt-0 last:pb-0">
              <Thumbnail src={lineItem.thumbnail} />
              <div>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-base"
                >
                  {lineItem.title}
                </Text>

                {lineItem.variant_sku && (
                  <Text size="small">{lineItem.variant_sku}</Text>
                )}
                <Text size="small">{`${label}: ${itemChangeItem.count}`}</Text>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="text-ui-fg-subtle flex flex-col items-start gap-y-2">
      {itemsAdded.totalCount > 0 && (
        <ChangeDetailsTooltip
          title={`${t("labels.added")}: ${itemsAdded.totalCount}`}
          previous={
            <ItemChangeDetails itemChange={itemsAdded} version={edit.version} />
          }
        />
      )}

      {itemsRemoved.totalCount > 0 && (
        <ChangeDetailsTooltip
          title={`${t("labels.removed")}: ${itemsRemoved.totalCount}`}
          previous={
            <ItemChangeDetails
              itemChange={itemsRemoved}
              version={edit.version}
            />
          }
        />
      )}
      {userId && (
        <div className="flex items-center gap-x-2 text-sm">
          {t("fields.by")} <By id={userId} />
        </div>
      )}
    </div>
  )
}

const TransferOrderRequestBody = ({
  transfer,
}: {
  transfer: AdminOrderChange
}) => {
  const prompt = usePrompt()
  const { t } = useTranslation()

  const action = transfer.actions[0]
  const { customer } = useCustomer(action.reference_id)

  const isCompleted = !!transfer.confirmed_at

  const { mutateAsync: cancelTransfer } = useCancelOrderTransfer(
    transfer.order_id
  )

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("actions.cannotUndo"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await cancelTransfer().catch((error) => {
      toast.error(error.message)
    })
  }

  /**
   * TODO: change original_email to customer info when action details is changed
   */

  return (
    <div>
      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.from")}: {action.details?.original_email}
      </Text>

      <Text size="small" className="text-ui-fg-subtle">
        {t("orders.activity.to")}:{" "}
        {customer?.first_name
          ? `${customer?.first_name} ${customer?.last_name}`
          : customer?.email}
      </Text>
      {!isCompleted && (
        <Button
          onClick={handleDelete}
          className="text-ui-fg-subtle h-auto px-0 leading-none hover:bg-transparent"
          variant="transparent"
          size="small"
        >
          {t("actions.cancel")}
        </Button>
      )}
    </div>
  )
}

type ItemChange = {
  totalCount: number
  type: "added" | "removed"
  detail: {
    lineItemId: string
    count: number
    isDeleted?: boolean
  }[]
}
/**
 * Returns count of added and removed item quantity
 */
function countItemsChange(
  actions: AdminOrderChange["actions"]
): [ItemChange, ItemChange] {
  const addedChange: ItemChange = {
    totalCount: 0,
    detail: [],
    type: "added",
  }
  const removedChange: ItemChange = {
    totalCount: 0,
    detail: [],
    type: "removed",
  }

  actions.forEach((action) => {
    if (action.action === "ITEM_ADD") {
      addedChange.totalCount += action.details!.quantity as number
      addedChange.detail.push({
        lineItemId: action.details!.reference_id as string,
        count: action.details!.quantity as number,
      })
    }
    if (action.action === "ITEM_UPDATE") {
      const quantityDiff = action.details!.quantity_diff as number

      if (quantityDiff > 0) {
        addedChange.totalCount += quantityDiff
        addedChange.detail.push({
          lineItemId: action.details!.reference_id as string,
          count: quantityDiff,
        })
      } else {
        removedChange.totalCount += Math.abs(quantityDiff)
        removedChange.detail.push({
          lineItemId: action.details!.reference_id as string,
          count: Math.abs(quantityDiff),
          isDeleted: action.details!.quantity === 0,
        })
      }
    }
  })

  return [addedChange, removedChange]
}

/**
 * Get IDs of missing line items that were removed from the order.
 */
function getMissingLineItemIds(order: AdminOrder, changes: AdminOrderChange[]) {
  if (!changes?.length) {
    return []
  }

  const retIds = new Set<string>()
  const existingItemsMap = new Map(order.items.map((item) => [item.id, true]))

  changes.forEach((change) => {
    change.actions.forEach((action) => {
      if (!action.details?.reference_id) {
        return
      }

      if (
        (action.details.reference_id as string).startsWith("ordli_") &&
        !existingItemsMap.has(action.details.reference_id as string)
      ) {
        retIds.add(action.details.reference_id as string)
      }
    })
  })

  return Array.from(retIds)
}
