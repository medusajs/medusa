"use client"

import { TriangleDownMini } from "@medusajs/icons"
import clsx from "clsx"
import React, { useRef, useState } from "react"
import { NavigationItemDropdown } from "types"
import { Menu } from "../../../.."

type MainNavItemDropdownProps = {
  item: NavigationItemDropdown
  isActive: boolean
}

export const MainNavItemDropdown = ({
  item,
  isActive,
}: MainNavItemDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={clsx("relative")}
      ref={ref}
      onMouseOver={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={clsx(
          "cursor-pointer flex gap-docs_0.25 items-center",
          isActive && "text-medusa-fg-base",
          !isActive && [
            "text-medusa-fg-muted hover:text-medusa-fg-subtle",
            isOpen && "text-medusa-fg-subtle",
          ]
        )}
        tabIndex={-1}
      >
        <span className="text-compact-small-plus">{item.title}</span>
        <TriangleDownMini
          className={clsx("transition-transform", isOpen && "rotate-180")}
        />
      </div>
      <div className="absolute top-full -left-docs_0.75 pt-docs_0.25">
        <Menu
          className={clsx("min-w-[190px]", !isOpen && "hidden")}
          items={item.children}
          itemsOnClick={() => setIsOpen(false)}
        />
      </div>
    </div>
  )
}
