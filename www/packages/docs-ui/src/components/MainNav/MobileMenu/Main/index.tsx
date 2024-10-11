"use client"

import React from "react"
import { useMainNav } from "../../../../providers"
import Link from "next/link"
import { TriangleRightMini } from "@medusajs/icons"
import clsx from "clsx"
import { SelectedMenu } from ".."

type MainNavMobileMainMenu = {
  setSelectedMenu: (menu: SelectedMenu) => void
}

export const MainNavMobileMainMenu = ({
  setSelectedMenu,
}: MainNavMobileMainMenu) => {
  const { navItems } = useMainNav()

  return (
    <div className="flex flex-col gap-[23px]">
      <span className="text-compact-small-plus text-medusa-fg-muted uppercase">
        Menu
      </span>
      <ul className="flex flex-col gap-[18px]">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "text-h1 text-medusa-fg-base cursor-pointer",
              "flex justify-between gap-docs_1"
            )}
            onClick={() => {
              if (item.type !== "dropdown") {
                return
              }

              setSelectedMenu({
                title: item.title,
                menu: item.children,
              })
            }}
          >
            {item.type === "link" && (
              <Link href={item.path} className="block w-full">
                {item.title}
              </Link>
            )}
            {item.type === "dropdown" && (
              <>
                <span>{item.title}</span>
                <TriangleRightMini />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
