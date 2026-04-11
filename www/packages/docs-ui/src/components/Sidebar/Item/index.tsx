"use client"

import React from "react"
import { Sidebar } from "types"
import { SidebarItemLink } from "./Link"
import { SidebarItemSubCategory } from "./SubCategory"
import { DottedSeparator } from "@/components/DottedSeparator"
import { SidebarItemCategory } from "./Category"
import { SidebarItemSidebar } from "./Sidebar"

export type SidebarItemProps = {
  item: Sidebar.SidebarItem
  nested?: boolean
  hasNextItems?: boolean
  isParentCategoryOpen?: boolean
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
    case "ref":
    case "external":
      return <SidebarItemLink item={item} {...props} />
    case "sidebar":
      return <SidebarItemSidebar item={item} {...props} />
    case "separator":
      return <DottedSeparator />
  }
}
