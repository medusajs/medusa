import {
  ClaimOrder,
  Order,
  OrderEdit,
  Refund,
  Return,
  Swap,
} from "@medusajs/medusa"
import {
  useAdminNotes,
  useAdminNotifications,
  useAdminOrder,
  useAdminOrderEdits,
} from "medusa-react"
import { useMemo } from "react"
import useOrdersExpandParam from "../domain/orders/details/utils/use-admin-expand-paramter"
import { useFeatureFlag } from "../providers/feature-flag-provider"
import useStockLocations from "./use-stock-locations"

export interface TimelineEvent {
  id: string
  time: Date
  first?: boolean
  orderId: string
  noNotification?: boolean
  type:
    | "payment"
    | "note"
    | "notification"
    | "placed"
    | "shipped"
    | "delivered"
    | "fulfilled"
    | "canceled"
    | "return"
    | "refund"
    | "exchange"
    | "exchange_fulfilled"
    | "claim"
    | "edit-created"
    | "edit-requested"
    | "edit-declined"
    | "edit-canceled"
    | "edit-confirmed"
    | "payment-required"
    | "refund-required"
}

export interface RefundRequiredEvent extends TimelineEvent {
  currency_code: string
}

export interface PaymentRequiredEvent extends TimelineEvent {
  currency_code: string
}

export interface OrderEditEvent extends TimelineEvent {
  edit: OrderEdit
}

export interface OrderEditRequestedEvent extends OrderEditEvent {
  email: string
}

interface CancelableEvent {
  canceledAt?: Date
  isCanceled?: boolean
}

export interface OrderPlacedEvent extends TimelineEvent {
  amount: number
  currency_code: string
  tax?: number
}

interface OrderItem {
  title: string
  quantity: number
  thumbnail?: string
  variant: {
    title: string
  }
}

interface ReturnItem extends OrderItem {
  requestedQuantity: number
  receivedQuantity: number
}

interface FulfillmentEvent extends TimelineEvent {
  sourceType: "claim" | "exchange" | undefined
}

export interface ItemsFulfilledEvent extends FulfillmentEvent {
  items: OrderItem[]
  locationName?: string
}

export interface ItemsShippedEvent extends FulfillmentEvent {
  items: OrderItem[]
  locationName?: string
}

export interface RefundEvent extends TimelineEvent {
  amount: number
  reason: string
  currencyCode: string
  note?: string
  refund: Refund
}

enum ReturnStatus {
  REQUESTED = "requested",
  RECEIVED = "received",
  REQUIRES_ACTION = "requires_action",
  CANCELED = "canceled",
}

export interface ReturnEvent extends TimelineEvent {
  items: ReturnItem[]
  status: ReturnStatus
  currentStatus?: ReturnStatus
  raw: Return
  order: Order
  refunded?: boolean
}

export interface NoteEvent extends TimelineEvent {
  value: string
  authorId: string
}

export interface ExchangeEvent extends TimelineEvent, CancelableEvent {
  paymentStatus: string
  fulfillmentStatus: string
  returnStatus: string
  returnId: string
  returnItems: (ReturnItem | undefined)[]
  newItems: OrderItem[]
  exchangeCartId?: string
  raw: Swap
}

export interface ClaimEvent extends TimelineEvent, CancelableEvent {
  returnStatus: ReturnStatus
  fulfillmentStatus?: string
  refundStatus: string
  refundAmount: number
  currencyCode: string
  claimItems: OrderItem[]
  newItems: OrderItem[]
  claimType: string
  claim: ClaimOrder
  order: Order
}

export interface NotificationEvent extends TimelineEvent {
  to: string
  title: string
}

