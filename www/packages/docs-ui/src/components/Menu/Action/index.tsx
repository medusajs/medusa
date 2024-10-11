"use client"

import clsx from "clsx"
import React from "react"
import { MenuItem, MenuItemAction } from "types"

export type MenuActionProps = {
  item: MenuItemAction
  onClick?: (item: MenuItem) => void
}

export const MenuAction = ({ item, onClick }: MenuActionProps) => {
  return (
    <div className="px-docs_0.25">
      <span
        className={clsx(
          "flex py-docs_0.25 px-docs_0.5",
          "gap-docs_0.5 rounded-docs_xs",
          "hover:bg-medusa-bg-component-hover",
          "text-medusa-fg-base cursor-pointer"
        )}
        tabIndex={-1}
        onClick={() => {
          item.action()
          onClick?.(item)
        }}
      >
        <span className="text-medusa-fg-subtle mt-[2.5px] block">
          {item.icon}
        </span>
        <span className="text-compact-small flex-1">{item.title}</span>
        {item.shortcut && (
          <span className="text-medusa-fg-subtle text-compact-small">
            {item.shortcut}
          </span>
        )}
      </span>
    </div>
  )
}
