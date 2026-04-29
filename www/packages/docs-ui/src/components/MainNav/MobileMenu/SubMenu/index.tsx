"use client"

import clsx from "clsx"
import Link from "next/link"
import React, { useMemo } from "react"
import { MenuItem, MenuItemLink, MenuItemSubMenu } from "types"
import { SelectedMenu } from ".."
import { TriangleRightMini } from "@medusajs/icons"

type MainNavMobileSubMenuProps = {
  menu: MenuItem[]
  title: string
  setSelectedMenus: React.Dispatch<React.SetStateAction<SelectedMenu>>
  onOpenLink?: () => void
}

export const MainNavMobileSubMenu = ({
  menu,
  title,
  setSelectedMenus,
  onOpenLink,
}: MainNavMobileSubMenuProps) => {
  const filteredItems: (MenuItemLink | MenuItemSubMenu)[] = useMemo(() => {
    return menu.filter(
      (item) => item.type === "link" || item.type === "sub-menu"
    ) as (MenuItemLink | MenuItemSubMenu)[]
  }, [menu])
  return (
    <div className="flex flex-col gap-[23px] max-h-[90%]">
      <span
        className="text-compact-small-plus text-medusa-fg-muted uppercase"
        data-testid="menu-title"
      >
        {title}
      </span>
      <ul className="flex flex-col gap-[18px] max-h-full overflow-auto">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "text-h1 text-medusa-fg-base cursor-pointer",
              "flex justify-between gap-docs_1"
            )}
          >
            {item.type === "link" && (
              <Link
                href={item.link}
                className="block w-full"
                onClick={() => onOpenLink?.()}
                data-testid="link-item"
              >
                {item.title}
              </Link>
            )}
            {item.type === "sub-menu" && (
              <div
                className="w-full flex justify-between gap-docs_1"
                onClick={() =>
                  setSelectedMenus((prev) => [
                    ...prev,
                    {
                      title: item.title,
                      menu: item.items,
                    },
                  ])
                }
                data-testid="sub-menu-item"
              >
                <span>{item.title}</span>
                <TriangleRightMini />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
