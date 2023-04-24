import clsx from "clsx"
import moment from "moment"
import React, { ReactNode, useState } from "react"
import Tooltip from "../../atoms/tooltip"
import BellOffIcon from "../../fundamentals/icons/bell-off-icon"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"

export enum EventIconColor {
  GREEN = "text-emerald-40",
  RED = "text-rose-50",
  ORANGE = "text-orange-40",
  VIOLET = "text-violet-60",
  DEFAULT = "text-grey-50",
}

type EventContainerProps = {
  icon: React.ReactNode
  iconColor?: EventIconColor
  title: string
  time: Date
  noNotification?: boolean
  topNode?: React.ReactNode
  midNode?: React.ReactNode
  isFirst?: boolean
  expandable?: boolean
  children: ReactNode
}

const EventContainer: React.FC<EventContainerProps> = ({
  icon,
  iconColor = EventIconColor.DEFAULT,
  title,
  topNode,
  midNode,
  time,
  noNotification = false,
  isFirst = false,
  expandable = false,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!expandable)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="mb-base">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-xsmall">
          <div className={clsx("h-5 w-5", iconColor)}>{icon}</div>
          <div className="inter-small-semibold">{title}</div>
          <div className="inter-small-regular text-grey-50"></div>
        </div>
        <div className="flex items-center gap-x-xsmall">
          {noNotification && (
            <Tooltip content="Notifications related to this event are disabled">
              <BellOffIcon size={20} className="text-grey-40" />
            </Tooltip>
          )}
          {topNode}
          {expandable && (
            <button onClick={toggleExpand}>
              {isExpanded ? (
                <ChevronUpIcon size={16} />
              ) : (
                <ChevronDownIcon size={16} />
              )}
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-x-xsmall">
        <div className="w-5 flex justify-center pt-base">
          {!isFirst && <div className="w-px min-h-[24px]" />}
        </div>
        <div className="mt-2xsmall w-full inter-small-regular">
          <div className="flex items-center">
            <Tooltip content={new Date(time).toUTCString()}>
              <div className="text-grey-50 inter-small-regular">
                {moment(time).fromNow()}
              </div>
            </Tooltip>
            {midNode && (
              <span className="mx-2xsmall ">
                <Dot />
              </span>
            )}
            {midNode}
          </div>
          {children && isExpanded && (
            <div className="mt-small w-full pb-base">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}

const Dot = ({ size = "2px", bg = "bg-grey-50" }) => {
  return <div className={`w-[2px] h-[2px] aspect-square ${bg} rounded-full`} />
}

export default EventContainer
