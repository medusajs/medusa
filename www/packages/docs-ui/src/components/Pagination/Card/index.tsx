import { TriangleLeftMini, TriangleRightMini } from "@medusajs/icons"
import clsx from "clsx"
import Link from "next/link"
import React from "react"

type PaginationCardProps = {
  type: "previous" | "next"
  title: string
  parentTitle?: string
  link: string
  className?: string
}

export const PaginationCard = ({
  type,
  title,
  parentTitle,
  link,
  className,
}: PaginationCardProps) => {
  return (
    <div
      className={clsx(
        "relative flex-1",
        "py-docs_0.5 px-docs_0.75 rounded",
        "bg-medusa-bg-component hover:bg-medusa-bg-component-hover",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        "hover:shadow-elevation-card-hover dark:shadow-elevation-card-hover-dark",
        className
      )}
    >
      <Link href={link} className="absolute top-0 left-0 w-full h-full" />
      <div className={clsx("h-[40px] flex gap-docs_0.75 items-center")}>
        {type === "previous" && (
          <TriangleLeftMini className="text-medusa-fg-muted" />
        )}
        <div
          className={clsx(
            "flex-1",
            type === "previous" && "text-left",
            type === "next" && "text-right"
          )}
        >
          {parentTitle && (
            <span className="block text-compact-small text-medusa-fg-subtle">
              {parentTitle}
            </span>
          )}
          <span className="block text-compact-small-plus text-medusa-fg-base">
            {title}
          </span>
        </div>
        {type === "next" && (
          <TriangleRightMini className="text-medusa-fg-muted" />
        )}
      </div>
    </div>
  )
}
