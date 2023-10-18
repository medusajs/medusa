import React from "react"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import clsx from "clsx"
import { Link } from "@/components"

export type CardProps = {
  icon?: React.ReactNode
  title: string
  text?: string
  href?: string
  className?: string
}

export const Card = ({ icon, title, text, href, className }: CardProps) => {
  return (
    <div
      className={clsx(
        "bg-medusa-bg-subtle w-full rounded",
        "shadow-card-rest dark:shadow-card-rest-dark py-docs_0.75 relative px-docs_1",
        "flex items-center gap-docs_1 transition-shadow",
        href && "hover:shadow-card-hover dark:hover:shadow-card-hover-dark",
        className
      )}
    >
      {icon}
      <div className="flex items-center gap-docs_1 justify-between flex-1">
        <div className="flex flex-col">
          <span className="text-compact-medium-plus text-medusa-fg-base">
            {title}
          </span>
          {text && (
            <span className="text-compact-medium text-medusa-fg-subtle">
              {text}
            </span>
          )}
        </div>

        {href && (
          <>
            <ArrowUpRightOnBox className="text-medusa-fg-subtle" />
            <Link
              href={href}
              className="absolute left-0 top-0 h-full w-full rounded"
            />
          </>
        )}
      </div>
    </div>
  )
}
