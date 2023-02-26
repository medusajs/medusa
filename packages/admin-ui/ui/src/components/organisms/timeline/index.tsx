import clsx from "clsx"
import { useAdminCreateNote, useAdminOrder } from "medusa-react"
import React, { useState } from "react"

import RegisterClaimMenu from "../../../domain/orders/details/claim/register-claim-menu"
import ReturnMenu from "../../../domain/orders/details/returns"
import SwapMenu from "../../../domain/orders/details/swap/create"
import { orderReturnableFields } from "../../../domain/orders/details/utils/order-returnable-fields"
import useOrdersExpandParam from "../../../domain/orders/details/utils/use-admin-expand-paramter"
import {
  ClaimEvent,
  ExchangeEvent,
  ItemsFulfilledEvent,
  ItemsShippedEvent,
  NoteEvent,
  NotificationEvent,
  OrderEditEvent,
  OrderEditRequestedEvent,
  OrderPlacedEvent,
  PaymentRequiredEvent,
  RefundEvent,
  RefundRequiredEvent,
  ReturnEvent,
  TimelineEvent,
  useBuildTimeline,
} from "../../../hooks/use-build-timeline"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import Spinner from "../../atoms/spinner"
import AlertIcon from "../../fundamentals/icons/alert-icon"
import BackIcon from "../../fundamentals/icons/back-icon"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import Actionables, { ActionType } from "../../molecules/actionables"
import NoteInput from "../../molecules/note-input"
import Claim from "../../molecules/timeline-events/claim-event"
import Exchange from "../../molecules/timeline-events/exchange"
import ItemsFulfilled from "../../molecules/timeline-events/items-fulfilled"
import ItemsShipped from "../../molecules/timeline-events/items-shipped"
import Note from "../../molecules/timeline-events/note"
import Notification from "../../molecules/timeline-events/notification"
import OrderCanceled from "../../molecules/timeline-events/order-canceled"
import EditCanceled from "../../molecules/timeline-events/order-edit/canceled"
import EditConfirmed from "../../molecules/timeline-events/order-edit/confirmed"
import EditCreated from "../../molecules/timeline-events/order-edit/created"
import EditDeclined from "../../molecules/timeline-events/order-edit/declined"
import PaymentRequired from "../../molecules/timeline-events/order-edit/payment-required"
import RefundRequired from "../../molecules/timeline-events/order-edit/refund-required"
import EditRequested from "../../molecules/timeline-events/order-edit/requested"
import OrderPlaced from "../../molecules/timeline-events/order-placed"
import Refund from "../../molecules/timeline-events/refund"
import Return from "../../molecules/timeline-events/return"

type TimelineProps = {
  orderId: string
}

const Timeline: React.FC<TimelineProps> = ({ orderId }) => {
  const { orderRelations } = useOrdersExpandParam()

  const { events, refetch } = useBuildTimeline(orderId)
  const notification = useNotification()
  const createNote = useAdminCreateNote()
  const { order } = useAdminOrder(orderId, {
    expand: orderRelations,
    fields: orderReturnableFields,
  })

  const [showRequestReturn, setShowRequestReturn] = useState(false)
  const [showCreateSwap, setshowCreateSwap] = useState(false)

  const {
    state: showRegisterClaim,
    close: closeRegisterClaim,
    open: openRegisterClaim,
  } = useToggleState()

  const actions: ActionType[] = [
    {
      icon: <BackIcon size={20} />,
      label: "Request Return",
      onClick: () => setShowRequestReturn(true),
    },
    {
      icon: <RefreshIcon size={20} />,
      label: "Register Exchange",
      onClick: () => setshowCreateSwap(true),
    },
    {
      icon: <AlertIcon size={20} />,
      label: "Register Claim",
      onClick: openRegisterClaim,
    },
  ]

  const handleCreateNote = (value: string | undefined) => {
    if (!value) {
      return
    }
    createNote.mutate(
      {
        resource_id: orderId,
        resource_type: "order",
        value: value,
      },
      {
        onSuccess: () => notification("Success", "Added note", "success"),
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <>
      <div className="h-full w-5/12 rounded-rounded border border-grey-20 bg-grey-0">
        <div className="border-b border-grey-20 py-large px-xlarge">
          <div className="flex items-center justify-between">
            <h3 className="inter-xlarge-semibold">Timeline</h3>
            <div
              className={clsx({
                "pointer-events-none opacity-50": !events,
              })}
            >
              <Actionables actions={actions} />
            </div>
          </div>
          <div
            className={clsx("mt-base", {
              "pointer-events-none opacity-50": !events,
            })}
          >
            <NoteInput onSubmit={handleCreateNote} />
          </div>
        </div>
        <div className="py-large px-xlarge">
          {!events ? (
            <div className="flex h-96 w-full items-center justify-center">
              <Spinner variant="secondary" size="large" />
            </div>
          ) : (
            <div className="flex flex-col">
              {events.map((event, i) => {
                return <div key={i}>{switchOnType(event, refetch)}</div>
              })}
            </div>
          )}
        </div>
      </div>
      {showRequestReturn && order && (
        <ReturnMenu
          order={order}
          onDismiss={() => setShowRequestReturn(false)}
        />
      )}
      {showCreateSwap && order && (
        <SwapMenu order={order} onDismiss={() => setshowCreateSwap(false)} />
      )}
      {showRegisterClaim && order && (
        <RegisterClaimMenu order={order} onClose={closeRegisterClaim} />
      )}
    </>
  )
}

function switchOnType(event: TimelineEvent, refetch: () => void) {
  switch (event.type) {
    case "placed":
      return <OrderPlaced event={event as OrderPlacedEvent} />
    case "fulfilled":
      return <ItemsFulfilled event={event as ItemsFulfilledEvent} />
    case "note":
      return <Note event={event as NoteEvent} />
    case "shipped":
      return <ItemsShipped event={event as ItemsShippedEvent} />
    case "canceled":
      return <OrderCanceled event={event as TimelineEvent} />
    case "return":
      return <Return event={event as ReturnEvent} refetch={refetch} />
    case "exchange":
      return (
        <Exchange
          key={event.id}
          event={event as ExchangeEvent}
          refetch={refetch}
        />
      )
    case "claim":
      return <Claim event={event as ClaimEvent} />
    case "notification":
      return <Notification event={event as NotificationEvent} />
    case "refund":
      return <Refund event={event as RefundEvent} />
    case "edit-created":
      return <EditCreated event={event as OrderEditEvent} />
    case "edit-canceled":
      return <EditCanceled event={event as OrderEditEvent} />
    case "edit-declined":
      return <EditDeclined event={event as OrderEditEvent} />
    case "edit-confirmed":
      return <EditConfirmed event={event as OrderEditEvent} />
    case "edit-requested":
      return <EditRequested event={event as OrderEditRequestedEvent} />
    case "refund-required":
      return <RefundRequired event={event as RefundRequiredEvent} />
    case "payment-required":
      return <PaymentRequired event={event as PaymentRequiredEvent} />
    default:
      return null
  }
}

export default Timeline
