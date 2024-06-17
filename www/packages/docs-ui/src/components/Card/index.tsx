import React from "react"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import clsx from "clsx"
import { Badge, BadgeProps, Link } from "@/components"

export type CardProps = {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  title?: string
  text?: string
  href?: string
  className?: string
  contentClassName?: string
  children?: React.ReactNode
  showLinkIcon?: boolean
  isExternal?: boolean
  badge?: BadgeProps
}

export const Card = ({
  startIcon,
  endIcon,
  title,
  text,
  href,
  className,
  contentClassName,
  children,
  showLinkIcon = true,
  isExternal = false,
  badge,
}: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-medusa-bg-subtle w-full rounded",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark p-docs_0.75 relative",
        "flex items-start gap-docs_0.75 transition-shadow",
        href &&
          "hover:shadow-elevation-card-hover dark:hover:shadow-elevation-card-hover-dark",
        className
      )}
    >
      {startIcon}
      <div className="flex items-start gap-docs_1 justify-between flex-1">
        <div className={clsx("flex flex-col", contentClassName)}>
          {title && (
            <span className={clsx(badge && "flex gap-docs_0.5")}>
              <span className="text-compact-medium-plus text-medusa-fg-base">
                {title}
              </span>
              {badge && <Badge {...badge} />}
            </span>
          )}
          {text && (
            <span className="text-compact-medium text-medusa-fg-subtle">
              {text}
            </span>
          )}
          {children}
        </div>

        {href && (
          <>
            {showLinkIcon && (
              <ArrowUpRightOnBox className="text-medusa-fg-subtle min-w-[20px]" />
            )}
            <Link
              href={href}
              className="absolute left-0 top-0 h-full w-full rounded"
              target={isExternal ? "_blank" : undefined}
            />
          </>
        )}
      </div>
      {endIcon}
    </div>
  )
}
