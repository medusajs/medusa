export type MenuItemLink = {
  type: "link"
  icon: React.ReactNode
  title: string
  link: string
}

export type MenuItemDivider = {
  type: "divider"
}

export type MenuItem = MenuItemLink | MenuItemDivider
