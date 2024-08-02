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
  childrenSameLevel?: boolean
  // TODO maybe remove?
  pageTitle?: string
}

export type SidebarItemCategory = SidebarItemCommon & {
  type: "category"
  onOpen?: () => void
  autoExpandOnActive?: boolean
}

export type SidebarItemSubCategory = SidebarItemCommon & {
  type: "sub-category"
  childrenSameLevel?: boolean
}

export type SidebarItemSeparator = {
  type: "separator"
}

export type InteractiveSidebarItem =
  | SidebarItemLink
  | SidebarItemCategory
  | SidebarItemSubCategory

export type SidebarItem = InteractiveSidebarItem | SidebarItemSeparator

export type SidebarSectionItems = {
  [k in SidebarItemSections]: SidebarItem[]
} & {
  parentItem?: InteractiveSidebarItem
}

export type RawSidebarItem = SidebarItem & {
  autogenerate_path?: string
  number?: string
}