export const useBuildTimeline = (orderId: string) => {
  const { orderRelations } = useOrdersExpandParam()

  const {
    order,
    refetch,
    isLoading: isOrderLoading,
  } = useAdminOrder(orderId, {
    expand: orderRelations,
  })

  const { order_edits: edits, isLoading: isOrderEditsLoading } =
    useAdminOrderEdits({ order_id: orderId })

  const { isFeatureEnabled } = useFeatureFlag()

  const { notes, isLoading: isNotesLoading } = useAdminNotes({
    resource_id: orderId,
    limit: 100,
    offset: 0,
  })

  const { notifications } = useAdminNotifications({ resource_id: orderId })

  const { getLocationNameById } = useStockLocations()

  const events: TimelineEvent[] | undefined = useMemo(() => {
    if (!order) {
      return undefined
    }

    if (isOrderLoading || isNotesLoading || isOrderEditsLoading) {
      return undefined
    }

    let allItems = [...order.items]

    if (order.swaps && order.swaps.length) {
      for (const swap of order.swaps) {
        allItems = [...allItems, ...swap.additional_items]
      }
    }

    if (order.claims && order.claims.length) {
      for (const claim of order.claims) {
        allItems = [...allItems, ...claim.additional_items]
      }
    }

    const events: TimelineEvent[] = []

    events.push({
      id: "refund-event",
      time: new Date(),
      orderId: order.id,
      type: "refund-required",
      currency_code: order.currency_code,
    } as RefundRequiredEvent)

    events.push({
      id: "payment-required",
      time: new Date(),
      orderId: order.id,
      type: "payment-required",
      currency_code: order.currency_code,
    } as PaymentRequiredEvent)

    if (isFeatureEnabled("order_editing")) {
      for (const edit of edits || []) {
        events.push({
          id: edit.id,
          time: edit.created_at,
          orderId: order.id,
          type: "edit-created",
          edit: edit,
        } as OrderEditEvent)

        if (edit.requested_at) {
          events.push({
            id: edit.id,
            time: edit.requested_at,
            orderId: order.id,
            type: "edit-requested",
            email: order.email,
            edit: edit,
          } as OrderEditRequestedEvent)
        }

        // // declined
        if (edit.declined_at) {
          events.push({
            id: edit.id,
            time: edit.declined_at,
            orderId: order.id,
            type: "edit-declined",
            edit: edit,
          } as OrderEditEvent)
        }

        // // canceled
        if (edit.canceled_at) {
          events.push({
            id: edit.id,
            time: edit.canceled_at,
            orderId: order.id,
            type: "edit-canceled",
            edit: edit,
          } as OrderEditEvent)
        }

        // confirmed
        if (edit.confirmed_at) {
          events.push({
            id: edit.id,
            time: edit.confirmed_at,
            orderId: order.id,
            type: "edit-confirmed",
            edit: edit,
          } as OrderEditEvent)
        }
      }
    }

    events.push({
      id: `${order.id}-placed`,
      time: order.created_at,
      amount: order.total,
      currency_code: order.currency_code,
      tax: order.tax_rate,
      type: "placed",
      orderId: order.id,
    } as OrderPlacedEvent)

    if (order.status === "canceled") {
      events.push({
        id: `${order.id}-canceled`,
        time: order.updated_at,
        type: "canceled",
        orderId: order.id,
      } as TimelineEvent)
    }

    if (notes) {
      for (const note of notes) {
        events.push({
          id: note.id,
          time: note.created_at,
          type: "note",
          authorId: note.author_id,
          value: note.value,
          orderId: order.id,
        } as NoteEvent)
      }
    }

    for (const event of order.refunds) {
      events.push({
        amount: event.amount,
        currencyCode: order.currency_code,
        id: event.id,
        note: event.note,
        reason: event.reason,
        time: event.created_at,
        type: "refund",
        refund: event,
      } as RefundEvent)
    }

    for (const event of order.fulfillments) {
      events.push({
        id: event.id,
        time: event.created_at,
        type: "fulfilled",
        items: event.items.map((item) =>
          getFulfilmentItem(allItems, edits, item)
        ),
        noNotification: event.no_notification,
        orderId: order.id,
        locationName: getLocationNameById(event.location_id),
      } as ItemsFulfilledEvent)

      if (event.shipped_at) {
        events.push({
          id: event.id,
          time: event.shipped_at,
          type: "shipped",
          items: event.items.map((item) =>
            getFulfilmentItem(allItems, edits, item)
          ),
          noNotification: event.no_notification,
          orderId: order.id,
          locationName: getLocationNameById(event.location_id),
        } as ItemsShippedEvent)
      }
    }

    for (const event of order.returns) {
      events.push({
        id: event.id,
        items: event.items
          .map((i) => getReturnItems(allItems, edits, i))
          // Can be undefined while `edits` is loading
          .filter((i) => !!i),
        status: event.status,
        currentStatus: event.status,
        time: event.updated_at,
        type: "return",
        noNotification: event.no_notification,
        orderId: order.id,
        order: order,
        raw: event as unknown as Return,
        refunded: getWasRefundClaim(event.claim_order_id, order),
      } as ReturnEvent)

      if (event.status !== "requested") {
        events.push({
          id: event.id,
          items: event.items
            .map((i) => getReturnItems(allItems, edits, i))
            // Can be undefined while `edits` is loading
            .filter((i) => !!i),
          status: "requested",
          time: event.created_at,
          type: "return",
          raw: event as unknown as Return,
          currentStatus: event.status,
          noNotification: event.no_notification,
          order: order,
          orderId: order.id,
        } as ReturnEvent)
      }
    }

    for (const event of order.swaps) {
      events.push({
        id: event.id,
        time: event.canceled_at ? event.canceled_at : event.created_at,
        noNotification: event.no_notification === true,
        fulfillmentStatus: event.fulfillment_status,
        returnId: event.return_order.id,
        paymentStatus: event.payment_status,
        returnStatus: event.return_order.status,
        type: "exchange",
        newItems: event.additional_items.map((i) => getSwapItem(i)),
        returnItems: event.return_order.items.map((i) =>
          getReturnItems(allItems, edits, i)
        ),
        exchangeCartId:
          event.payment_status !== "captured" ? event.cart_id : undefined,
        canceledAt: event.canceled_at,
        orderId: event.order_id,
        raw: event as unknown as Swap,
      } as ExchangeEvent)

      if (
        event.fulfillment_status === "fulfilled" ||
        event.fulfillment_status === "shipped"
      ) {
        events.push({
          id: event.id,
          time: event.fulfillments[0].created_at,
          type: "fulfilled",
          items: event.additional_items.map((i) => getSwapItem(i)),
          noNotification: event.no_notification,
          orderId: order.id,
          sourceType: "exchange",
        } as ItemsFulfilledEvent)

        if (event.fulfillments[0].shipped_at) {
          events.push({
            id: event.id,
            time: event.fulfillments[0].shipped_at,
            type: "shipped",
            items: event.additional_items.map((i) => getSwapItem(i)),
            noNotification: event.no_notification,
            orderId: order.id,
            sourceType: "exchange",
          } as ItemsShippedEvent)
        }
      }
    }

    if (order.claims) {
      for (const claim of order.claims) {
        events.push({
          id: claim.id,
          type: "claim",
          newItems: claim.additional_items.map((i) => ({
            quantity: i.quantity,
            title: i.title,
            thumbnail: i.thumbnail,
            variant: {
              title: i.variant?.title,
            },
          })),
          fulfillmentStatus: claim.fulfillment_status,
          returnStatus: claim.return_order?.status,
          refundStatus: claim.payment_status,
          refundAmount: claim.refund_amount,
          currencyCode: order.currency_code,
          claimItems: claim.claim_items.map((i) => getClaimItem(i)),
          time: claim.canceled_at ? claim.canceled_at : claim.created_at,
          noNotification: claim.no_notification,
          claimType: claim.type,
          canceledAt: claim.canceled_at,
          orderId: order.id,
          claim,
          order,
        } as ClaimEvent)

        if (
          claim.fulfillment_status === "fulfilled" ||
          claim.fulfillment_status === "shipped"
        ) {
          events.push({
            id: claim.id,
            time: claim.fulfillments[0].created_at,
            type: "fulfilled",
            items: claim.additional_items.map((i) => getSwapItem(i)),
            noNotification: claim.no_notification,
            orderId: order.id,
            sourceType: "claim",
          } as ItemsFulfilledEvent)

          if (claim.fulfillments[0].shipped_at) {
            events.push({
              id: claim.id,
              time: claim.fulfillments[0].shipped_at,
              type: "shipped",
              items: claim.additional_items.map((i) => getSwapItem(i)),
              noNotification: claim.no_notification,
              orderId: order.id,
              sourceType: "claim",
            } as ItemsShippedEvent)
          }
        }
        if (claim.canceled_at) {
          events.push({
            id: `${claim.id}-created`,
            type: "claim",
            newItems: claim.additional_items.map((i) => ({
              quantity: i.quantity,
              title: i.title,
              thumbnail: i.thumbnail,
              variant: {
                title: i.variant?.title,
              },
            })),
            fulfillmentStatus: claim.fulfillment_status,
            refundStatus: claim.payment_status,
            refundAmount: claim.refund_amount,
            currencyCode: order.currency_code,
            claimItems: claim.claim_items.map((i) => getClaimItem(i)),
            time: claim.created_at,
            noNotification: claim.no_notification,
            claimType: claim.type,
            isCanceled: true,
            orderId: order.id,
          } as ClaimEvent)
        }
      }
    }

    if (notifications) {
      for (const notification of notifications) {
        events.push({
          id: notification.id,
          time: notification.created_at,
          to: notification.to,
          type: "notification",
          title: notification.event_name,
          orderId: order.id,
        } as NotificationEvent)
      }
    }

    events.sort((a, b) => {
      if (a.time > b.time) {
        return -1
      }

      if (a.time < b.time) {
        return 1
      }

      return 0
    })

    events[events.length - 1].first = true

    return events
  }, [
    order,
    edits,
    notes,
    notifications,
    isFeatureEnabled,
    isOrderLoading,
    isNotesLoading,
    isOrderEditsLoading,
  ])

  return {
    events,
    refetch,
  }
}

