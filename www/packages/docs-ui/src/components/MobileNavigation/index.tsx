"use client"

import clsx from "clsx"
import React from "react"
import { SidebarLeftIcon } from "../Icons/SidebarLeft"
import { Button, SearchModalOpener, useSidebar } from "../.."
import { SidebarTopNavigationDropdown } from "../Sidebar/Top/NavigationDropdown"

export const MobileNavigation = () => {
  const { setMobileSidebarOpen } = useSidebar()

  return (
    <div
      className={clsx(
        "lg:hidden bg-medusa-bg-base",
        "sticky top-0 w-full z-50 h-min",
        "px-docs_0.75 py-docs_0.5",
        "flex justify-between items-center",
        "border-b border-medusa-border-base"
      )}
    >
      <Button
        variant="transparent-clear"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <SidebarLeftIcon />
      </Button>
      <SidebarTopNavigationDropdown />
      <SearchModalOpener />
    </div>
  )
}
