import React from "react"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import Actionables, { ActionType } from "../actionables"

type EventActionablesProps = {
  actions: ActionType[]
}

const EventActionables: React.FC<EventActionablesProps> = ({ actions }) => {
  const EventTrigger = (
    <button className="btn-ghost px-2xsmall rounded-base focus:ring-violet-40 flex items-center justify-center py-0 focus:outline-none focus:ring-2">
      <MoreHorizontalIcon size={20} />
    </button>
  )
  return (
    <Actionables customTrigger={EventTrigger} forceDropdown actions={actions} />
  )
}

export default EventActionables
