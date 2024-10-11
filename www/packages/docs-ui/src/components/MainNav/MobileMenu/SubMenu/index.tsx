"use client"

import clsx from "clsx"
import Link from "next/link"
import React, { useMemo } from "react"
import { MenuItem, MenuItemLink } from "types"

type MainNavMobileSubMenuProps = {
  menu: MenuItem[]
  title: string
}

export const MainNavMobileSubMenu = ({
  menu,
  title,
}: MainNavMobileSubMenuProps) => {
  const filteredItems: MenuItemLink[] = useMemo(() => {
    return menu.filter((item) => item.type === "link") as MenuItemLink[]
  }, [menu])
  return (
    <div className="flex flex-col gap-[23px]">
      <span className="text-compact-small-plus text-medusa-fg-muted uppercase">
        {title}
      </span>
      <ul className="flex flex-col gap-[18px]">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "text-h1 text-medusa-fg-base cursor-pointer",
              "flex justify-between gap-docs_1"
            )}
          >
            <Link href={item.link} className="block w-full">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
