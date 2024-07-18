import React, { useState } from "react"
import { NotificationEvent } from "../../../../hooks/use-build-timeline"
import ArrowRightIcon from "../../../fundamentals/icons/arrow-right-icon"
import MailIcon from "../../../fundamentals/icons/mail-icon"
import SendIcon from "../../../fundamentals/icons/send-icon"
import EventActionables from "../event-actionables"
import EventContainer from "../event-container"
import ResendModal from "./resend-modal"

type NotificationProps = {
  event: NotificationEvent
}

const notificationTitleMap = {
  "order.items_returned": "Return Received Notice Sent",
  "order.return_requested": "Return Request Confirmation Sent",
  "order.placed": "Order Confirmation Sent",
  "order.shipment_created": "Shipment Confirmation Sent",
}

const Notification: React.FC<NotificationProps> = ({ event }) => {
  const [showResend, setShowResend] = useState(false)

  const actions = (
    <EventActionables
      actions={[
        {
          label: "Re-Send Mail",
          icon: <SendIcon size={20} />,
          onClick: () => setShowResend(true),
        },
      ]}
    />
  )
  return (
    <>
      <EventContainer
        icon={<MailIcon size={20} />}
        title={notificationTitleMap[event.title] || event.title}
        time={event.time}
        topNode={actions}
        midNode={<ReceiverNode email={event.to} />}
      />
      {showResend && (
        <ResendModal
          handleCancel={() => setShowResend(false)}
          notificationId={event.id}
          email={event.to}
        />
      )}
    </>
  )
}

const ReceiverNode: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="flex items-center">
      <div className="text-grey-40 me-2xsmall">
        <ArrowRightIcon size={16} />
      </div>
      <span>{email}</span>
    </div>
  )
}

export default Notification
