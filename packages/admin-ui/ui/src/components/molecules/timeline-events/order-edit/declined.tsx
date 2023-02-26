import { useAdminCustomer, useAdminOrderEdit, useAdminUser } from "medusa-react"
import React from "react"

import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import XCircleIcon from "../../../fundamentals/icons/x-circle-icon"
import EventContainer from "../event-container"
import { isDeclinedByUser } from "../../../../domain/orders/edit/utils/user"
import { ByLine } from "."

type EditDeclinedProps = {
  event: OrderEditEvent
}

const EditDeclined: React.FC<EditDeclinedProps> = ({ event }) => {
  const { order_edit: orderEdit } = useAdminOrderEdit(event.edit.id)

  const declinedByAdmin = isDeclinedByUser(event.edit)

  const { user } = useAdminUser(event.edit.declined_by as string, {
    enabled: declinedByAdmin && !!event.edit.declined_by,
  })

  const { customer } = useAdminCustomer(event.edit.declined_by as string, {
    enabled: !declinedByAdmin && !!event.edit.declined_by,
  })

  const note = orderEdit?.declined_reason

  return (
    <EventContainer
      title={"Order Edit declined"}
      icon={<XCircleIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={<ByLine user={customer || user} />}
    >
      {note && (
        <div className="px-base py-small mt-base rounded-large bg-grey-10 inter-base-regular text-grey-90">
          {note}
        </div>
      )}
    </EventContainer>
  )
}

export default EditDeclined
