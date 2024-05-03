export enum SidebarItemSections {
  TOP = "top",
  BOTTOM = "bottom",
  MOBILE = "mobile",
}

export type SidebarItemType = {
  path?: string
  title: string
  pageTitle?: string
  additionalElms?: React.ReactNode
  children?: SidebarItemType[]
  loaded?: boolean
  isPathHref?: boolean
  linkProps?: React.AllHTMLAttributes<HTMLAnchorElement>
  isChildSidebar?: boolean
  hasTitleStyling?: boolean
  childSidebarTitle?: string
}

export type SidebarSectionItemsType = {
  [k in SidebarItemSections]: SidebarItemType[]
} & {
  parentItem?: SidebarItemType
}

export type RawSidebarItemType = SidebarItemType & {
  autogenerate_path?: string
  number?: string
}
