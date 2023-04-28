import React from "react"
import { AwaitsAllocationEvent } from "../../../../hooks/use-build-timeline"
import EventContainer from "../event-container"
import CircleQuarterSolid from "../../../fundamentals/icons/circle-quarter-solid"

type AllocationCreatedProps = {
  event: AwaitsAllocationEvent
}

const AwaitsAllocation: React.FC<AllocationCreatedProps> = ({ event }) => {
  const args = {
    icon: <CircleQuarterSolid size={20} />,
    time: event.time,
    title: `Awaits Allocation`,
    midNode: (
      <div className="inter-small-regular text-grey-50">{`${
        event.quantity
      } item${event.quantity > 1 ? "s" : ""} is not allocated`}</div>
    ),
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default AwaitsAllocation
