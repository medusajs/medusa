"use client"

import React from "react"
import { SidebarChild } from "../Child"
import { InteractiveSidebarItem } from "types"
import { SidebarTopMobileClose } from "./MobileClose"
import { DottedSeparator } from "../../.."
import clsx from "clsx"

export type SidebarTopProps = {
  parentItem?: InteractiveSidebarItem
}

export const SidebarTop = React.forwardRef<HTMLDivElement, SidebarTopProps>(
  function SidebarTop({ parentItem }, ref) {
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
          {parentItem && (
            <>
              <SidebarChild item={parentItem} />
              <DottedSeparator wrapperClassName="!my-0" />
            </>
          )}
        </div>
      </div>
    )
  }
)
