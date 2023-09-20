"use client"

import React from "react"
import { useSidebar } from "@/providers"
import clsx from "clsx"
import { Loading } from "@/components"
import { SidebarItem } from "./Item"

export type SidebarProps = {
  className?: string
  expandItems?: boolean
}

export const Sidebar = ({
  className = "",
  expandItems = false,
}: SidebarProps) => {
  const { items, mobileSidebarOpen, desktopSidebarOpen } = useSidebar()

  return (
    <aside
      className={clsx(
        "clip bg-docs-bg dark:bg-docs-bg-dark w-ref-sidebar block",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-r border-solid",
        "fixed -left-full top-[57px] h-screen transition-[left] lg:relative lg:left-0 lg:top-auto lg:h-auto",
        "lg:w-sidebar z-[100] w-full lg:z-0",
        mobileSidebarOpen && "!left-0",
        !desktopSidebarOpen && "!absolute !-left-full",
        className
      )}
      style={{
        animationFillMode: "forwards",
      }}
    >
      <ul
        className={clsx(
          "sticky top-[57px] h-screen max-h-screen w-full list-none overflow-auto p-0",
          "px-docs_1.5 pb-[57px] pt-docs_1.5"
        )}
        id="sidebar"
      >
        <div className="mb-docs_1.5 lg:hidden">
          {!items.mobile.length && <Loading className="px-0" />}
          {items.mobile.map((item, index) => (
            <SidebarItem item={item} key={index} expandItems={expandItems} />
          ))}
        </div>
        <div className="mb-docs_1.5">
          {!items.top.length && <Loading className="px-0" />}
          {items.top.map((item, index) => (
            <SidebarItem item={item} key={index} expandItems={expandItems} />
          ))}
        </div>
        <div className="mb-docs_1.5">
          {!items.bottom.length && <Loading className="px-0" />}
          {items.bottom.map((item, index) => (
            <SidebarItem item={item} key={index} expandItems={expandItems} />
          ))}
        </div>
      </ul>
    </aside>
  )
}
