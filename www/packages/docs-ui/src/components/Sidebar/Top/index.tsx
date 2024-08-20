"use client"

import React from "react"
import { SidebarChild } from "../Child"
import { InteractiveSidebarItem } from "types"
import { SidebarTopMobileClose } from "./MobileClose"
import { SidebarTopMedusaMenu } from "./MedusaMenu"
import { DottedSeparator } from "../../.."

export type SidebarTopProps = {
  parentItem?: InteractiveSidebarItem
}

export const SidebarTop = React.forwardRef<HTMLDivElement, SidebarTopProps>(
  function SidebarTop({ parentItem }, ref) {
    return (
      <div className="pt-docs_0.25">
        <SidebarTopMobileClose />
        <div ref={ref}>
          <SidebarTopMedusaMenu />
          {parentItem && (
            <>
              <DottedSeparator />
              <SidebarChild item={parentItem} />
            </>
          )}
          <DottedSeparator className="!my-0" />
        </div>
      </div>
    )
  }
)
