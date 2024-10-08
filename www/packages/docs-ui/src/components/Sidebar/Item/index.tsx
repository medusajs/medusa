"use client"

import React from "react"
import { SidebarItem as SidebarItemType } from "types"
import { SidebarItemCategory } from "./Category"
import { SidebarItemLink } from "./Link"
import { SidebarItemSubCategory } from "./SubCategory"
import { DottedSeparator } from "../.."

export type SidebarItemProps = {
  item: SidebarItemType
  nested?: boolean
  expandItems?: boolean
  hasNextItems?: boolean
} & React.AllHTMLAttributes<HTMLElement>

export const SidebarItem = ({
  item,
  hasNextItems = false,
  ...props
}: SidebarItemProps) => {
  switch (item.type) {
    case "category":
      return (
        <>
          <SidebarItemCategory item={item} {...props} />
          {hasNextItems && <DottedSeparator />}
        </>
      )
    case "sub-category":
      return <SidebarItemSubCategory item={item} {...props} />
    case "link":
      return <SidebarItemLink item={item} {...props} />
    case "separator":
      return <DottedSeparator />
  }
}
