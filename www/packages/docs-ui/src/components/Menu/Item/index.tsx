"use client"

import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { MenuItemLink } from "types"

export type MenuItemProps = {
  item: MenuItemLink
}

export const MenuItem = ({ item }: MenuItemProps) => {
  return (
    <Link
      className={clsx(
        "flex py-docs_0.25 px-docs_0.5",
        "gap-docs_0.5 rounded-docs_xs",
        "hover:bg-medusa-bg-component-hover",
        "text-medusa-fg-base"
      )}
      href={item.link}
    >
      <span className="text-medusa-fg-subtle mt-[2.5px] block">
        {item.icon}
      </span>
      <span className="text-compact-small">{item.title}</span>
    </Link>
  )
}
