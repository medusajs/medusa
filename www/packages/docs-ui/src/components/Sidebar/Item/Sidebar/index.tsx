"use client"

// @refresh reset

import React, { useMemo } from "react"
import { Sidebar } from "types"
import { Badge } from "@/components/Badge"
import { useSidebar } from "@/providers/Sidebar"
import clsx from "clsx"
import Link from "next/link"

export type SidebarItemSidebarProps = {
  item: Sidebar.SidebarItemSidebar
  nested?: boolean
} & React.AllHTMLAttributes<HTMLLIElement>

export const SidebarItemSidebar = ({
  item,
  className,
  nested = false,
}: SidebarItemSidebarProps) => {
  const { getSidebarFirstLinkChild: getSidebarFirstChild } = useSidebar()

  const isTitleOneWord = useMemo(
    () => item.title.split(" ").length === 1,
    [item.title]
  )

  const firstChild = useMemo(() => getSidebarFirstChild(item), [item])

  return (
    <li>
      <span className="block px-docs_0.75">
        <Link
          href={
            firstChild?.isPathHref ? firstChild.path : `#${firstChild?.path}`
          }
          className={clsx(
            "py-docs_0.25 px-docs_0.5",
            "block w-full rounded-docs_sm",
            !isTitleOneWord && "break-words",
            !nested && "text-medusa-fg-subtle",
            nested && "text-medusa-fg-muted",
            "hover:bg-medusa-bg-base-hover lg:hover:bg-medusa-bg-subtle-hover",
            "text-compact-small-plus",
            "flex justify-between items-center gap-[6px]",
            className
          )}
          {...firstChild?.linkProps}
        >
          <span
            className={clsx(
              isTitleOneWord && "truncate",
              nested && "inline-block pl-docs_1.5"
            )}
            data-testid="sidebar-item-title"
          >
            {item.title}
          </span>
          {item.additionalElms}
          {item.badge && (
            <Badge variant={item.badge.variant}>{item.badge.text}</Badge>
          )}
        </Link>
      </span>
    </li>
  )
}
