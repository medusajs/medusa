import React from "react"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import clsx from "clsx"
import { LegacyLink } from "@/components"

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
}: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-medusa-bg-subtle w-full rounded",
        "shadow-card-rest dark:shadow-card-rest-dark py-docs_0.75 relative px-docs_1",
        "flex items-start gap-docs_1 transition-shadow",
        href && "hover:shadow-card-hover dark:hover:shadow-card-hover-dark",
        className
      )}
    >
      {startIcon}
      <div className="flex items-start gap-docs_1 justify-between flex-1">
        <div className={clsx("flex flex-col", contentClassName)}>
          {title && (
            <span className="text-compact-medium-plus text-medusa-fg-base">
              {title}
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
            {/* TODO replace with Link once we move away from Docusaurus */}
            <LegacyLink
              href={href}
              className="absolute left-0 top-0 h-full w-full rounded"
            />
          </>
        )}
      </div>
      {endIcon}
    </div>
  )
}
