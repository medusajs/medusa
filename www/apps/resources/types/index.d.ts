import { SidebarItemType as UiSidebarItemType } from "docs-ui"

export declare type SidebarItemType = UiSidebarItemType & {
  autogenerate_path?: string
  children?: SidebarItemType[]
}
