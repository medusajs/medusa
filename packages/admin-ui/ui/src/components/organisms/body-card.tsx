import clsx from "clsx"
import React, { ReactNode } from "react"
import { useScroll } from "../../hooks/use-scroll"
import Button from "../fundamentals/button"
import Actionables, { ActionType } from "../molecules/actionables"

type BodyCardProps = {
  title?: string | JSX.Element | ReactNode
  subtitle?: ReactNode
  events?: {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
    disabled?: boolean
  }[]
  actionables?: ActionType[]
  forceDropdown?: boolean
  customActionable?: React.ReactNode
  status?: React.ReactNode
  customHeader?: React.ReactNode
  compact?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const BodyCard: React.FC<BodyCardProps> = ({
  title,
  subtitle,
  events,
  actionables,
  forceDropdown = false,
  customActionable,
  status,
  customHeader,
  className,
  children,
  compact = false,
  ...rest
}) => {
  const { isScrolled, scrollListener } = useScroll({ threshold: 16 })
  return (
    <div
      className={clsx(
        "relative rounded-rounded border bg-grey-0 border-grey-20 flex flex-col h-full w-full",
        { "min-h-[350px]": !compact },
        className
      )}
      {...rest}
    >
      <div className="relative">
        {isScrolled && (
          <div className="absolute rounded-t-rounded top-0 left-0 right-0 bg-gradient-to-b from-grey-0 to-[rgba(255,255,255,0)] h-xlarge z-10" />
        )}
      </div>

      <div
        className="pt-medium px-xlarge flex flex-col grow"
        onScroll={scrollListener}
      >
        <div className="flex items-center justify-between mt-6 flex-wrap gap-2">
          {customHeader ? (
            <div className="flex-auto">{customHeader}</div>
          ) : title ? (
            <h1 className="inter-xlarge-semibold text-grey-90">{title}</h1>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            {status && status}
            <Actionables
              actions={actionables}
              forceDropdown={forceDropdown}
              customTrigger={customActionable}
            />
          </div>
        </div>
        {subtitle && (
          <h3 className="inter-small-regular pt-1.5 text-grey-50">
            {subtitle}
          </h3>
        )}
        {children && (
          <div
            className={clsx("flex flex-col", {
              "my-large grow": !compact,
            })}
          >
            {children}
          </div>
        )}
      </div>

      {events && events.length > 0 ? (
        <div className="sticky -bottom-8 bg-white pb-large pt-base px-xlarge border-t border-grey-20 rounded-b">
          <div className="flex items-center flex-row-reverse">
            {events.map((event, i: React.Key) => {
              return (
                <Button
                  key={i}
                  onClick={event.onClick}
                  className="first:ml-xsmall min-w-[130px] justify-center"
                  variant={i === 0 ? "primary" : "ghost"}
                  size={"small"}
                  type={event.type}
                  disabled={event.disabled}
                >
                  {event.label}
                </Button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="min-h-[24px]" />
      )}
    </div>
  )
}

export default BodyCard
