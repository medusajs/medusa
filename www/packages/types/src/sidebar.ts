export enum SidebarItemSections {
  DEFAULT = "default",
  MOBILE = "mobile",
}

export type SidebarItemCommon = {
  title: string
  children?: SidebarItem[]
  isChildSidebar?: boolean
  hasTitleStyling?: boolean
  childSidebarTitle?: string
  loaded?: boolean
  additionalElms?: React.ReactNode
}

export type SidebarItemLink = SidebarItemCommon & {
  type: "link"
  path: string
  isPathHref?: boolean
  linkProps?: React.AllHTMLAttributes<HTMLAnchorElement>
  // TODO maybe remove?
  pageTitle?: string
}

export type SidebarItemCategory = SidebarItemCommon & {
  type: "category"
}

export type SidebarItem = SidebarItemLink | SidebarItemCategory

export type SidebarSectionItems = {
  [k in SidebarItemSections]: SidebarItem[]
} & {
  parentItem?: SidebarItem
}

export type RawSidebarItemType = SidebarItem & {
  autogenerate_path?: string
  number?: string
}
