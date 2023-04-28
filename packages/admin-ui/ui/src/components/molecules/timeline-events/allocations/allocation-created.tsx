import { AllocationCreatedEvent } from "../../../../hooks/use-build-timeline"
import CheckCircleFillIcon from "../../../fundamentals/icons/check-circle-fill-icon"
import EventContainer from "../event-container"
import React from "react"

type AllocationCreatedProps = {
  event: AllocationCreatedEvent
}

const AllocationCreated: React.FC<AllocationCreatedProps> = ({ event }) => {
  const args = {
    icon: <CheckCircleFillIcon size={20} />,
    time: event.time,
    title: `${event.quantity} items allocated`,
    midNode: (
      <div className="inter-small-regular text-grey-50">
        {event.locationName}
      </div>
    ),
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default AllocationCreated
