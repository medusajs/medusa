import React from "react"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import Actionables, { ActionType } from "../actionables"

type EventActionablesProps = {
  actions: ActionType[]
}

const EventActionables: React.FC<EventActionablesProps> = ({ actions }) => {
  const EventTrigger = (
    <button className="btn-ghost py-0 px-2xsmall flex justify-center items-center focus:outline-none focus:ring-2 rounded-base focus:ring-violet-40">
      <MoreHorizontalIcon size={20} />
    </button>
  )
  return (
    <Actionables customTrigger={EventTrigger} forceDropdown actions={actions} />
  )
}

export default EventActionables
