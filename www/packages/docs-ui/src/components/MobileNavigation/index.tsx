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
        "lg:hidden",
        "sticky top-0 w-full",
        "px-docs_0.75 py-docs_0.5",
        "flex justify-between items-center"
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
