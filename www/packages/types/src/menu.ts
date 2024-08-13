export type MenuItemLink = {
  type: "link"
  icon: React.ReactNode
  title: string
  link: string
}

export type MenuItemDivider = {
  type: "divider"
}

export type MenuItemAction = {
  type: "action"
  icon: React.ReactNode
  title: string
  shortcut?: string
}

export type MenuItem = MenuItemLink | MenuItemDivider | MenuItemAction
