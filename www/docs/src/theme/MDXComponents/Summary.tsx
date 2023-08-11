import React from "react"
import clsx from "clsx"
import IconPlusMini from "../Icon/PlusMini"

export type MDXSummaryProps = {
  subtitle?: string
  badge?: React.ReactNode
  titleClassName?: string
  open?: boolean
  className?: string
} & React.HTMLAttributes<HTMLElement>

const MDXSummary = ({
  children,
  subtitle,
  badge,
  titleClassName,
  open,
  ...props
}: MDXSummaryProps) => {
  return (
    <summary
      className={clsx(
        "flex items-center justify-between py-0.75 cursor-pointer",
        "no-marker",
        props.className
      )}
      {...props}
    >
      <span className="flex flex-col gap-0.25">
        <span
          className={clsx(
            "text-compact-medium-plus text-medusa-fg-base dark:text-medusa-fg-base-dark",
            titleClassName
          )}
        >
          {children}
        </span>
        {subtitle && (
          <span className="text-compact-medium text-medusa-fg-subtle dark:text-medusa-bg-subtle-dark">
            {subtitle}
          </span>
        )}
      </span>
      <span className="flex gap-0.5">
        {badge}
        <IconPlusMini
          className={clsx("transition-transform", open && "rotate-45")}
        />
      </span>
    </summary>
  )
}

export default MDXSummary
