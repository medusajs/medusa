import {
  SidebarSectionItemsType,
  SidebarItemType as UiSidebarItemType,
} from "docs-ui"

export declare type SidebarItemType = UiSidebarItemType & {
  isSoon: boolean
  number?: string
}

export declare type SidebarConfig = SidebarSectionItemsType
