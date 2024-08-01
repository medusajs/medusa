"use client"

import React from "react"
import clsx from "clsx"
import { InteractiveSidebarItem } from "types"
import { ArrowUturnLeft } from "@medusajs/icons"
import { useSidebar } from "../../.."

type SidebarTitleProps = {
  item: InteractiveSidebarItem
}

export const SidebarTitle = ({ item }: SidebarTitleProps) => {
  const { goBack } = useSidebar()

  return (
    <div
      onClick={goBack}
      className={clsx(
        "flex items-center justify-start my-docs_0.75 gap-[10px]",
        "border border-transparent cursor-pointer",
        "!text-medusa-fg-base !text-compact-small-plus"
      )}
      tabIndex={-1}
    >
      <ArrowUturnLeft className="mr-[10px]" />
      <span>{item.childSidebarTitle || item.title}</span>
    </div>
  )
}
