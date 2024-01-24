import React from "react"
import clsx from "clsx"
import { PlusMini } from "@medusajs/icons"

export type DetailsSummaryProps = {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  expandable?: boolean
  open?: boolean
  className?: string
  titleClassName?: string
  hideExpandableIcon?: boolean
  summaryRef?: React.LegacyRef<HTMLDivElement>
} & Omit<React.HTMLAttributes<HTMLElement>, "title">

export const DetailsSummary = ({
  title,
  subtitle,
  children,
  badge,
  expandable = true,
  open = false,
  className,
  titleClassName,
  hideExpandableIcon = false,
  summaryRef,
  ...rest
}: DetailsSummaryProps) => {
  return (
    <summary
      className={clsx(
        "py-docs_0.75 flex items-center justify-between",
        expandable && "cursor-pointer",
        !expandable &&
          "border-medusa-border-base border-y border-solid border-x-0",
        (expandable || badge) && "gap-0.5",
        "no-marker",
        className
      )}
      ref={summaryRef}
      {...rest}
    >
      <span className="gap-docs_0.25 flex flex-col">
        <span
          className={clsx(
            "text-compact-medium-plus text-medusa-fg-base",
            titleClassName
          )}
        >
          {title || children}
        </span>
        {subtitle && (
          <span className="text-compact-medium text-medusa-fg-subtle mt-0.5">
            {subtitle}
          </span>
        )}
      </span>
      {(badge || expandable) && (
        <span className="flex gap-docs_0.5">
          {badge}
          {expandable && !hideExpandableIcon && (
            <PlusMini
              className={clsx("transition-transform", open && "rotate-45")}
            />
          )}
        </span>
      )}
    </summary>
  )
}
