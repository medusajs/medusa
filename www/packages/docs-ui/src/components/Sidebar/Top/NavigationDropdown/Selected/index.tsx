"use client"

import React from "react"
import { NavigationDropdownItem } from "types"
import { TrianglesMini } from "@medusajs/icons"
import clsx from "clsx"
import { SidebarTopNavigationDropdownIcon } from "../Icon"

export type SidebarTopNavigationDropdownSelectedProps = {
  item: NavigationDropdownItem
  onClick: () => void
}

export const SidebarTopNavigationDropdownSelected = ({
  item,
  onClick,
}: SidebarTopNavigationDropdownSelectedProps) => {
  if (item.type === "divider") {
    return <></>
  }

  return (
    <div
      className={clsx(
        "flex gap-docs_0.5 justify-between items-center",
        "cursor-pointer rounded-docs_sm hover:bg-medusa-bg-hover"
      )}
      tabIndex={-1}
      onClick={onClick}
    >
      <SidebarTopNavigationDropdownIcon icon={item.icon} />
      <span className="text-medusa-fg-base whitespace-nowrap flex-1">
        {item.title}
      </span>
      <TrianglesMini className="text-medusa-fg-muted" />
    </div>
  )
}
