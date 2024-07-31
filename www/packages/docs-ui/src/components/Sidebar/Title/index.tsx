import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { SidebarItem } from "types"
import { ArrowUturnLeft } from "@medusajs/icons"

type SidebarTitleProps = {
  item: SidebarItem
}

export const SidebarTitle = ({ item }: SidebarTitleProps) => {
  return (
    <Link
      className={clsx(
        "flex items-center justify-between my-docs_0.75 gap-docs_[10px] hover:no-underline",
        "border border-transparent",
        "text-medusa-fg-base text-compact-small-plus"
      )}
      href={
        item.type === "link"
          ? item.isPathHref && item.path
            ? item.path
            : `#${item.path}`
          : "#"
      }
      replace={item.type === "link" && !item.isPathHref}
      shallow={item.type === "link" && !item.isPathHref}
      {...(item.type === "link" ? item.linkProps : {})}
    >
      <ArrowUturnLeft className="mr-docs_[10px]" />
      <span>{item.childSidebarTitle || item.title}</span>
    </Link>
  )
}
