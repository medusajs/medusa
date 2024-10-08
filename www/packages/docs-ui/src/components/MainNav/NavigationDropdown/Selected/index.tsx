"use client"

import React from "react"
import { NavigationDropdownItem } from "types"
import { TrianglesMini } from "@medusajs/icons"
import clsx from "clsx"
import { MainNavigationDropdownIcon } from "../Icon"

export type MainNavigationDropdownSelectedProps = {
  item: NavigationDropdownItem
  onClick: () => void
  isActive: boolean
}

export const MainNavigationDropdownSelected = ({
  item,
  onClick,
  isActive,
}: MainNavigationDropdownSelectedProps) => {
  if (item.type === "divider") {
    return <></>
  }

  return (
    <div
      className={clsx(
        "flex justify-between items-center gap-docs_0.25",
        "cursor-pointer rounded-docs_sm group"
      )}
      tabIndex={-1}
      onClick={onClick}
    >
      <MainNavigationDropdownIcon icon={item.icon} />
      <div
        className={clsx(
          "flex gap-[6px] py-docs_0.25 px-docs_0.5",
          "items-center group-hover:bg-medusa-button-transparent-hover",
          "rounded-docs_sm",
          isActive && "bg-medusa-button-transparent-hover"
        )}
      >
        <span className="text-medusa-fg-base whitespace-nowrap flex-1 text-compact-small-plus">
          {item.title}
        </span>
        <TrianglesMini className="text-medusa-fg-muted" />
      </div>
    </div>
  )
}
