"use client"

import React from "react"
import { SidebarChild } from "../Child"
import { SidebarTopMobileClose } from "./MobileClose"
import { useSidebar } from "@/providers/Sidebar"
import { DottedSeparator } from "@/components/DottedSeparator"
import clsx from "clsx"

export const SidebarTop = React.forwardRef<HTMLDivElement>(
  function SidebarTop(props, ref) {
    const { sidebarHistory } = useSidebar()

    return (
      <div
        className={clsx(
          "pt-docs_0.25 sticky top-0 z-[5]",
          "bg-medusa-bg-base lg:bg-medusa-bg-subtle"
        )}
        ref={ref}
      >
        <SidebarTopMobileClose />
        <div>
          {sidebarHistory.length > 1 && (
            <>
              <SidebarChild />
              <DottedSeparator wrapperClassName="!my-0" />
            </>
          )}
        </div>
      </div>
    )
  }
)
