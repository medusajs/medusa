"use client"

import React from "react"
import { NavigationDropdownItem } from "types"
import { SidebarSeparator } from "../../../../Separator"
import Link from "next/link"
import clsx from "clsx"
import { EllipseMiniSolid } from "@medusajs/icons"
import { SidebarTopNavigationDropdownIcon } from "../../Icon"

export type SidebarTopNavigationDropdownMenuItemProps = {
  item: NavigationDropdownItem
}

export const SidebarTopNavigationDropdownMenuItem = ({
  item,
}: SidebarTopNavigationDropdownMenuItemProps) => {
  switch (item.type) {
    case "divider":
      return <SidebarSeparator className="my-docs_0.25" />
    case "link":
      return (
        <Link
          href={item.path}
          className={clsx(
            "hover:bg-medusa-bg-component-hover",
            "block rounded-docs_xs"
          )}
        >
          <li
            className={clsx(
              "px-docs_0.5 py-docs_0.25",
              "rounded-docs_xs text-medusa-fg-base",
              "flex gap-docs_0.5 justify-start items-center"
            )}
          >
            <span className={clsx(!item.isActive && "invisible")}>
              <EllipseMiniSolid />
            </span>
            <SidebarTopNavigationDropdownIcon icon={item.icon} />
            <span className="whitespace-nowrap">{item.title}</span>
          </li>
        </Link>
      )
  }
}
