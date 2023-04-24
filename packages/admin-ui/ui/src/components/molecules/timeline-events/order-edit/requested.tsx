import React, { useState } from "react"
import { useAdminNotifications } from "medusa-react"

import { OrderEditRequestedEvent } from "../../../../hooks/use-build-timeline"
import MailIcon from "../../../fundamentals/icons/mail-icon"
import EventContainer from "../event-container"
import Button from "../../../fundamentals/button"
import ResendModal from "../notification/resend-modal"

type RequestedProps = {
  event: OrderEditRequestedEvent
}

const EditRequested: React.FC<RequestedProps> = ({ event }) => {
  const [showResend, setShowResend] = useState(false)

  const { notifications } = useAdminNotifications({
    resource_id: event.edit?.id,
  })

  const notification = notifications?.find(
    (n) => n.event_name === "order-edit.requested"
  )

  if (!notification) {
    return null
  }

  return (
    <>
      <EventContainer
        title={"Order Edit confirmation-request sent"}
        icon={<MailIcon size={20} />}
        time={event.time}
        isFirst={event.first}
        midNode={
          <span className="inter-small-regular text-grey-50">
            {event.email}
          </span>
        }
      >
        <Button
          className="w-full border border-grey-20 mb-5"
          size="small"
          variant="ghost"
          onClick={() => setShowResend(true)}
        >
          Resend Confirmation-Request
        </Button>
      </EventContainer>
      {showResend && (
        <ResendModal
          handleCancel={() => setShowResend(false)}
          notificationId={notification.id}
          email={notification.to}
        />
      )}
    </>
  )
}

export default EditRequested
