export interface SidebarNavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  label?: string
  items?: SidebarNavItem[]
}
