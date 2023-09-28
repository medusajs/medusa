import React from "react"
import clsx from "clsx"
import { PlusMini } from "@medusajs/icons"

export type DetailsSummaryProps = {
  title: React.ReactNode
  subtitle?: string
  badge?: React.ReactNode
  expandable?: boolean
  open?: boolean
  className?: string
  titleClassName?: string
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
  ...rest
}: DetailsSummaryProps) => {
  return (
    <summary
      className={clsx(
        "py-docs_0.75 flex items-center justify-between",
        expandable && "cursor-pointer",
        !expandable && "border-medusa-border-base border-y",
        "no-marker",
        className
      )}
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
          <span className="text-compact-medium text-medusa-fg-subtle">
            {subtitle}
          </span>
        )}
      </span>
      {(badge || expandable) && (
        <span className="flex gap-docs_0.5">
          {badge}
          {expandable && (
            <PlusMini
              className={clsx("transition-transform", open && "rotate-45")}
            />
          )}
        </span>
      )}
    </summary>
  )
}
