import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { SidebarItemType } from "types"

type SidebarTitleProps = {
  item: SidebarItemType
}

export const SidebarTitle = ({ item }: SidebarTitleProps) => {
  return (
    <Link
      className={clsx(
        "flex items-center justify-between gap-docs_0.5 rounded-docs_sm px-docs_0.5 pb-[6px] hover:no-underline",
        "border border-transparent",
        "text-medusa-fg-subtle text-large-plus"
      )}
      href={item.isPathHref && item.path ? item.path : `#${item.path}`}
      replace={!item.isPathHref}
      shallow={!item.isPathHref}
      {...item.linkProps}
    >
      <span>{item.childSidebarTitle || item.title}</span>
      {item.additionalElms}
    </Link>
  )
}
