"use client"

import React from "react"
import { SidebarTitle } from "../Title"
import { SidebarItem } from "types"
import { SidebarSeparator } from "../Separator"
import { SidebarTopNavigationDropdown } from "./NavigationDropdown"
import { SearchModalOpener } from "../../.."
import { SidebarTopMobileClose } from "./MobileClose"

export type SidebarTopProps = {
  banner?: React.ReactNode
  parentItem?: SidebarItem
}

export const SidebarTop = React.forwardRef<HTMLDivElement, SidebarTopProps>(
  function SidebarTop({ banner, parentItem }, ref) {
    return (
      <div className="p-docs_0.75 pb-0">
        <SidebarTopMobileClose />
        <div ref={ref} className="hidden lg:block">
          <SidebarTopNavigationDropdown />
          <SidebarSeparator />
          <SearchModalOpener className="my-docs_0.75" />
          {/* {banner && <div className="my-docs_0.75">{banner}</div>} */}
          {parentItem && (
            <>
              <SidebarSeparator />
              <SidebarTitle item={parentItem} />
            </>
          )}
          <SidebarSeparator />
        </div>
      </div>
    )
  }
)
