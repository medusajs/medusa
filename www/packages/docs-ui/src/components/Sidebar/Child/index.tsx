"use client"

import React from "react"
import clsx from "clsx"
import { InteractiveSidebarItem } from "types"
import { ArrowUturnLeft } from "@medusajs/icons"
import { useSidebar } from "../../.."

type SidebarTitleProps = {
  item: InteractiveSidebarItem
}

export const SidebarChild = ({ item }: SidebarTitleProps) => {
  const { goBack } = useSidebar()

  return (
    <div className="px-docs_0.75">
      <div
        onClick={goBack}
        className={clsx(
          "flex items-center justify-start my-docs_0.75 gap-[10px]",
          "border border-transparent cursor-pointer mx-docs_0.5",
          "!text-medusa-fg-base !text-compact-small-plus"
        )}
        tabIndex={-1}
      >
        <ArrowUturnLeft />
        <span className="truncate flex-1">
          {item.childSidebarTitle || item.title}
        </span>
      </div>
    </div>
  )
}
