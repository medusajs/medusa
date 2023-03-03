import React, { MutableRefObject, ReactNode } from "react"
import StatusIndicator from "../../fundamentals/status-indicator"
import Tooltip from "../../atoms/tooltip"
import clsx from "clsx"

export type ActivityCardProps = {
  key?: string
  title: string
  icon?: ReactNode
  relativeTimeElapsed?: string
  date?: string | Date
  shouldShowStatus?: boolean
  children?: ReactNode[]
}

export const ActivityCard: React.FC<ActivityCardProps> = (
  props: ActivityCardProps
) => {
  const {
    key,
    title,
    icon,
    relativeTimeElapsed,
    shouldShowStatus,
    children
  } = props

  const date = !!props.date && new Date(props.date).toLocaleDateString(
    "en-us",
    {
      hour12: true,
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
  const formattedDate = !!date && date.replace(",", " at")

  const getTimeElement = () => {
    return (
      <div className="flex cursor-default">
        {
          !!relativeTimeElapsed && (
            <span >{relativeTimeElapsed}</span>
          )
        }
        {
          shouldShowStatus &&
          <StatusIndicator variant={"primary"} className="ml-2"/>
        }
      </div>
    )
  }

  return (
    <div key={key} className="mx-8 border-b last:border-b-0 border-grey-20">
      <div className="flex hover:bg-grey-5 -mx-8 px-8 py-6">
        <div className="relative w-full h-full">
          <div className="flex justify-between inter-small-semibold text-grey-90">
            <div className="flex">
              {
                !!icon && icon
              }
              <span>{title}</span>
            </div>

            {
              ((!!relativeTimeElapsed || shouldShowStatus)) && (
                formattedDate ? (
                  <Tooltip content={formattedDate}>
                    {getTimeElement()}
                  </Tooltip>
                ) : (
                  getTimeElement()
                )
              )
            }
          </div>

          <div className={clsx(!!icon && "pl-8")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
