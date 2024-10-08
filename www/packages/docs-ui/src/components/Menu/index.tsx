import clsx from "clsx"
import React from "react"
import { MenuItem as MenuItemType } from "types"
import { MenuItem } from "./Item"
import { MenuDivider } from "./Divider"
import { MenuAction } from "./Action"

export type MenuProps = {
  items: MenuItemType[]
  className?: string
}

export const Menu = ({ items, className }: MenuProps) => {
  return (
    <div
      className={clsx(
        "bg-medusa-bg-component py-docs_0.25 rounded-docs_DEFAULT",
        "shadow-elevation-flyout dark:shadow-elevation-flyout-dark",
        className
      )}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.type === "link" && <MenuItem item={item} />}
          {item.type === "action" && <MenuAction item={item} />}
          {item.type === "divider" && <MenuDivider />}
        </React.Fragment>
      ))}
    </div>
  )
}
