import { SidebarSectionItems, SidebarItem as SidebarItemType } from "types"

export declare type SidebarItem = SidebarItemType & {
  isSoon: boolean
  number?: string
}

export declare type SidebarConfig = SidebarSectionItems
