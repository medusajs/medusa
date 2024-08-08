"use client"

import React from "react"
import { SidebarTitle } from "../Title"
import { InteractiveSidebarItem } from "types"
import { SidebarSeparator } from "../Separator"
import { SidebarTopNavigationDropdown } from "./NavigationDropdown"
import { SearchModalOpener } from "../../.."
import { SidebarTopMobileClose } from "./MobileClose"

export type SidebarTopProps = {
  parentItem?: InteractiveSidebarItem
}

export const SidebarTop = React.forwardRef<HTMLDivElement, SidebarTopProps>(
  function SidebarTop({ parentItem }, ref) {
    return (
      <div className="py-docs_0.75 pb-0">
        <SidebarTopMobileClose />
        <div ref={ref} className="hidden lg:block">
          <SidebarTopNavigationDropdown />
          <SidebarSeparator />
          <SearchModalOpener />
          {parentItem && (
            <>
              <SidebarSeparator />
              <SidebarTitle item={parentItem} />
            </>
          )}
          <SidebarSeparator className="!mb-0" />
        </div>
      </div>
    )
  }
)
