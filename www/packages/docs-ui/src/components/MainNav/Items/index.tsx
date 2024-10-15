"use client"

import React from "react"
import { useMainNav } from "../../.."
import clsx from "clsx"
import { MainNavItemLink } from "./Link"
import { MainNavItemDropdown } from "./Dropdown"

export const MainNavItems = () => {
  const { navItems, activeItemIndex } = useMainNav()

  return (
    <ul
      className={clsx(
        "hidden lg:flex justify-start gap-docs_1 items-center",
        "my-docs_0.75"
      )}
    >
      {navItems.map((item, index) => {
        const isActive = index === activeItemIndex

        return (
          <li className={clsx("flex items-center group")} key={index}>
            {item.type === "link" && (
              <MainNavItemLink item={item} isActive={isActive} />
            )}
            {item.type === "dropdown" && (
              <MainNavItemDropdown item={item} isActive={isActive} />
            )}
          </li>
        )
      })}
    </ul>
  )
}
