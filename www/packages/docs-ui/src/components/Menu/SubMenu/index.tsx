"use client"

import React, { useState } from "react"
import { Menu, MenuProps } from ".."
import clsx from "clsx"
import { MenuItemSubMenu } from "types"
import { TriangleRightMini } from "@medusajs/icons"
import Link from "next/link"

type MenuSubMenuProps = Pick<MenuProps, "itemsOnClick"> & {
  item: MenuItemSubMenu
}

export const MenuSubMenu = ({ item, itemsOnClick }: MenuSubMenuProps) => {
  const [open, setOpen] = useState(false)

  const Component = item.link ? Link : "span"

  return (
    <div
      className="px-docs_0.25 relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      data-testid="sub-menu-wrapper"
    >
      <Component
        className={clsx(
          "flex py-docs_0.25 px-docs_0.5",
          "gap-docs_0.5 rounded-docs_xs",
          "hover:bg-medusa-bg-component-hover",
          "text-medusa-fg-base justify-between"
        )}
        onClick={() => itemsOnClick?.(item)}
        href={item.link || "#"}
      >
        <span className="text-compact-small">{item.title}</span>
        <span className="text-medusa-fg-subtle mt-[2.5px] block">
          <TriangleRightMini />
        </span>
      </Component>
      {open && (
        <div className="absolute top-0 left-[calc(100%-8px)] w-max">
          <Menu itemsOnClick={itemsOnClick} items={item.items} />
        </div>
      )}
    </div>
  )
}
