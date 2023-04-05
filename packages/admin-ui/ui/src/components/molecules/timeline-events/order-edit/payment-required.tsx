import { useAdminOrder, useAdminOrderEdits } from "medusa-react"
import React from "react"

import { PaymentRequiredEvent } from "../../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import EventContainer, { EventIconColor } from "../event-container"

type RequestedProps = {
  event: PaymentRequiredEvent
}

const PaymentRequired: React.FC<RequestedProps> = ({ event }) => {
  const { order_edits: edits } = useAdminOrderEdits({ order_id: event.orderId })
  const { order } = useAdminOrder(event.orderId)

  const requestedEditDifferenceDue =
    edits?.find((e) => e.status === "requested")?.difference_due || 0

  if (!order || !edits) {
    return null
  }

  const amount = requestedEditDifferenceDue
    ? order.total - order.paid_total + requestedEditDifferenceDue
    : order.refunded_total - order.paid_total

  if (amount <= 0) {
    return null
  }

  const onCopyPaymentLinkClicked = () => {
    console.log("TODO")
  }

  const onMarkAsPaidClicked = () => {
    console.log("TODO")
  }

  return (
    <EventContainer
      title={"Customer payment required"}
      icon={<AlertIcon size={20} />}
      iconColor={EventIconColor.VIOLET}
      time={event.time}
      isFirst={event.first}
      midNode={
        <span className="inter-small-regular text-grey-50">
          {formatAmountWithSymbol({
            amount,
            currency: event.currency_code,
          })}
        </span>
      }
    >
      <Button
        size="small"
        className="border-grey-20 mb-xsmall w-full border"
        variant="ghost"
        onClick={onCopyPaymentLinkClicked}
      >
        Copy Payment Link
      </Button>
      <Button
        size="small"
        className="border-grey-20 w-full border"
        variant="ghost"
        onClick={onMarkAsPaidClicked}
      >
        Mark as Paid
      </Button>
    </EventContainer>
  )
}

export default PaymentRequired
