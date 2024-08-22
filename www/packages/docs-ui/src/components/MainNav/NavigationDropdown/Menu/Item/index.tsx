"use client"

import React from "react"
import { NavigationDropdownItem } from "types"
import Link from "next/link"
import clsx from "clsx"
import { EllipseMiniSolid } from "@medusajs/icons"
import { MainNavigationDropdownIcon } from "../../Icon"
import { DottedSeparator } from "../../../.."

export type MainNavigationDropdownMenuItemProps = {
  item: NavigationDropdownItem
  onSelect: () => void
}

export const MainNavigationDropdownMenuItem = ({
  item,
  onSelect,
}: MainNavigationDropdownMenuItemProps) => {
  switch (item.type) {
    case "divider":
      return <DottedSeparator className="my-docs_0.25" />
    case "link":
      return (
        <Link
          href={item.path}
          className={clsx(
            "hover:bg-medusa-bg-component-hover",
            "block rounded-docs_xs"
          )}
          prefetch={false}
          onClick={onSelect}
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
            <MainNavigationDropdownIcon icon={item.icon} inDropdown={true} />
            <span className="whitespace-nowrap">{item.title}</span>
          </li>
        </Link>
      )
  }
}
