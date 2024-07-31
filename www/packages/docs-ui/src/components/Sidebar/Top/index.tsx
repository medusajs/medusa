"use client"

import React from "react"
import { SidebarTitle } from "../Title"
import { SidebarItemType } from "types"
import { SidebarTopSeparator } from "./Separator"

export type SidebarTopProps = {
  banner?: React.ReactNode
  parentItem?: SidebarItemType
}

export const SidebarTop = ({ banner, parentItem }: SidebarTopProps) => {
  return (
    <div>
      {banner && <div className="my-docs_0.75">{banner}</div>}
      {parentItem && (
        <>
          <SidebarTopSeparator />
          <SidebarTitle item={parentItem} />
        </>
      )}
      <SidebarTopSeparator />
    </div>
  )
}
