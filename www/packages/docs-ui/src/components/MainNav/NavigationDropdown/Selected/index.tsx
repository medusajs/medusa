"use client"

import React from "react"
import { NavigationDropdownItem } from "types"
import { TrianglesMini } from "@medusajs/icons"
import clsx from "clsx"
import { MainNavigationDropdownIcon } from "../Icon"

export type MainNavigationDropdownSelectedProps = {
  item: NavigationDropdownItem
  onClick: () => void
}

export const MainNavigationDropdownSelected = ({
  item,
  onClick,
}: MainNavigationDropdownSelectedProps) => {
  if (item.type === "divider") {
    return <></>
  }

  return (
    <div
      className={clsx(
        "flex justify-between items-center",
        "cursor-pointer rounded-docs_sm hover:bg-medusa-bg-hover"
      )}
      tabIndex={-1}
      onClick={onClick}
    >
      <MainNavigationDropdownIcon icon={item.icon} />
      <div className="flex gap-[6px] py-docs_0.25 px-docs_0.5 items-center">
        <span className="text-medusa-fg-base whitespace-nowrap flex-1">
          {item.title}
        </span>
        <TrianglesMini className="text-medusa-fg-muted" />
      </div>
    </div>
  )
}
