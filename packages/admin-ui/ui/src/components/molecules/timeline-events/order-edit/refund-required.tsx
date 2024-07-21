import { useAdminOrder, useAdminOrderEdits } from "medusa-react"
import React, { useState } from "react"

import { RefundRequiredEvent } from "../../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import EventContainer, { EventIconColor } from "../event-container"
import CreateRefundModal from "../../../../domain/orders/details/refund"

type RequestedProps = {
  event: RefundRequiredEvent
}

const RefundRequired: React.FC<RequestedProps> = ({ event }) => {
  const { order } = useAdminOrder(event.orderId)

  const { order_edits: edits } = useAdminOrderEdits({
    order_id: event.orderId,
  })

  const requestedEditDifferenceDue =
    edits?.find((e) => e.status === "requested")?.difference_due || 0

  const [showRefundModal, setShowRefundModal] = useState(false)

  if (!order || !edits) {
    return null
  }

  const refundableAmount =
    order.paid_total -
    order.refunded_total -
    order.total -
    requestedEditDifferenceDue

  if (refundableAmount <= 0) {
    return null
  }

  return (
    <>
      <EventContainer
        title={"Refund required"}
        icon={<AlertIcon size={20} />}
        iconColor={EventIconColor.RED}
        time={event.time}
        isFirst={event.first}
      >
        <Button
          onClick={() => setShowRefundModal(true)}
          variant="ghost"
          size="small"
          className="border-grey-20 mb-xsmall w-full border text-rose-50"
        >
          Refund
          {formatAmountWithSymbol({
            amount: refundableAmount,
            currency: event.currency_code,
          })}
        </Button>
      </EventContainer>
      {showRefundModal && (
        <CreateRefundModal
          order={order}
          initialAmount={refundableAmount}
          initialReason="other"
          onDismiss={() => setShowRefundModal(false)}
        />
      )}
    </>
  )
}

export default RefundRequired
