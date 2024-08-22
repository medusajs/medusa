"use client"

import React from "react"
import { Button, useSidebar } from "../../.."
import clsx from "clsx"
import { SidebarLeft } from "@medusajs/icons"

export const MainNavSidebarOpener = () => {
  const { desktopSidebarOpen, setDesktopSidebarOpen } = useSidebar()

  if (desktopSidebarOpen) {
    return <></>
  }

  return (
    <Button
      variant="transparent-clear"
      className={clsx("!p-[6.5px] text-medusa-fg-muted", "mr-docs_0.5")}
      onClick={() => setDesktopSidebarOpen(true)}
    >
      <SidebarLeft />
    </Button>
  )
}
