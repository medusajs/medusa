"use client"

import React from "react"
import { SidebarTitle } from "../Title"
import { SidebarItemType } from "types"
import { SidebarTopSeparator } from "./Separator"
import { SidebarTopNavigationDropdown } from "./NavigationDropdown"
import { SearchModalOpener } from "../../.."
import { SidebarTopMobileClose } from "./MobileClose"

export type SidebarTopProps = {
  banner?: React.ReactNode
  parentItem?: SidebarItemType
}

export const SidebarTop = React.forwardRef<HTMLDivElement, SidebarTopProps>(
  function SidebarTop({ banner, parentItem }, ref) {
    return (
      <>
        <SidebarTopMobileClose />
        <div ref={ref} className="hidden lg:block">
          <SidebarTopNavigationDropdown />
          <SidebarTopSeparator />
          <SearchModalOpener className="my-docs_0.75" />
          {/* {banner && <div className="my-docs_0.75">{banner}</div>} */}
          {parentItem && (
            <>
              <SidebarTopSeparator />
              <SidebarTitle item={parentItem} />
            </>
          )}
          <SidebarTopSeparator />
        </div>
      </>
    )
  }
)
