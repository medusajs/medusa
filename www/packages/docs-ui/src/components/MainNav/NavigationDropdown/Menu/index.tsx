"use client"

import clsx from "clsx"
import React from "react"
import { NavigationDropdownItem } from "types"
import { MainNavigationDropdownMenuItem } from "./Item"

export type MainNavigationDropdownMenuProps = {
  items: NavigationDropdownItem[]
  open: boolean
  onSelect: () => void
}

export const MainNavigationDropdownMenu = ({
  items,
  open,
  onSelect,
}: MainNavigationDropdownMenuProps) => {
  return (
    <ul
      className={clsx(
        "absolute top-[calc(100%+4px)] p-docs_0.25 z-50 lg:-left-docs_0.25",
        "bg-medusa-bg-component rounded shadow-elevation-flyout",
        !open && "hidden"
      )}
    >
      {items.map((item, index) => (
        <MainNavigationDropdownMenuItem
          item={item}
          key={index}
          onSelect={onSelect}
        />
      ))}
    </ul>
  )
}