function getLineItem(allItems, itemId) {
  const line = allItems.find((line) => line.id === itemId)

  if (!line) {
    return
  }

  return {
    title: line.title,
    quantity: line.quantity,
    thumbnail: line.thumbnail,
    variant: { title: line?.variant?.title || "-" },
  }
}

function findOriginalItemId(edits, originalId) {
  let currentId = originalId

  edits = edits
    .filter((e) => !!e.confirmed_at) // only confirmed OEs are cloning line items
    .sort((a, b) => new Date(a.confirmed_at) - new Date(b.confirmed_at))

  for (const edit of edits) {
    const clonedItem = edit.items.find((e) => e.original_item_id === currentId)
    if (clonedItem) {
      currentId = clonedItem.id
    } else {
      break
    }
  }

  return currentId
}

function getReturnItems(allItems, edits, item) {
  let id = item.item_id
  if (edits) {
    id = findOriginalItemId(edits, id)
  }

  const line = allItems.find((li) => li.id === id)

  if (!line) {
    return
  }

  return {
    title: line.title,
    quantity: item.quantity,
    requestedQuantity: item.requested_quantity,
    receivedQuantity: item.received_quantity,
    variant: {
      title: line?.variant?.title || "-",
    },
    thumbnail: line.thumbnail,
  }
}

function getClaimItem(claimItem) {
  return {
    title: claimItem.item.title,
    quantity: claimItem.quantity,
    thumbnail: claimItem.item.thumbnail,
    variant: {
      title: claimItem.item.variant?.title,
    },
  }
}

function getSwapItem(item) {
  return {
    title: item.title,
    quantity: item.quantity,
    thumbnail: item.thumbnail,
    variant: { title: item.variant?.title },
  }
}

function getWasRefundClaim(claimId, order) {
  const claim = order.claims.find((c) => c.id === claimId)

  if (!claim) {
    return false
  }

  return claim.type === "refund"
}

function getFulfilmentItem(allItems, edits, item) {
  let id = item.item_id
  if (edits) {
    id = findOriginalItemId(edits, id)
  }

  const line = allItems.find((line) => line.id === id)

  if (!line) {
    return
  }

  return {
    title: line.title,
    quantity: item.quantity,
    thumbnail: line.thumbnail,
    variant: { title: line?.variant?.title || "-" },
  }
}
