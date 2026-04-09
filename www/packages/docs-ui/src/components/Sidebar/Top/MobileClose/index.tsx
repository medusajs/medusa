"use client"

import React from "react"
import { useSidebar } from "@/providers/Sidebar"
import { Button } from "@/components/Button"
import { XMarkMini } from "@medusajs/icons"

export const SidebarTopMobileClose = () => {
  const { setMobileSidebarOpen } = useSidebar()

  return (
    <div className="m-docs_0.75 lg:hidden">
      <Button
        variant="transparent-clear"
        onClick={() => setMobileSidebarOpen(false)}
        className="!p-0 hover:!bg-transparent"
      >
        <XMarkMini className="text-medusa-fg-subtle" />
      </Button>
    </div>
  )
}
