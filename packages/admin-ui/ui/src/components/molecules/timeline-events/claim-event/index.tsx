import {
  useAdminCancelClaim,
  useAdminCancelReturn,
  useAdminOrder,
} from "medusa-react"
import { Fragment } from "react"
import CreateFulfillmentModal from "../../../../domain/orders/details/create-fulfillment"
import { ReceiveReturnMenu } from "../../../../domain/orders/details/receive-return"
import useOrdersExpandParam from "../../../../domain/orders/details/utils/use-admin-expand-paramter"
import { ClaimEvent } from "../../../../hooks/use-build-timeline"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../utils/error-messages"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import CancelIcon from "../../../fundamentals/icons/cancel-icon"
import TrashIcon from "../../../fundamentals/icons/trash-icon"
import { ActionType } from "../../actionables"
import {
  FulfillmentStatus,
  RefundStatus,
  ReturnStatus,
} from "../../order-status"
import EventActionables from "../event-actionables"
import EventContainer, {
  EventContainerProps,
  EventIconColor,
} from "../event-container"
import EventItemContainer from "../event-item-container"

type Props = {
  event: ClaimEvent
}

const Claim = ({ event }: Props) => {
  const {
    state: stateReceiveMenu,
    open: openReceiveMenu,
    close: closeReceiveMenu,
  } = useToggleState()

  const {
    state: stateFulfillMenu,
    open: openFulfillMenu,
    close: closeFulfillMenu,
  } = useToggleState()

  const { orderRelations } = useOrdersExpandParam()
  // Orders and returns aren't linked in `medusa-react` so we need to manually refetch the order
  const { refetch } = useAdminOrder(event.orderId, {
    expand: orderRelations,
  })

  const notification = useNotification()

  const shouldHaveButtonActions =
    !event.canceledAt &&
    (event.claim?.return_order || event.claim?.additional_items?.length > 0)

  const { mutate: cancelReturn } = useAdminCancelReturn(
    event.claim?.return_order?.id
  )

  const { mutate: cancelClaim } = useAdminCancelClaim(event.order?.id)

  const onCancelClaim = () => {
    cancelClaim(event.claim.id, {
      onSuccess: () => {
        notification("Claim canceled", "The claim has been canceled", "success")
      },
      onError: (err) => {
        notification("Failed to cancel claim", getErrorMessage(err), "error")
      },
    })
  }

  const onCancelReturn = () => {
    cancelReturn(undefined, {
      onSuccess: () => {
        notification(
          "Return canceled",
          "The return has been canceled",
          "success"
        )
        refetch()
      },
      onError: (err) => {
        notification("Failed to cancel return", getErrorMessage(err), "error")
      },
    })
  }

  const Actions = renderClaimActions(event, onCancelClaim, onCancelReturn)

  const eventContainerArgs: EventContainerProps = {
    icon: event.canceledAt ? <CancelIcon size={20} /> : <AlertIcon size={20} />,
    iconColor: event.canceledAt
      ? EventIconColor.DEFAULT
      : EventIconColor.ORANGE,
    title: event.canceledAt ? "Claim Canceled" : "Claim Created",
    time: event.canceledAt ? event.canceledAt : event.time,
    topNode: Actions,
    children: [
      <Fragment key={event.id}>
        <div className="gap-y-base flex flex-col">
          <ClaimStatus event={event} />
          {renderClaimItems(event)}
          {event.claim?.additional_items?.length > 0 &&
            renderReplacementItems(event)}
          {shouldHaveButtonActions && (
            <div className="gap-x-xsmall flex items-center">
              {event.claim.return_order?.status === "requested" && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={openReceiveMenu}
                >
                  Receive Return
                </Button>
              )}
              {event.claim?.additional_items?.length > 0 &&
                event.claim?.fulfillment_status === "not_fulfilled" && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={openFulfillMenu}
                  >
                    Fulfill Replacement
                  </Button>
                )}
            </div>
          )}
        </div>
        {stateReceiveMenu && (
          <ReceiveReturnMenu
            onClose={closeReceiveMenu}
            order={event.order}
            returnRequest={event.claim.return_order}
          />
        )}
        {stateFulfillMenu && (
          <CreateFulfillmentModal
            handleCancel={closeFulfillMenu}
            orderToFulfill={event.claim}
            orderId={event.claim.order_id}
          />
        )}
      </Fragment>,
    ],
  }

  return <EventContainer {...eventContainerArgs} />
}

export default Claim

const ClaimStatus = ({ event }: Props) => {
  const divider = <div className="bg-grey-20 h-11 w-px" />

  const shouldHaveFulfillment =
    !!event.claim?.fulfillment_status &&
    event.claim?.additional_items?.length > 0
  const shouldHaveReturnStatus = !!event.claim?.return_order

  let refundStatus: string = event.claim?.payment_status

  if (event.claim?.type === "replace") {
    refundStatus =
      event.claim?.return_order?.status === "received"
        ? "refunded"
        : event.claim?.payment_status
  }

  if (event.canceledAt !== null) {
    refundStatus = "canceled"
  }

  return (
    <div className="inter-small-regular gap-x-base flex items-center">
      <div className="gap-y-2xsmall flex flex-col">
        <span className="text-grey-50">Refund:</span>
        <RefundStatus refundStatus={refundStatus} />
      </div>
      {shouldHaveReturnStatus && (
        <>
          {divider}
          <div className="gap-y-2xsmall flex flex-col">
            <span className="text-grey-50">Return:</span>
            <ReturnStatus returnStatus={event.returnStatus} />
          </div>
        </>
      )}
      {shouldHaveFulfillment && (
        <>
          {divider}
          <div className="gap-y-2xsmall flex flex-col">
            <span className="text-grey-50">Fulfillment:</span>
            <FulfillmentStatus
              fulfillmentStatus={event.claim?.fulfillment_status}
            />
          </div>
        </>
      )}
    </div>
  )
}

const renderClaimItems = (event: ClaimEvent) => {
  return (
    <div className="gap-y-small flex flex-col">
      <span className="inter-small-regular text-grey-50">Claim Items</span>
      <div>
        {event.claimItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

const renderReplacementItems = (event: ClaimEvent) => {
  return (
    <div className="gap-y-small flex flex-col">
      <span className="inter-small-regular text-grey-50">
        Replacement Items
      </span>
      <div>
        {event.newItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

const renderClaimActions = (
  event: ClaimEvent,
  onCancelClaim: () => void,
  onCancelReturn: () => void
) => {
  const actions: ActionType[] = []

  if (!event.canceledAt && !event.isCanceled) {
    if (
      event.claim.return_order &&
      event.claim.return_order?.status === "requested"
    ) {
      actions.push({
        icon: <TrashIcon size={20} />,
        label: "Cancel return",
        variant: "danger",
        onClick: onCancelReturn,
      })
    }

    if (event.refundStatus !== "refunded" && !event.isCanceled) {
      actions.push({
        icon: <TrashIcon size={20} />,
        label: "Cancel claim",
        variant: "danger",
        onClick: onCancelClaim,
      })
    }
  }

  return actions.length ? <EventActionables actions={actions} /> : null
}
